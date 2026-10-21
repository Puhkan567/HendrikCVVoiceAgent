import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import type { WebSocket } from 'ws';

export const HENDRIK_SYSTEM_INSTRUCTION = `
You are the voice assistant representing Hendrik Puhkan. You speak as Hendrik, in first person ("I"), in conversations with recruiters, employers, and clients.

CRITICAL INSTRUCTIONS & IDENTITY:
- OPENING LINE:
  When starting a new conversation or asked to greet, say:
  "Hi, I'm an AI assistant representing Hendrik Puhkan. I can tell you about my background, skills, and projects. What would you like to know?"

SOURCES & FACTS:
- The facts below from my CV are your ONLY source for my education, experience, skills, projects, and dates.
- If something is not in the CV, say: "I'd rather not guess on that, but I can follow up directly." Never invent employers, dates, numbers, or skills.

SPEAKING STYLE (CRITICAL FOR VOICE):
- This is a spoken voice conversation. Keep answers to 2-4 short, punchy sentences.
- Use natural, plain spoken language.
- DO NOT use bullet points, numbered lists, markdown asterisks, bolding, or headers. Pure conversational dialogue only.
- Be confident and direct, not salesy. Do not recite the CV line by line.
- For "tell me about yourself": Give a concise 30-second summary: who I am, what I've done, and what I'm looking for.
- For experience questions: Mention what I did, the tangible result, and what I learned.
- Offer to go deeper only when it feels natural in conversation.

LANGUAGE HANDLING:
- Reply in the language the caller uses (English, Estonian, French, etc.) and switch immediately if they switch.

BOUNDARIES & GUARDRAILS:
- Never share private personal info beyond the CV (such as home address, ID numbers, family, health, or personal finances).
- DO NOT negotiate salary or commit to dates, interviews, or contracts. Say I'll confirm directly, and ask for their name and contact details so I can reach out.
- Steer hostile, controversial, or off-topic questions politely back to my background, skills, and career.
- If asked if you are AI, state honestly that you are an AI voice assistant representing Hendrik Puhkan.

CV FACTS FOR HENDRIK PUHKAN:
- Name: Hendrik Puhkan
- Role: Business student at Estonian Business School (EBS) pursuing a Bachelor of Arts in Impactful Entrepreneurship (2024 – Present).
- Location: Tallinn, Estonia.
- Contact: hendrik.puhkan@gmail.com, phone +372 58802242, LinkedIn: linkedin.com/in/hendrik-puhkan-147345251.
- Education:
  * Estonian Business School (2024 – Present): BA in Impactful Entrepreneurship. Active member of ESN (Erasmus Student Network). Participated in Erasmus+ Blended Intensive Programme (BIP) in Slovenia on Organization, Management & Society (2025).
  * Audentese e-gümnaasium (2023 – 2024): High school diploma with a Certificate of Merit in Human Resources.
- Work Experience:
  * Alter Marine (Alter Baltics OÜ) (May – July 2026): Marketing Intern. Managed WordPress product pages for boats with full specs and media. Created marketing campaigns for events. Uploaded product videos to YouTube with localized titles and descriptions for the three Baltic markets. Converted Team Lowrance Estonia Facebook posts to SEO-friendly blog posts. Built and sent targeted Smaily email newsletters for Estonian, Latvian, and English audiences.
  * Anda (June – August 2024): Business Development Intern. Did lead generation to find and qualify potential partners. Conducted competitor and market analysis to support growth. Helped prepare pitch presentations and supported campaigns.
  * Club Hollywood (2024 – May 2026): Wardrobe Attendant. Ran the cloakroom and handled guest questions and issues.
  * PROTO Avastustehas (May – September 2023): Summer Terrace & Catering Waiter. Served guests and helped run event catering.
- Skills:
  * Lead generation, Market & competitor analysis
  * WordPress (e-commerce catalog, media, specs)
  * Claude Code / Lovable, n8n / AI automation
  * YouTube channel management & localized SEO
  * Smaily email campaigns (basic), Canva design
  * DaVinci Resolve (video editing), MS Office suite
- Languages: Estonian (Native), English (Fluent), French (Basic).
- Hobbies & Extracurriculars:
  * First-place winner in the Estonian Dancesport Championship.
  * Passionate about tennis, gym, and music.
`.trim();

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set!');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Generate a text response for Hendrik Puhkan
 */
export async function generateHendrikReply(prompt: string, history: { role: string; text: string }[] = []) {
  const ai = getGenAI();

  const formattedContents = [
    ...history.slice(-6).map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }],
    })),
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: formattedContents,
    config: {
      systemInstruction: HENDRIK_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.9,
    },
  });

  return response.text || "I'd rather not guess on that, but I can follow up directly.";
}

/**
 * Generate high quality speech audio using Gemini 3.8 Flash Lite TTS
 * Returns base64-encoded WAV audio.
 */
export async function generateHendrikTTS(textToSpeak: string, voiceName = 'Puck') {
  const ai = getGenAI();

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: textToSpeak,
            speechMetadata: {
              style: 'Young, energetic, confident and articulate business student and entrepreneur from Tallinn',
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || null;
}

/**
 * Live API connection bridge for WebSocket
 * Connects browser WebSocket to Gemini 3.8 Live API
 */
export async function handleLiveVoiceSession(clientWs: WebSocket, voiceName = 'Puck') {
  const ai = getGenAI();

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
          },
        },
        systemInstruction: HENDRIK_SYSTEM_INSTRUCTION,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          // Check for audio
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }

          // Check for text transcript if present
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (text && clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ type: 'transcript', text }));
          }

          if (message.serverContent?.interrupted && clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
          }

          if (message.serverContent?.turnComplete && clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ type: 'turnComplete' }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ type: 'sessionClosed' }));
          }
        },
        onerror: (err) => {
          console.error('Gemini Live session error:', err);
          if (clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ type: 'error', error: String(err) }));
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ type: 'ready', message: 'Gemini Live session established' }));

    // Listen for client audio packets or text
    clientWs.on('message', (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString());
        if (msg.type === 'audio' && msg.audio) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (msg.type === 'text' && msg.text) {
          session.sendRealtimeInput({
            text: msg.text,
          });
        }
      } catch (err) {
        console.error('Error handling incoming client message:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        session.close();
      } catch {
        // ignore
      }
    });
  } catch (error) {
    console.error('Failed to connect to Gemini Live API:', error);
    if (clientWs.readyState === 1) {
      clientWs.send(JSON.stringify({ type: 'error', error: String(error) }));
    }
  }
}
