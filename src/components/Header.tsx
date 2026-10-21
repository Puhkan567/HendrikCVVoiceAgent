import React from 'react';
import { Mail, Phone, MapPin, Linkedin, FileText, Sparkles, Calendar } from 'lucide-react';
import { HENDRIK_CV } from '../data/hendrikCv';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContact, onOpenPdf }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-white text-base">
                HP
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">{HENDRIK_CV.name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Gemini 3.8 Voice Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Estonian Business School (BA in Impactful Entrepreneurship) • Tallinn, Estonia
            </p>
          </div>
        </div>

        {/* Contact links & action buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="hidden lg:flex items-center gap-3 text-slate-400 mr-2 border-r border-slate-800 pr-3">
            <a
              href={`mailto:${HENDRIK_CV.email}`}
              className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
              title="Email Hendrik"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{HENDRIK_CV.email}</span>
            </a>
            <a
              href={`tel:${HENDRIK_CV.phone}`}
              className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
              title="Call Hendrik"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{HENDRIK_CV.phone}</span>
            </a>
            <a
              href={HENDRIK_CV.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 text-slate-500" />
              <span>LinkedIn</span>
            </a>
          </div>

          <button
            onClick={onOpenPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-colors"
            title="View original CV PDF"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>View CV PDF</span>
          </button>

          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Connect / Interview</span>
          </button>
        </div>
      </div>
    </header>
  );
};
