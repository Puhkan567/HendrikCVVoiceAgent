import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Code2,
  Languages,
  Trophy,
  ExternalLink,
  Calendar,
  MapPin,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { HENDRIK_CV } from '../data/hendrikCv';

interface CvInspectorProps {
  onOpenPdf: () => void;
  onAskAbout: (topic: string) => void;
}

export const CvInspector: React.FC<CvInspectorProps> = ({ onOpenPdf, onAskAbout }) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills' | 'achievements'>('experience');

  return (
    <div className="rounded-3xl bg-slate-900/70 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Verified CV Grounding</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            The assistant is strictly grounded in these verified records from Hendrik's CV.
          </p>
        </div>

        <button
          onClick={onOpenPdf}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Full CV PDF</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'experience'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience (4)</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'education'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Skills & Tools (10)</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'achievements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Achievements & Languages</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {HENDRIK_CV.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {exp.location}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 my-3 text-xs text-slate-300">
                {exp.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-1 shrink-0">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                <div className="flex flex-wrap gap-1.5">
                  {exp.skillsUsed.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onAskAbout(`Tell me about what you accomplished at ${exp.company}`)}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Ask voice assistant →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'education' && (
        <div className="space-y-4">
          {HENDRIK_CV.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{edu.degree}</p>
                </div>
                <span className="self-start sm:self-auto text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {edu.period}
                </span>
              </div>

              <ul className="space-y-1.5 my-2 text-xs text-slate-300">
                {edu.details.map((d, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HENDRIK_CV.skills.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
                  {cat.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-xl text-xs bg-slate-800 text-slate-200 border border-slate-700/60 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onAskAbout(`How do you apply your skills in ${cat.category}?`)}
                className="mt-4 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 text-left transition-colors"
              >
                Ask about {cat.category.split(' ')[0]} →
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Languages */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Language Fluency
              </h4>
            </div>
            <div className="space-y-2.5">
              {HENDRIK_CV.languages.map((lang, lIdx) => (
                <div
                  key={lIdx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-xs font-semibold text-white">{lang.language}</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Extracurriculars */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Honors & Personal Drive
              </h4>
            </div>
            <div className="space-y-2">
              {HENDRIK_CV.achievements.map((ach, aIdx) => (
                <div
                  key={aIdx}
                  className="flex items-start gap-2 text-xs text-slate-300 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60"
                >
                  <span className="text-amber-400 font-bold shrink-0">★</span>
                  <span>{ach}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Hobbies: {HENDRIK_CV.hobbies.join(' • ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
