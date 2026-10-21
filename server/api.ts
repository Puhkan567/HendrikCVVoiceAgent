/**
 * Framework-agnostic API handlers.
 *
 * The same functions back three environments, so behaviour stays identical:
 *  - Vercel serverless functions (api/*.ts)
 *  - the Vite dev server (server/vitePlugin.ts)
 *  - the standalone Express server (server.ts)
 */
import {
  createLiveToken,
  generateHendrikReply,
  generateHendrikTTS,
  sanitizeLanguage,
  sanitizeVoice,
} from './geminiService.js';

export interface ApiResult {
  status: number;
  body: unknown;
}

const MAX_TEXT_LENGTH = 1500;
const MAX_HISTORY_ITEMS = 8;

function asObject(body: unknown): Record<string, any> {
  return body && typeof body === 'object' ? (body as Record<string, any>) : {};
}

function str(value: unknown, max = MAX_TEXT_LENGTH): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export async function chatApi(rawBody: unknown): Promise<ApiResult> {
  const body = asObject(rawBody);
  const message = str(body.message);
  if (!message) {
    return { status: 400, body: { error: 'Message is required' } };
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-MAX_HISTORY_ITEMS).map((h: any) => ({
        role: h?.role === 'assistant' ? 'assistant' : 'user',
        text: str(h?.text),
      }))
    : [];

  try {
    const reply = await generateHendrikReply(message, history, sanitizeLanguage(body.language));
    return { status: 200, body: { reply } };
  } catch (err) {
    console.error('Chat error:', err);
    return { status: 500, body: { error: 'Chat request failed' } };
  }
}

export async function ttsApi(rawBody: unknown): Promise<ApiResult> {
  const body = asObject(rawBody);
  const text = str(body.text);
  if (!text) {
    return { status: 400, body: { error: 'Text is required' } };
  }

  try {
    const audio = await generateHendrikTTS(text, sanitizeVoice(body.voice), sanitizeLanguage(body.language));
    return { status: 200, body: { audio } };
  } catch (err) {
    console.error('TTS error:', err);
    return { status: 500, body: { error: 'Speech request failed' } };
  }
}

export async function liveTokenApi(rawBody: unknown): Promise<ApiResult> {
  const body = asObject(rawBody);
  try {
    const result = await createLiveToken(sanitizeVoice(body.voice), sanitizeLanguage(body.language));
    return { status: 200, body: result };
  } catch (err) {
    console.error('Live token error:', err);
    return { status: 500, body: { error: 'Could not create a live voice token' } };
  }
}

/**
 * Recruiter contact form.
 *
 * Serverless functions have no persistent storage, so submissions are forwarded
 * to a webhook you control (n8n, Zapier, Make, Slack, Discord, ...) set in the
 * CONTACT_WEBHOOK_URL environment variable. Without it the request fails
 * honestly (503) instead of pretending the message was saved; the form then
 * tells the visitor to email directly.
 */
export async function contactApi(rawBody: unknown): Promise<ApiResult> {
  const body = asObject(rawBody);
  const lead = {
    name: str(body.name, 200) || 'Anonymous',
    email: str(body.email, 200),
    phone: str(body.phone, 60),
    company: str(body.company, 200),
    topic: str(body.topic, 200) || 'General Inquiry',
    message: str(body.message, 3000),
    language: sanitizeLanguage(body.language),
    createdAt: new Date().toISOString(),
  };

  if (!lead.email && !lead.phone) {
    return { status: 400, body: { error: 'Email or phone is required' } };
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('CONTACT_WEBHOOK_URL is not set; contact form submission was not delivered.');
    return { status: 503, body: { error: 'Contact form is not configured' } };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      console.error('Contact webhook responded with', res.status);
      return { status: 502, body: { error: 'Could not deliver the message' } };
    }
    return { status: 200, body: { success: true } };
  } catch (err) {
    console.error('Contact webhook error:', err);
    return { status: 502, body: { error: 'Could not deliver the message' } };
  }
}

/** Route table shared by the dev server and the standalone server. */
export const apiRoutes: Record<string, (body: unknown) => Promise<ApiResult>> = {
  '/api/chat': chatApi,
  '/api/tts': ttsApi,
  '/api/live-token': liveTokenApi,
  '/api/contact': contactApi,
};

/** Adapter for Vercel's Web-standard function handlers. */
export function toResponse(result: ApiResult): Response {
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
