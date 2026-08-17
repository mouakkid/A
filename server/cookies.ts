/** Lecture / écriture de cookies sans dépendance externe. */

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  /**
   * `lax` est obligatoire pour les cookies impliqués dans le callback OAuth :
   * la redirection depuis linkedin.com est une navigation top-level cross-site,
   * et `strict` empêcherait le cookie `state` d'être renvoyé — le flux échouerait
   * systématiquement avec une erreur de CSRF.
   */
  sameSite?: 'strict' | 'lax' | 'none';
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;

  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 1) continue;
    const name = part.slice(0, eq).trim();
    if (!name || name in out) continue; // le premier cookie gagne
    const raw = part.slice(eq + 1).trim();
    try {
      out[name] = decodeURIComponent(raw);
    } catch {
      out[name] = raw;
    }
  }
  return out;
}

export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const {
    maxAge,
    path = '/',
    httpOnly = true,
    secure = false,
    sameSite = 'lax',
  } = options;

  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`];
  if (typeof maxAge === 'number') {
    parts.push(`Max-Age=${Math.floor(maxAge)}`);
    parts.push(`Expires=${new Date(Date.now() + maxAge * 1000).toUTCString()}`);
  }
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  parts.push(`SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`);
  return parts.join('; ');
}

export function clearCookie(name: string, options: CookieOptions = {}): string {
  return serializeCookie(name, '', { ...options, maxAge: 0 });
}
