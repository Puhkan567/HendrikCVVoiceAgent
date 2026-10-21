import type { Plugin } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage, ServerResponse } from 'http';
import { generateHendrikReply, generateHendrikTTS, handleLiveVoiceSession } from './geminiService';

interface RecruiterLead {
  id: string;
  name: string;
  email: string;
  company?: string;
  topic?: string;
  message?: string;
  createdAt: string;
}

const savedLeads: RecruiterLead[] = [];

// Helper to parse JSON body from incoming HTTP request
function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function geminiLivePlugin(): Plugin {
  return {
    name: 'gemini-live-assistant-plugin',
    configureServer(server) {
      // Setup WebSocket server attached to Vite's dev HTTP server
      const wss = new WebSocketServer({ noServer: true });

      if (server.httpServer) {
        server.httpServer.on('upgrade', (request, socket, head) => {
          const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
          if (pathname === '/live') {
            wss.handleUpgrade(request, socket, head, (ws) => {
              wss.emit('connection', ws, request);
            });
          }
        });
      }

      wss.on('connection', (ws: WebSocket, req) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const voice = url.searchParams.get('voice') || 'Puck';
        handleLiveVoiceSession(ws, voice);
      });

      // Middleware for API endpoints
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const pathname = url.pathname;

        if (pathname === '/api/chat' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { message, history } = body;
            if (!message) {
              return sendJson(res, 400, { error: 'Message is required' });
            }
            const reply = await generateHendrikReply(message, history || []);
            return sendJson(res, 200, { reply });
          } catch (error) {
            console.error('API /api/chat error:', error);
            return sendJson(res, 500, { error: String(error) });
          }
        }

        if (pathname === '/api/tts' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { text, voice } = body;
            if (!text) {
              return sendJson(res, 400, { error: 'Text is required' });
            }
            const audio = await generateHendrikTTS(text, voice || 'Puck');
            return sendJson(res, 200, { audio });
          } catch (error) {
            console.error('API /api/tts error:', error);
            return sendJson(res, 500, { error: String(error) });
          }
        }

        if (pathname === '/api/contact' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const lead: RecruiterLead = {
              id: Date.now().toString(),
              name: body.name || 'Anonymous Recruiter',
              email: body.email || '',
              company: body.company || '',
              topic: body.topic || 'General Inquiry',
              message: body.message || '',
              createdAt: new Date().toISOString(),
            };
            savedLeads.push(lead);
            return sendJson(res, 200, {
              success: true,
              message: "Thank you! I've received your contact details and Hendrik will follow up with you directly.",
              lead,
            });
          } catch (error) {
            return sendJson(res, 500, { error: String(error) });
          }
        }

        if (pathname === '/api/contact' && req.method === 'GET') {
          return sendJson(res, 200, { leads: savedLeads });
        }

        next();
      });
    },
  };
}
