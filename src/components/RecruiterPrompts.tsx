import React from 'react';
import { HelpCircle, ChevronRight, MessageSquareCode } from 'lucide-react';
import { RECRUITER_QUICK_PROMPTS } from '../data/hendrikCv';

interface RecruiterPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled: boolean;
}

export const RecruiterPrompts: React.FC<RecruiterPromptsProps> = ({ onSelectPrompt, disabled }) => {
  return (
    <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Recruiter Fast-Track Questions</h3>
            <p className="text-xs text-slate-400">Click to ask Hendrik directly via voice</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700/60">
          7 verified queries
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {RECRUITER_QUICK_PROMPTS.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(item.prompt)}
            disabled={disabled}
            className="group text-left p-3 rounded-2xl bg-slate-950/50 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-400 mb-1">
                <span>{item.category}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                {item.shortLabel}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                "{item.prompt}"
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
