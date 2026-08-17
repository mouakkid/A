/**
 * Serveur de production : sert le build statique de `dist/` et expose les
 * endpoints d'authentification LinkedIn sur le même origine — indispensable,
 * puisque le cookie de session est `SameSite=Lax` et lié à cette origine.
 *
 *   npm run build && npm start
 *
 * Derrière un reverse proxy TLS, positionner `APP_BASE_URL=https://...` pour
 * que les cookies soient émis avec l'attribut `Secure`.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { createAuthHandler } from './handler.ts';
import { loadConfig, describeMissingConfig } from './config.ts';

const PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
const HOST = process.env.HOST ?? '0.0.0.0';
const STATIC_ROOT = resolve(process.cwd(), process.env.STATIC_DIR ?? 'dist');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.map': 'application/json; charset=utf-8',
};

const handleAuthRequest = createAuthHandler();

const server = createServer((req, res) => {
  handleAuthRequest(req, res)
    .then((handled) => (handled ? undefined : serveStatic(req, res)))
    .catch((error) => {
      console.error('[server] erreur non gérée', error);
      if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
    });
});

async function serveStatic(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  let pathname: string;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  const filePath = await resolveFile(pathname);
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  const contentType = MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
  // Les assets buildés par Vite portent un hash dans leur nom : cache long.
  // `index.html` doit rester revalidé pour ne pas figer un déploiement.
  const immutable = filePath.includes(`${sep}assets${sep}`);

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

/** Résout un chemin en fichier existant, avec repli SPA sur `index.html`. */
async function resolveFile(pathname: string): Promise<string | null> {
  // `normalize` neutralise les `..` avant la vérification de confinement.
  const candidate = resolve(join(STATIC_ROOT, normalize(pathname)));
  if (candidate !== STATIC_ROOT && !candidate.startsWith(STATIC_ROOT + sep)) return null;

  const direct = await statOrNull(candidate);
  if (direct?.isFile()) return candidate;
  if (direct?.isDirectory()) {
    const index = join(candidate, 'index.html');
    if ((await statOrNull(index))?.isFile()) return index;
  }

  const fallback = join(STATIC_ROOT, 'index.html');
  return (await statOrNull(fallback))?.isFile() ? fallback : null;
}

async function statOrNull(path: string) {
  try {
    return await stat(path);
  } catch {
    return null;
  }
}

const config = loadConfig();
if (config.status === 'incomplete') {
  console.warn(`[server] ${describeMissingConfig(config.missing)}`);
  console.warn('[server] Le site est servi, mais la connexion LinkedIn répondra 503.');
}

server.listen(PORT, HOST, () => {
  console.log(`[server] écoute sur http://${HOST}:${PORT} (statique : ${STATIC_ROOT})`);
});
