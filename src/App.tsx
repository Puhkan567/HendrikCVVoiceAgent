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
import { Volume2, VolumeX, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { HENDRIK_CV } from './data/hendrikCv';

const INITIAL_OPENING_MESSAGE: MessageItem = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi, I'm an AI assistant representing Hendrik Puhkan. I can tell you about my background, skills, and projects. What would you like to know?",
  timestamp: 'Just now',
};

export default function App() {
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_OPENING_MESSAGE]);
  const [isThinking, setIsThinking] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [contactDefaultTopic, setContactDefaultTopic] = useState('Interview Scheduling');

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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
        body: JSON.stringify({ text, voice: 'Puck' }),
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
      console.warn('TTS playback note:', err);
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
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.statusText}`);
      }

      const data = await res.json();
      const replyText = data.reply || "I'd rather not guess on that, but I can follow up directly.";

      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If user asks about interview/dates/salary, offer contact modal
      const lower = text.toLowerCase();
      if (
        lower.includes('interview') ||
        lower.includes('salary') ||
        lower.includes('start date') ||
        lower.includes('hire') ||
        lower.includes('contract')
      ) {
        setContactDefaultTopic('Interview & Opportunity Details');
      }

      // Automatically speak the reply if autoSpeak is enabled
      if (autoSpeak) {
        playTTS(replyText);
      }

      return replyText;
    } catch (err) {
      console.error('Failed to get reply:', err);
      const fallbackText = "I'd rather not guess on that, but I can follow up directly.";
      const errorMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return fallbackText;
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearMessages = () => {
    stopAudio();
    setMessages([INITIAL_OPENING_MESSAGE]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPdf={() => setIsPdfOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Assistant Hero Section */}
        <VoiceAssistantHero
          onSendMessage={handleSendMessage}
          messages={messages}
          isThinking={isThinking}
          onPlayTTS={playTTS}
          isAudioPlaying={isAudioPlaying}
          onStopAudio={stopAudio}
        />

        {/* Assistant Preferences Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict CV factual grounding: No hallucinated dates, companies, or salary commitments.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                autoSpeak ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>Auto-Play Spoken Answers: {autoSpeak ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Recruiter Quick Prompts */}
        <RecruiterPrompts
          onSelectPrompt={handleSendMessage}
          disabled={isThinking}
        />

        {/* Live Conversation Transcript */}
        <TranscriptHistory
          messages={messages}
          onPlayTTS={playTTS}
          onClear={handleClearMessages}
          isAudioPlaying={isAudioPlaying}
        />

        {/* Verified CV Facts Inspector */}
        <CvInspector
          onOpenPdf={() => setIsPdfOpen(true)}
          onAskAbout={handleSendMessage}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Hendrik Puhkan Voice Assistant • Estonian Business School</p>
          <p className="flex items-center gap-1">
            Built with Gemini 3.8 Live API & @google/genai
          </p>
        </div>
      </footer>

      {/* Modals */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultTopic={contactDefaultTopic}
      />

      <PdfViewerModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
      />
    </div>
  );
}
