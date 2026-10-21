import React from 'react';
import { Volume2, Copy, Check, User, Sparkles, Trash2 } from 'lucide-react';
import type { MessageItem } from './VoiceAssistantHero';

interface TranscriptHistoryProps {
  messages: MessageItem[];
  onPlayTTS: (text: string) => void;
  onClear: () => void;
  isAudioPlaying: boolean;
}

export const TranscriptHistory: React.FC<TranscriptHistoryProps> = ({
  messages,
  onPlayTTS,
  onClear,
  isAudioPlaying,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Spoken Conversation Log</h3>
            <p className="text-xs text-slate-400">Real-time transcripts & audio playback</p>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-slate-800"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Log</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                {isAssistant ? (
                  <>
                    <span className="font-semibold text-indigo-300">Hendrik Puhkan</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      Voice Persona
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-300">You (Caller / Recruiter)</span>
                    <User className="w-3 h-3 text-slate-400" />
                  </>
                )}
                <span className="text-slate-600">• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  isAssistant
                    ? 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Bottom actions for assistant message */}
                {isAssistant && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onPlayTTS(msg.text)}
                      disabled={isAudioPlaying}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Replay Voice</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
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
