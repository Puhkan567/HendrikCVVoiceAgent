import { GoogleGenAI, Modality } from '@google/genai';

export const HENDRIK_SYSTEM_INSTRUCTION = `
You are the voice assistant representing Hendrik Puhkan. You speak as Hendrik, in first person ("I" / "mina"), in conversations with recruiters, employers, and clients.

CRITICAL INSTRUCTIONS & IDENTITY:
- OPENING LINE:
  When starting a new conversation or asked to greet:
  If speaking English:
  "Hi, I'm an AI assistant representing Hendrik Puhkan. I can tell you about my background, skills, and projects. What would you like to know?"
  If speaking Estonian:
  "Tere! Olen Hendrik Puhkanit esindav tehisintellekti häälassistent. Saan rääkida oma haridusest, töökogemusest ja oskustest. Mida sooviksite teada?"

SOURCES & FACTS:
- The facts below from my CV are your ONLY source for my education, experience, skills, projects, and dates.
- If something is not in the CV, say:
  In English: "I'd rather not guess on that, but I can follow up directly."
  In Estonian: "Ma pigem ei hakkaks selle kohta oletama, kuid võin teile otse järelinfot saata."
- Never invent employers, dates, numbers, or skills.

SPEAKING STYLE (CRITICAL FOR SPOKEN VOICE):
- This is a spoken voice conversation. Keep answers to 2-4 short, punchy sentences.
- Use natural, plain spoken language with natural pacing and confidence.
- DO NOT use bullet points, numbered lists, markdown asterisks, bolding, or headers. Pure spoken dialogue only.
- Be confident and direct, not salesy. Do not recite the CV line by line.
- For "tell me about yourself" / "räägi endast": Give a concise 30-second summary: who I am, what I've done, and what I'm looking for.
- For experience questions: Mention what I did, the tangible result, and what I learned.
- Offer to go deeper only when it feels natural in conversation.

LANGUAGE HANDLING:
- Hendrik is a native Estonian speaker and fluent in English.
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

function getGenAI(apiVersion?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set!');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      ...(apiVersion ? { apiVersion } : {}),
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Generate a text response for Hendrik Puhkan
 */
export async function generateHendrikReply(
  prompt: string,
  history: { role: string; text: string }[] = [],
  preferredLanguage = 'en'
) {
  const ai = getGenAI();

  const languagePrompt =
    preferredLanguage === 'et'
      ? 'Please respond in natural, authentic Estonian as Hendrik.'
      : 'Please respond in fluent, natural English as Hendrik.';

  const formattedContents = [
    ...history.slice(-6).map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }],
    })),
    {
      role: 'user',
      parts: [{ text: `${prompt}\n[Context: ${languagePrompt}]` }],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: formattedContents,
    config: {
      systemInstruction: HENDRIK_SYSTEM_INSTRUCTION,
      temperature: 0.65,
      topP: 0.9,
    },
  });

  return (
    response.text ||
    (preferredLanguage === 'et'
      ? 'Ma pigem ei hakkaks selle kohta oletama, kuid võin teile otse järelinfot saata.'
      : "I'd rather not guess on that, but I can follow up directly.")
  );
}

/**
 * Generate high quality speech audio using Gemini 3.8 Flash Lite TTS
 * Returns base64-encoded WAV audio.
 */
export async function generateHendrikTTS(textToSpeak: string, voiceName = 'Puck', language = 'en') {
  const ai = getGenAI();

  const styleHint =
    language === 'et'
      ? 'Young, energetic, articulate native Estonian entrepreneur and student, speaking with natural Estonian pronunciation'
      : 'Young, energetic, confident and articulate business student and entrepreneur from Tallinn';

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash-lite-tts',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: textToSpeak,
            speechMetadata: {
              style: styleHint,
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

export const LIVE_MODEL = 'gemini-3.8-live';

/** Live sessions started with a token can last at most this long. */
const LIVE_SESSION_MAX_MS = 10 * 60 * 1000;

/** Voice names are passed straight to Gemini, so only allow plain names. */
export function sanitizeVoice(voice: unknown): string {
  return typeof voice === 'string' && /^[A-Za-z]{2,20}$/.test(voice) ? voice : 'Puck';
}

export function sanitizeLanguage(language: unknown): 'en' | 'et' {
  return language === 'et' ? 'et' : 'en';
}

/**
 * Mint a short-lived, single-use Gemini Live token.
 *
 * The browser connects to Gemini directly with this token, so no long-lived
 * server (WebSocket proxy) is needed and the real API key never leaves the
 * server. The system instruction, voice and model are locked inside the token,
 * so the browser cannot change how the assistant behaves.
 */
export async function createLiveToken(voiceName = 'Puck', language = 'en') {
  const ai = getGenAI('v1alpha');

  const systemInstruction = `${HENDRIK_SYSTEM_INSTRUCTION}\nPrimary language preference requested by caller: ${
    language === 'et' ? 'Estonian (eesti keel)' : 'English'
  }. Remember to switch language instantly if the user speaks another language.`;

  const now = Date.now();
  const expireTime = new Date(now + LIVE_SESSION_MAX_MS).toISOString();

  const token = await ai.authTokens.create({
    config: {
      uses: 1,
      expireTime,
      newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
      liveConnectConstraints: {
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
            },
          },
          systemInstruction,
        },
      },
      httpOptions: { apiVersion: 'v1alpha' },
    },
  });

  if (!token.name) {
    throw new Error('Gemini did not return an ephemeral token');
  }

  return { token: token.name, model: LIVE_MODEL, expiresAt: expireTime };
}
