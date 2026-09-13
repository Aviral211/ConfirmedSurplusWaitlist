import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {fileURLToPath} from 'node:url';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import {createMerchantInsight} from './server/merchantInsight';

function merchantInsightDevApi(): Plugin {
  return {
    name: 'merchant-insight-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/merchant-insight', async (request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.setHeader('Allow', 'POST');
          response.end(JSON.stringify({message: 'Method not allowed'}));
          return;
        }
        const result = await createMerchantInsight();
        response.statusCode = result.statusCode;
        response.end(JSON.stringify(result.body));
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const serverEnv = loadEnv(mode, process.cwd(), '');
  if (serverEnv.GEMINI_API_KEY) process.env.GEMINI_API_KEY = serverEnv.GEMINI_API_KEY;
  return {
    plugins: [react(), tailwindcss(), merchantInsightDevApi()],
    resolve: {
      alias: {
        '@': path.dirname(fileURLToPath(import.meta.url)),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
