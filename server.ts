import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { generateHendrikReply, generateHendrikTTS, handleLiveVoiceSession } from './server/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());

// In-memory recruiter leads
const savedLeads: any[] = [];

// Gemini chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const reply = await generateHendrikReply(message, history || []);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// Gemini TTS API
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const audio = await generateHendrikTTS(text, voice || 'Puck');
    res.json({ audio });
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// Recruiter lead capture
app.post('/api/contact', (req, res) => {
  const lead = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  savedLeads.push(lead);
  res.json({
    success: true,
    message: "Thank you! Hendrik will confirm and follow up directly with you.",
    lead,
  });
});

app.get('/api/contact', (_req, res) => {
  res.json({ leads: savedLeads });
});

// WebSocket for Gemini 3.8 Live API
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', (ws: WebSocket, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const voice = url.searchParams.get('voice') || 'Puck';
  handleLiveVoiceSession(ws, voice);
});

// Serve frontend static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Hendrik Puhkan Voice Assistant server running on port ${PORT}`);
});
