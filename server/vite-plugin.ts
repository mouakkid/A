/**
 * Monte les endpoints d'authentification sur le serveur Vite (dev et preview),
 * pour que `npm run dev` fasse tourner le flux OAuth de bout en bout sans
 * process supplémentaire.
 */

import type { Connect, Plugin } from 'vite';
import { createAuthHandler } from './handler.ts';
import type { EnvSource } from './config.ts';

export function linkedInAuthPlugin(env: EnvSource): Plugin {
  const handle = createAuthHandler({ env });

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    handle(req, res)
      .then((handled) => {
        if (!handled) next();
      })
      .catch(next);
  };

  return {
    name: 'linkedin-auth',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
