import React, { useState } from 'react';
import { Volume2, Copy, Check, Trash2 } from 'lucide-react';
import type { MessageItem } from './VoiceAssistantHero';

interface TranscriptHistoryProps {
  messages: MessageItem[];
  onPlayTTS: (text: string) => void;
  onClear: () => void;
  isAudioPlaying: boolean;
  language: 'en' | 'et';
}

export const TranscriptHistory: React.FC<TranscriptHistoryProps> = ({
  messages,
  onPlayTTS,
  onClear,
  isAudioPlaying,
  language,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'et' ? 'Vestluse logi' : 'Spoken Conversation Log'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'et' ? 'Reaalaja transkriptsioon ja kõne taasesitus' : 'Real-time transcripts & speech playback'}
          </p>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'et' ? 'Tühjenda' : 'Clear Log'}</span>
        </button>
      </div>

      <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 dark:text-slate-500">
                {isAssistant ? (
                  <>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Hendrik Puhkan</span>
                    <span>·</span>
                    <span className="text-sky-700 dark:text-sky-400">
                      {language === 'et' ? 'Häälassistent' : 'Voice Assistant'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {language === 'et' ? 'Teie (Värbaja / Küsija)' : 'You (Recruiter / Caller)'}
                    </span>
                  </>
                )}
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isAssistant
                    ? 'bg-slate-50 dark:bg-slate-950/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-tl-sm'
                    : 'bg-slate-900 dark:bg-sky-600 text-white rounded-tr-sm shadow-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {isAssistant && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onPlayTTS(msg.text)}
                      disabled={isAudioPlaying}
                      className="inline-flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 font-medium transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'et' ? 'Kuula uuesti' : 'Replay Voice'}</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">{language === 'et' ? 'Kopeeritud' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{language === 'et' ? 'Kopeeri' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
