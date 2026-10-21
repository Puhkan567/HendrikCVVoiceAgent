import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Code2,
  Trophy,
  ExternalLink,
  Calendar,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { HENDRIK_CV } from '../data/hendrikCv';

interface CvInspectorProps {
  onOpenPdf: () => void;
  onAskAbout: (topic: string) => void;
  language: 'en' | 'et';
}

export const CvInspector: React.FC<CvInspectorProps> = ({ onOpenPdf, onAskAbout, language }) => {
  const [activeTab, setActiveTab] = useState<'experience' | 'education' | 'skills' | 'achievements'>('experience');

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            {language === 'et' ? 'Kinnitatud CV faktid ja taust' : 'Verified CV Grounding'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'et'
              ? 'Häälassistendi teadmised põhinevad rangelt nendel kinnitatud faktidel'
              : "The assistant is strictly grounded in these verified facts from Hendrik's CV"}
          </p>
        </div>

        <button
          onClick={onOpenPdf}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{language === 'et' ? 'Ava ametlik CV (PDF)' : 'Open Official CV (PDF)'}</span>
        </button>
      </div>

      {/* Segmented Filter Control for Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 mb-6 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            activeTab === 'experience'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{language === 'et' ? 'Töökogemus (4)' : 'Experience (4)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            activeTab === 'education'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{language === 'et' ? 'Haridus (2)' : 'Education (2)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            activeTab === 'skills'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{language === 'et' ? 'Oskused ja AI tööriistad' : 'Skills & Tech'}</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
            activeTab === 'achievements'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{language === 'et' ? 'Saavutused ja Keeled' : 'Achievements & Languages'}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {HENDRIK_CV.experience.map((exp, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{exp.role}</h3>
                  <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mt-0.5">{exp.company}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{exp.period}</span>
                  <span>·</span>
                  <span>{exp.location}</span>
                </div>
              </div>

              <ul className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">
                {exp.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2">
                    <span className="text-sky-500 mt-1 shrink-0">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                {/* Unboxed skill tags */}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>{exp.skillsUsed.join(' · ')}</span>
                </div>

                <button
                  onClick={() =>
                    onAskAbout(
                      language === 'et'
                        ? `Räägi oma tööst ja saavutustest ettevõttes ${exp.company}`
                        : `Tell me about what you accomplished at ${exp.company}`
                    )
                  }
                  className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors"
                >
                  {language === 'et' ? 'Küsi häälassistendilt →' : 'Ask voice assistant →'}
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
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{edu.institution}</h3>
                  <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 mt-0.5">{edu.degree}</div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  {edu.period}
                </span>
              </div>

              <ul className="space-y-1.5 my-3 text-xs text-slate-600 dark:text-slate-300">
                {edu.details.map((d, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
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
          {HENDRIK_CV.skills.map((cat, idx) => {
            const categoryName = language === 'et' ? cat.categoryEt : cat.category;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-3">
                    {categoryName}
                  </h3>
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                    {cat.items.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAskAbout(
                      language === 'et'
                        ? `Kuidas sa rakendad oma oskusi valdkonnas ${categoryName}?`
                        : `How do you apply your skills in ${categoryName}?`
                    )
                  }
                  className="mt-4 text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 text-left transition-colors"
                >
                  {language === 'et' ? `Küsi ${categoryName.split(' ')[0]} kohta →` : `Ask about ${categoryName.split(' ')[0]} →`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Languages */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
              {language === 'et' ? 'Keeleoskus' : 'Language Fluency'}
            </h3>
            <div className="space-y-2 text-xs">
              {HENDRIK_CV.languages.map((lang, lIdx) => (
                <div
                  key={lIdx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{lang.language}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Honors & Extracurriculars */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                {language === 'et' ? 'Saavutused ja meistritiitlid' : 'Honors & Extracurriculars'}
              </h3>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {(language === 'et' ? HENDRIK_CV.achievementsEt : HENDRIK_CV.achievements).map((ach, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2"
                  >
                    <span className="text-amber-500 font-bold shrink-0">★</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span>{language === 'et' ? 'Hobid:' : 'Hobbies:'} {(language === 'et' ? HENDRIK_CV.hobbiesEt : HENDRIK_CV.hobbies).join(' · ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
