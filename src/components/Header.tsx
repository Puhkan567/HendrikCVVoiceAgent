import React from 'react';
import { Sun, Moon, Monitor, FileText, ArrowUpRight } from 'lucide-react';
import { HENDRIK_CV } from '../data/hendrikCv';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenPdf: () => void;
  language: 'en' | 'et';
  onLanguageChange: (lang: 'en' | 'et') => void;
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContact,
  onOpenPdf,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap"
          >
            {HENDRIK_CV.name}
          </a>
          <span className="hidden md:inline text-xs text-slate-400 dark:text-slate-500 font-normal">
            EBS Impactful Entrepreneurship · Tallinn
          </span>
        </div>

        {/* Zone 2: Functional Controls (Language, Theme, PDF Link) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-xs">
          {/* Language Selector: EN / EE */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Switch to English voice"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('et')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                language === 'et'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Lülitu eesti keelele"
            >
              ET
            </button>
          </div>

          {/* Theme Selector: Dark / Light / System */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Light Mode (Platinum Paper)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Dark Mode (Nordic Slate)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onThemeChange('system')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'system'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
              title="System Theme"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View PDF CV link */}
          <button
            onClick={onOpenPdf}
            className="hidden sm:inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CV PDF</span>
          </button>
        </div>

        {/* Zone 3: 1 Primary Action (Single-line control) */}
        <div className="shrink-0">
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <span>{language === 'et' ? 'Töövestlus / Kontakt' : 'Connect / Interview'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </header>
  );
};
