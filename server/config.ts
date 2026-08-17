/**
 * Configuration du flux "Sign In with LinkedIn using OpenID Connect".
 *
 * LinkedIn n'expose PKCE que sur le flux natif (`/oauth/native-pkce/authorization`,
 * redirection loopback, activation manuelle par LinkedIn). Pour une application web,
 * `client_secret` est obligatoire à l'échange du code : ces valeurs ne doivent donc
 * jamais être exposées au bundle front.
 */

export interface LinkedInAuthConfig {
  clientId: string;
  clientSecret: string;
  /** Doit correspondre au caractère près à une "Redirect URL" du portail LinkedIn. */
  redirectUri: string;
  scopes: string[];
  sessionSecret: string;
  /** Origine du site, utilisée pour les redirections post-login. */
  appBaseUrl: string;
  /** Durée de vie de la session applicative, en secondes. */
  sessionTtlSeconds: number;
  /** `Secure` sur les cookies : activé dès que le site est servi en HTTPS. */
  cookieSecure: boolean;
}

/**
 * Discriminant textuel volontaire : le `tsconfig.json` du projet n'active pas
 * `strictNullChecks`, mode dans lequel TypeScript ne restreint pas les unions
 * à discriminant booléen (`ok: true | false`).
 */
export type ConfigResult =
  | { status: 'ready'; config: LinkedInAuthConfig }
  | { status: 'incomplete'; missing: string[] };

export type EnvSource = Record<string, string | undefined>;

const DEFAULT_SCOPES = ['openid', 'profile', 'email'];
const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_SESSION_TTL = 60 * 60 * 24 * 7; // 7 jours
const MIN_SECRET_LENGTH = 32;

export const CALLBACK_PATH = '/api/auth/linkedin/callback';

function trimmed(env: EnvSource, key: string): string {
  return (env[key] ?? '').trim();
}

/**
 * Construit la configuration à partir de l'environnement. Ne lève jamais :
 * une configuration incomplète est renvoyée sous forme de liste de variables
 * manquantes, ce qui permet au serveur de démarrer et de répondre 503 avec un
 * message exploitable plutôt que de planter au boot.
 */
export function loadConfig(env: EnvSource = process.env): ConfigResult {
  const missing: string[] = [];

  const clientId = trimmed(env, 'LINKEDIN_CLIENT_ID');
  if (!clientId) missing.push('LINKEDIN_CLIENT_ID');

  const clientSecret = trimmed(env, 'LINKEDIN_CLIENT_SECRET');
  if (!clientSecret) missing.push('LINKEDIN_CLIENT_SECRET');

  const sessionSecret = trimmed(env, 'SESSION_SECRET');
  if (sessionSecret.length < MIN_SECRET_LENGTH) {
    missing.push(`SESSION_SECRET (min. ${MIN_SECRET_LENGTH} caractères)`);
  }

  const appBaseUrl = stripTrailingSlash(trimmed(env, 'APP_BASE_URL') || DEFAULT_BASE_URL);

  // LinkedIn ignore les query params du redirect_uri enregistré et rejette les
  // fragments : on le garde donc strictement égal à `origin + CALLBACK_PATH`.
  const redirectUri = trimmed(env, 'LINKEDIN_REDIRECT_URI') || `${appBaseUrl}${CALLBACK_PATH}`;

  const scopes = (trimmed(env, 'LINKEDIN_SCOPES') || DEFAULT_SCOPES.join(' '))
    .split(/[\s,]+/)
    .filter(Boolean);

  const ttlRaw = Number.parseInt(trimmed(env, 'SESSION_TTL_SECONDS'), 10);
  const sessionTtlSeconds = Number.isFinite(ttlRaw) && ttlRaw > 0 ? ttlRaw : DEFAULT_SESSION_TTL;

  if (missing.length > 0) return { status: 'incomplete', missing };

  return {
    status: 'ready',
    config: {
      clientId,
      clientSecret,
      redirectUri,
      scopes,
      sessionSecret,
      appBaseUrl,
      sessionTtlSeconds,
      cookieSecure: appBaseUrl.startsWith('https://'),
    },
  };
}

function stripTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function describeMissingConfig(missing: string[]): string {
  return (
    `Configuration LinkedIn incomplète. Variables manquantes : ${missing.join(', ')}. ` +
    `Renseignez-les dans .env.local (voir .env.example).`
  );
}
