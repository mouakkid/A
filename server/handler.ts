/**
 * Routeur HTTP des endpoints d'authentification, indépendant de l'hébergeur :
 * il ne manipule que `IncomingMessage` / `ServerResponse`, ce qui lui permet de
 * tourner aussi bien dans le middleware du serveur de dev Vite que dans le
 * serveur `node:http` de production.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  describeMissingConfig,
  loadConfig,
  type EnvSource,
  type LinkedInAuthConfig,
} from './config.ts';
import { clearCookie, parseCookies, serializeCookie } from './cookies.ts';
import {
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  fetchUserInfo,
  OAuthError,
  toProfile,
  verifyIdToken,
} from './oauth.ts';
import {
  constantTimeEquals,
  createSessionCookieValue,
  generateState,
  readSessionCookieValue,
  SESSION_COOKIE,
  STATE_COOKIE,
} from './session.ts';

export const API_PREFIX = '/api/auth/linkedin';

/** Durée de vie du cookie `state` : le code d'autorisation LinkedIn expire en 30 min. */
const STATE_TTL_SECONDS = 600;

export interface HandlerOptions {
  env?: EnvSource;
}

export function createAuthHandler(options: HandlerOptions = {}) {
  const env = options.env ?? process.env;

  /** @returns `true` si la requête a été traitée. */
  return async function handleAuthRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<boolean> {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    if (!url.pathname.startsWith(API_PREFIX)) return false;

    const route = url.pathname.slice(API_PREFIX.length) || '/';
    const result = loadConfig(env);

    try {
      // `/me` doit répondre même sans configuration : le front affiche alors un
      // état "non configuré" au lieu d'une erreur réseau opaque.
      if (route === '/me' && req.method === 'GET') {
        if (result.status === 'incomplete') {
          return sendJson(res, 200, {
            status: 'unconfigured',
            message: describeMissingConfig(result.missing),
          });
        }
        return handleMe(req, res, result.config);
      }

      if (result.status === 'incomplete') {
        return sendJson(res, 503, {
          status: 'unconfigured',
          message: describeMissingConfig(result.missing),
        });
      }

      if (route === '/login' && req.method === 'GET') return handleLogin(res, result.config);
      if (route === '/callback' && req.method === 'GET') {
        return await handleCallback(req, res, url, result.config);
      }
      if (route === '/logout' && req.method === 'POST') return handleLogout(res, result.config);

      return sendJson(res, 405, { error: 'method_not_allowed' });
    } catch (error) {
      console.error('[linkedin-auth] erreur non gérée', error);
      return sendJson(res, 500, { error: 'internal_error' });
    }
  };
}

function handleLogin(res: ServerResponse, config: LinkedInAuthConfig): boolean {
  const state = generateState();

  res.setHeader('Set-Cookie', [
    serializeCookie(STATE_COOKIE, state, {
      maxAge: STATE_TTL_SECONDS,
      secure: config.cookieSecure,
      sameSite: 'lax',
    }),
  ]);
  return redirect(res, buildAuthorizationUrl(config, state));
}

async function handleCallback(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL,
  config: LinkedInAuthConfig,
): Promise<boolean> {
  const expireState = clearCookie(STATE_COOKIE, { secure: config.cookieSecure, sameSite: 'lax' });

  // L'utilisateur a refusé, ou LinkedIn a rejeté la demande.
  const oauthError = url.searchParams.get('error');
  if (oauthError) {
    console.warn(
      `[linkedin-auth] autorisation refusée: ${oauthError} — ${url.searchParams.get('error_description') ?? ''}`,
    );
    res.setHeader('Set-Cookie', [expireState]);
    return redirect(res, appUrl(config, { li_error: oauthError }));
  }

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expectedState = parseCookies(req.headers.cookie)[STATE_COOKIE];

  // Comparaison à temps constant : un `state` absent ou divergent signale une CSRF.
  if (!state || !expectedState || !constantTimeEquals(state, expectedState)) {
    res.setHeader('Set-Cookie', [expireState]);
    return sendJson(res, 401, { error: 'state_mismatch' });
  }

  if (!code) {
    res.setHeader('Set-Cookie', [expireState]);
    return redirect(res, appUrl(config, { li_error: 'missing_code' }));
  }

  try {
    const tokens = await exchangeCodeForTokens(config, code);

    // L'ID token n'est présent que si le scope `openid` a été accordé.
    if (tokens.id_token) await verifyIdToken(tokens.id_token, config.clientId);

    const profile = toProfile(await fetchUserInfo(tokens.access_token));

    res.setHeader('Set-Cookie', [
      expireState,
      serializeCookie(
        SESSION_COOKIE,
        createSessionCookieValue(profile, config.sessionSecret, config.sessionTtlSeconds),
        { maxAge: config.sessionTtlSeconds, secure: config.cookieSecure, sameSite: 'lax' },
      ),
    ]);
    return redirect(res, appUrl(config, { li: 'connected' }));
  } catch (error) {
    const code = error instanceof OAuthError ? error.code : 'unexpected_error';
    console.error('[linkedin-auth] échec du callback', error);
    res.setHeader('Set-Cookie', [expireState]);
    return redirect(res, appUrl(config, { li_error: code }));
  }
}

function handleMe(req: IncomingMessage, res: ServerResponse, config: LinkedInAuthConfig): boolean {
  const cookies = parseCookies(req.headers.cookie);
  const session = readSessionCookieValue(cookies[SESSION_COOKIE], config.sessionSecret);

  // Jamais de cache : la réponse dépend du cookie de session.
  res.setHeader('Cache-Control', 'no-store');

  if (!session) {
    // Purge un cookie expiré ou invalide pour éviter de le renvoyer à chaque requête.
    if (cookies[SESSION_COOKIE]) {
      res.setHeader('Set-Cookie', [clearCookie(SESSION_COOKIE, { secure: config.cookieSecure })]);
    }
    return sendJson(res, 200, { status: 'anonymous' });
  }

  const { exp, ...profile } = session;
  return sendJson(res, 200, { status: 'authenticated', profile, expiresAt: exp });
}

function handleLogout(res: ServerResponse, config: LinkedInAuthConfig): boolean {
  res.setHeader('Set-Cookie', [clearCookie(SESSION_COOKIE, { secure: config.cookieSecure })]);
  return sendJson(res, 200, { status: 'anonymous' });
}

/**
 * Construit une URL de redirection à partir de l'origine configurée côté serveur.
 * Aucune valeur fournie par le client n'entre ici : pas de redirection ouverte.
 */
function appUrl(config: LinkedInAuthConfig, params: Record<string, string>): string {
  const target = new URL(config.appBaseUrl);
  for (const [key, value] of Object.entries(params)) target.searchParams.set(key, value);
  return target.toString();
}

function redirect(res: ServerResponse, location: string): boolean {
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.end();
  return true;
}

function sendJson(res: ServerResponse, status: number, body: unknown): boolean {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(payload));
  res.end(payload);
  return true;
}
