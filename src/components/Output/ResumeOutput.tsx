import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { FileText, ExternalLink, Download, UserCheck, GraduationCap, Award, Mail } from 'lucide-react';

export const ResumeOutput: React.FC = () => {
  const resumeUrl = portfolioConfig.resumeUrl || '/resume.pdf';

  return (
    <div className="my-3 space-y-3 font-mono text-xs md:text-sm max-w-2xl select-text">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1">
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>CURRICULUM VITAE / RESUME</span>
        </span>
        <span className="text-xs text-gray-400">
          Format: <span className="text-emerald-300 font-semibold">PDF Document</span>
        </span>
      </div>

      {/* Main Resume Card */}
      <div className="p-3.5 bg-black/50 border border-emerald-500/40 rounded-lg space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{portfolioConfig.name}</span>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-600/60 px-1.5 py-0.5 rounded font-normal">
                AI / ML Engineer
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {portfolioConfig.title}
            </p>
          </div>
        </div>

        {/* Quick Highlights Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
          <div className="flex items-start gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>B.Tech CSE (AI & ML) — Haldia Institute of Tech</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Oracle OCI Certified AI Foundations Associate</span>
          </div>
          <div className="flex items-start gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
            <span>Deloitte Australia Data Analytics Simulation</span>
          </div>
          <div className="flex items-start gap-1.5">
            <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="truncate">{portfolioConfig.email}</span>
          </div>
        </div>

        {/* Big Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Resume in New Tab (PDF)</span>
          </a>

          <a
            href={resumeUrl}
            download={`${portfolioConfig.name.replace(/\s+/g, '_')}_Resume.pdf`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-emerald-500 text-white font-semibold rounded transition hover:scale-105 active:scale-95 cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        💡 If the PDF did not open automatically due to browser popup blocker, click the button above or email <a href={`mailto:${portfolioConfig.email}`} className="text-emerald-300 underline">{portfolioConfig.email}</a>.
      </div>
    </div>
  );
};
