/**
 * Sessions applicatives sans état : le profil est stocké dans un cookie signé
 * en HMAC-SHA256 (`payload.signature`, base64url).
 *
 * Le cookie est signé, pas chiffré : il est donc lisible par quiconque accède au
 * navigateur. On n'y met volontairement QUE des claims d'identité publics —
 * jamais l'`access_token` LinkedIn. Un token d'accès nécessitant un stockage
 * côté serveur, voir le README pour l'extension "appels API à la place du membre".
 */

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export interface LinkedInProfile {
  sub: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  email?: string;
  emailVerified?: boolean;
  locale?: string;
}

export interface SessionPayload extends LinkedInProfile {
  /** Expiration (secondes epoch). */
  exp: number;
}

export const SESSION_COOKIE = 'li_session';
export const STATE_COOKIE = 'li_oauth_state';

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionCookieValue(
  profile: LinkedInProfile,
  secret: string,
  ttlSeconds: number,
): string {
  const payload: SessionPayload = {
    ...profile,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return `${encoded}.${sign(encoded, secret)}`;
}

export function readSessionCookieValue(
  value: string | undefined,
  secret: string,
): SessionPayload | null {
  if (!value) return null;

  const dot = value.lastIndexOf('.');
  if (dot < 1) return null;

  const encoded = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  if (!constantTimeEquals(signature, sign(encoded, secret))) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (typeof payload?.sub !== 'string' || !payload.sub) return null;
  if (typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) return null;

  return payload;
}

/** Valeur aléatoire pour le paramètre `state` (anti-CSRF). */
export function generateState(): string {
  return randomBytes(32).toString('base64url');
}

/**
 * Comparaison à temps constant tolérante aux longueurs différentes.
 * `timingSafeEqual` lève si les buffers n'ont pas la même taille, on compare
 * donc des empreintes de taille fixe.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  const bufA = createHmac('sha256', 'cmp').update(a).digest();
  const bufB = createHmac('sha256', 'cmp').update(b).digest();
  return timingSafeEqual(bufA, bufB);
}
