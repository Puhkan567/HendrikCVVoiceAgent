import React from 'react';
import { ChevronRight } from 'lucide-react';
import { RECRUITER_QUICK_PROMPTS } from '../data/hendrikCv';

interface RecruiterPromptsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled: boolean;
  language: 'en' | 'et';
}

export const RecruiterPrompts: React.FC<RecruiterPromptsProps> = ({
  onSelectPrompt,
  disabled,
  language,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-7 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-5">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'et' ? 'Kiirküsimused värbajatele' : 'Recruiter Fast-Track Questions'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'et'
              ? 'Klõpsake küsimusel, et kuulda Hendrikult vahetut vastust'
              : 'Click any query to hear Hendrik respond in real time'}
          </p>
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
          {language === 'et' ? '7 kinnitatud teemat' : '7 verified topics'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RECRUITER_QUICK_PROMPTS.map((item, index) => {
          const category = language === 'et' ? item.categoryEt : item.category;
          const shortLabel = language === 'et' ? item.shortLabelEt : item.shortLabel;
          const prompt = language === 'et' ? item.promptEt : item.prompt;
          const description = language === 'et' ? item.descriptionEt : item.description;

          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt)}
              disabled={disabled}
              className="group text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium text-sky-700 dark:text-sky-400 mb-1">
                  <span>{category}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {shortLabel}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 italic">
                  "{prompt}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-[10px] text-slate-400 dark:text-slate-500">
                {description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
