import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { apiRoutes } from './api.js';

// Helper to parse JSON body from incoming HTTP request
function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Serves the same /api/* handlers that Vercel runs in production, so
 * `npm run dev` behaves like the deployed site. Live voice no longer needs a
 * WebSocket proxy: the browser connects to Gemini directly using a token from
 * /api/live-token.
 */
export function geminiLivePlugin(): Plugin {
  return {
    name: 'gemini-live-assistant-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url || '', `http://${req.headers.host}`).pathname;
        const handler = apiRoutes[pathname];

        if (!handler || req.method !== 'POST') {
          return next();
        }

        const result = await handler(await parseJsonBody(req));
        return sendJson(res, result.status, result.body);
      });
    },
  };
}
