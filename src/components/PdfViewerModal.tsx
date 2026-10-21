import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import { HENDRIK_CV } from '../data/hendrikCv';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'et';
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl h-[88vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-colors duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'et' ? 'Ametlik CV dokument' : 'Official CV Document'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hendrik Puhkan · Estonian Business School
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={HENDRIK_CV.pdfPath}
              download="Hendrik_Puhkan_CV.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'et' ? 'Laadi alla' : 'Download'}</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 relative">
          <iframe
            src={`${HENDRIK_CV.pdfPath}#toolbar=0`}
            title="Hendrik Puhkan CV"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
