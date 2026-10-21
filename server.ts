import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRoutes } from './server/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Same handlers Vercel runs as serverless functions (chat, tts, live-token, contact).
for (const [route, handler] of Object.entries(apiRoutes)) {
  app.post(route, async (req, res) => {
    const result = await handler(req.body);
    res.status(result.status).json(result.body);
  });
}

// Serve frontend static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Hendrik Puhkan Voice Assistant server running on port ${PORT}`);
});
