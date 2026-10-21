/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceAssistantHero, type MessageItem } from './components/VoiceAssistantHero';
import { RecruiterPrompts } from './components/RecruiterPrompts';
import { TranscriptHistory } from './components/TranscriptHistory';
import { CvInspector } from './components/CvInspector';
import { ContactModal } from './components/ContactModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { OPENING_LINES } from './data/hendrikCv';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('hp_theme') as 'dark' | 'light' | 'system') || 'dark';
  });
  const [language, setLanguage] = useState<'en' | 'et'>(() => {
    return (localStorage.getItem('hp_lang') as 'en' | 'et') || 'en';
  });
  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'greeting',
      role: 'assistant',
      text: OPENING_LINES.en,
      timestamp: 'Initial',
      language: 'en',
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [contactDefaultTopic, setContactDefaultTopic] = useState('Interview Scheduling');

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // System color-scheme listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective dark mode
  const effectiveIsDark = theme === 'dark' || (theme === 'system' && isSystemDark);

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveIsDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hp_theme', theme);
  }, [theme, effectiveIsDark]);

  // Handle language switch
  const handleLanguageChange = (newLang: 'en' | 'et') => {
    setLanguage(newLang);
    localStorage.setItem('hp_lang', newLang);

    // If only the initial greeting exists, update it to the new language
    if (messages.length === 1 && messages[0].id === 'greeting') {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          text: OPENING_LINES[newLang],
          timestamp: 'Initial',
          language: newLang,
        },
      ]);
    }
  };

  // Stop currently playing TTS audio
  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  // Play audio generated via /api/tts
  const playTTS = async (text: string) => {
    stopAudio();
    setIsAudioPlaying(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Puck', language }),
      });

      if (!response.ok) {
        throw new Error('TTS generation failed');
      }

      const data = await response.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        currentAudioRef.current = audio;

        audio.onended = () => {
          setIsAudioPlaying(false);
          currentAudioRef.current = null;
        };

        audio.onerror = () => {
          setIsAudioPlaying(false);
          currentAudioRef.current = null;
        };

        await audio.play();
      } else {
        setIsAudioPlaying(false);
      }
    } catch (err) {
      console.warn('TTS playback notice:', err);
      setIsAudioPlaying(false);
    }
  };

  // Send a question to the assistant
  const handleSendMessage = async (text: string): Promise<string | undefined> => {
    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    stopAudio();

    try {
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history, language }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.statusText}`);
      }

      const data = await res.json();
      const replyText =
        data.reply ||
        (language === 'et'
          ? 'Ma pigem ei hakkaks selle kohta oletama, kuid võin teile otse järelinfot saata.'
          : "I'd rather not guess on that, but I can follow up directly.");

      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Detect interview / contract / salary queries to trigger contact prompt
      const lower = text.toLowerCase();
      if (
        lower.includes('interview') ||
        lower.includes('salary') ||
        lower.includes('palk') ||
        lower.includes('vestlus') ||
        lower.includes('töövestlus') ||
        lower.includes('leping') ||
        lower.includes('contract')
      ) {
        setContactDefaultTopic(
          language === 'et' ? 'Töövestluse aja kokkuleppimine' : 'Interview & Opportunity Scheduling'
        );
      }

      if (autoSpeak) {
        playTTS(replyText);
      }

      return replyText;
    } catch (err) {
      console.error('Failed to get reply:', err);
      const fallbackText =
        language === 'et'
          ? 'Ma pigem ei hakkaks selle kohta oletama, kuid võin teile otse järelinfot saata.'
          : "I'd rather not guess on that, but I can follow up directly.";

      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      };
      setMessages((prev) => [...prev, errorMsg]);
      return fallbackText;
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearMessages = () => {
    stopAudio();
    setMessages([
      {
        id: 'greeting',
        role: 'assistant',
        text: OPENING_LINES[language],
        timestamp: 'Initial',
        language,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* 3-Zone Minimalist Header */}
      <Header
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPdf={() => setIsPdfOpen(true)}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Floating Voice Assistant Console */}
        <VoiceAssistantHero
          onSendMessage={handleSendMessage}
          messages={messages}
          isThinking={isThinking}
          onPlayTTS={playTTS}
          isAudioPlaying={isAudioPlaying}
          onStopAudio={stopAudio}
          language={language}
          onLanguageChange={handleLanguageChange}
          isDark={effectiveIsDark}
        />

        {/* Minimalist Preferences & Guardrails Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 text-xs shadow-xs transition-colors duration-200">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {language === 'et'
                ? 'Rangelt CV faktidele toetuv vastamine: puuduvad välja mõeldud kuupäevad või lepingulubadused.'
                : 'Strict CV factual grounding: No hallucinated dates, companies, or salary commitments.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                autoSpeak
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>
                {language === 'et'
                  ? `Häälvastus: ${autoSpeak ? 'SEES' : 'VÄLJAS'}`
                  : `Auto-Voice: ${autoSpeak ? 'ON' : 'OFF'}`}
              </span>
            </button>
          </div>
        </div>

        {/* Recruiter Quick Prompts */}
        <RecruiterPrompts
          onSelectPrompt={handleSendMessage}
          disabled={isThinking}
          language={language}
        />

        {/* Live Conversation Transcript */}
        <TranscriptHistory
          messages={messages}
          onPlayTTS={playTTS}
          onClear={handleClearMessages}
          isAudioPlaying={isAudioPlaying}
          language={language}
        />

        {/* Verified CV Facts Inspector */}
        <CvInspector
          onOpenPdf={() => setIsPdfOpen(true)}
          onAskAbout={handleSendMessage}
          language={language}
        />
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Hendrik Puhkan · Estonian Business School · Tallinn, Estonia</p>
          <p className="flex items-center gap-1">
            Gemini 3.8 Live API & Flash-Lite Speech
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultTopic={contactDefaultTopic}
        language={language}
      />

      <PdfViewerModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        language={language}
      />
    </div>
  );
}
