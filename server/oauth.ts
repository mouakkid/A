/**
 * Client OpenID Connect LinkedIn.
 *
 * Endpoints issus du document de découverte officiel :
 * https://www.linkedin.com/oauth/.well-known/openid-configuration
 */

import { createPublicKey, createVerify, type JsonWebKey } from 'node:crypto';
import type { LinkedInAuthConfig } from './config.ts';
import type { LinkedInProfile } from './session.ts';

export const LINKEDIN_ISSUER = 'https://www.linkedin.com';
export const AUTHORIZATION_ENDPOINT = 'https://www.linkedin.com/oauth/v2/authorization';
export const TOKEN_ENDPOINT = 'https://www.linkedin.com/oauth/v2/accessToken';
export const USERINFO_ENDPOINT = 'https://api.linkedin.com/v2/userinfo';
export const JWKS_URI = 'https://www.linkedin.com/oauth/openid/jwks';

/** Tolérance d'horloge lors de la validation des claims temporels. */
const CLOCK_SKEW_SECONDS = 60;
const JWKS_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;

export class OAuthError extends Error {
  // Champ assigné explicitement plutôt que via une propriété de paramètre :
  // ces dernières ne sont pas supportées par les transpileurs "strip-only"
  // (dont le support TypeScript natif de Node).
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'OAuthError';
    this.code = code;
  }
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  id_token?: string;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

export interface UserInfoResponse {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string | { country?: string; language?: string };
  /** `email` et `email_verified` sont optionnels et peuvent être absents. */
  email?: string;
  email_verified?: boolean;
}

/**
 * Étape 2 du flux : URL de consentement.
 * `state` est obligatoire côté sécurité même si LinkedIn le documente comme optionnel.
 */
export function buildAuthorizationUrl(config: LinkedInAuthConfig, state: string): string {
  const params: Array<[string, string]> = [
    ['response_type', 'code'],
    ['client_id', config.clientId],
    ['redirect_uri', config.redirectUri],
    ['state', state],
    ['scope', config.scopes.join(' ')],
  ];

  // `encodeURIComponent` plutôt que `URLSearchParams`, qui sérialise l'espace en
  // `+` : LinkedIn documente un `scope` séparé par `%20`, et un scope mal
  // interprété se solde par un « Invalid scope » 401 difficile à diagnostiquer.
  const query = params
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${AUTHORIZATION_ENDPOINT}?${query}`;
}

/** Étape 3 : échange du code contre un access token (client_secret obligatoire). */
export async function exchangeCodeForTokens(
  config: LinkedInAuthConfig,
  code: string,
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
  });

  const response = await fetchWithTimeout(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  const text = await response.text();
  if (!response.ok) {
    // Ne jamais propager le corps brut au navigateur : il peut contenir des échos
    // de paramètres sensibles. On journalise côté serveur, on renvoie un code stable.
    console.error(`[linkedin-auth] accessToken ${response.status}: ${text.slice(0, 500)}`);
    throw new OAuthError(
      `Échec de l'échange du code (HTTP ${response.status})`,
      'token_exchange_failed',
    );
  }

  let tokens: TokenResponse;
  try {
    tokens = JSON.parse(text);
  } catch {
    throw new OAuthError('Réponse token illisible', 'token_exchange_failed');
  }

  if (!tokens.access_token) {
    throw new OAuthError('Réponse token sans access_token', 'token_exchange_failed');
  }
  return tokens;
}

/** Étape 4 : récupération du profil. Source de vérité de l'identité. */
export async function fetchUserInfo(accessToken: string): Promise<UserInfoResponse> {
  const response = await fetchWithTimeout(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[linkedin-auth] userinfo ${response.status}: ${text.slice(0, 500)}`);
    throw new OAuthError(`Échec de /v2/userinfo (HTTP ${response.status})`, 'userinfo_failed');
  }

  const info = (await response.json()) as UserInfoResponse;
  if (!info?.sub) throw new OAuthError('Réponse userinfo sans `sub`', 'userinfo_failed');
  return info;
}

export function toProfile(info: UserInfoResponse): LinkedInProfile {
  return {
    sub: info.sub,
    name: info.name,
    givenName: info.given_name,
    familyName: info.family_name,
    picture: info.picture,
    email: info.email,
    emailVerified: info.email_verified,
    locale: normalizeLocale(info.locale),
  };
}

function normalizeLocale(locale: UserInfoResponse['locale']): string | undefined {
  if (typeof locale === 'string') return locale;
  if (locale && typeof locale === 'object') {
    const { language, country } = locale;
    if (language && country) return `${language}-${country}`;
    return language ?? country;
  }
  return undefined;
}

// --------------------------------------------------------------------------
// Vérification de l'ID token
// --------------------------------------------------------------------------

interface JwtHeader {
  alg: string;
  kid?: string;
}

export interface IdTokenClaims {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
}

let jwksCache: { keys: JsonWebKey[]; fetchedAt: number } | null = null;

async function loadJwks(forceRefresh = false): Promise<JsonWebKey[]> {
  const fresh = jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_TTL_MS;
  if (fresh && !forceRefresh) return jwksCache!.keys;

  const response = await fetchWithTimeout(JWKS_URI, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new OAuthError(`Échec du chargement du JWKS (HTTP ${response.status})`, 'jwks_failed');
  }

  const body = (await response.json()) as { keys?: JsonWebKey[] };
  if (!Array.isArray(body?.keys)) throw new OAuthError('JWKS invalide', 'jwks_failed');

  jwksCache = { keys: body.keys, fetchedAt: Date.now() };
  return body.keys;
}

async function findSigningKey(kid: string | undefined): Promise<JsonWebKey> {
  const matches = (keys: JsonWebKey[]) =>
    kid ? keys.find((k) => (k as { kid?: string }).kid === kid) : keys[0];

  let key = matches(await loadJwks());
  // Rotation de clés : une seule tentative de rafraîchissement forcé.
  if (!key) key = matches(await loadJwks(true));
  if (!key) throw new OAuthError(`Clé de signature introuvable (kid=${kid ?? 'n/a'})`, 'jwks_failed');
  return key;
}

/**
 * Vérifie la signature RS256 et les claims `iss` / `aud` / `exp` de l'ID token.
 *
 * OIDC Core §3.1.3.7 autorise à se reposer sur TLS puisque le token arrive par
 * canal arrière ; on vérifie tout de même la signature — c'est peu coûteux et
 * cela protège d'une confusion de configuration côté proxy.
 *
 * Note : LinkedIn ne documente pas le paramètre `nonce` et ne l'expose pas dans
 * `claims_supported`. On ne l'envoie donc pas : valider un nonce jamais renvoyé
 * ferait échouer toutes les connexions.
 */
export async function verifyIdToken(idToken: string, clientId: string): Promise<IdTokenClaims> {
  const segments = idToken.split('.');
  if (segments.length !== 3) throw new OAuthError('ID token malformé', 'id_token_invalid');

  const [encodedHeader, encodedPayload, encodedSignature] = segments;

  let header: JwtHeader;
  let claims: IdTokenClaims;
  try {
    header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
    claims = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    throw new OAuthError('ID token illisible', 'id_token_invalid');
  }

  if (header.alg !== 'RS256') {
    // Refus explicite de `none` et des algorithmes non attendus.
    throw new OAuthError(`Algorithme d'ID token non supporté : ${header.alg}`, 'id_token_invalid');
  }

  const jwk = await findSigningKey(header.kid);
  const publicKey = createPublicKey({ key: jwk, format: 'jwk' });

  const verified = createVerify('RSA-SHA256')
    .update(`${encodedHeader}.${encodedPayload}`)
    .verify(publicKey, Buffer.from(encodedSignature, 'base64url'));

  if (!verified) throw new OAuthError('Signature d\'ID token invalide', 'id_token_invalid');

  if (claims.iss !== LINKEDIN_ISSUER) {
    throw new OAuthError(`Émetteur inattendu : ${claims.iss}`, 'id_token_invalid');
  }

  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(clientId)) {
    throw new OAuthError('ID token émis pour une autre application', 'id_token_invalid');
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== 'number' || claims.exp + CLOCK_SKEW_SECONDS < now) {
    throw new OAuthError('ID token expiré', 'id_token_invalid');
  }

  return claims;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new OAuthError(`Délai dépassé en appelant ${url}`, 'upstream_timeout');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
