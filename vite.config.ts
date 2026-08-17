import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { linkedInAuthPlugin } from './server/vite-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      // `linkedInAuthPlugin` reçoit l'environnement chargé par Vite (donc .env.local)
      // et monte /api/auth/linkedin/* sur le serveur de dev. Les secrets restent
      // côté serveur : ils ne passent jamais par `define`.
      plugins: [react(), linkedInAuthPlugin(env)],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
