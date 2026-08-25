import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { Award, CheckCircle2, Trophy, ShieldCheck, Sparkles } from 'lucide-react';

export const CertificationsOutput: React.FC = () => {
  const certs = portfolioConfig.certifications || [];
  const awards = portfolioConfig.awards || [];

  return (
    <div className="my-3 space-y-4 font-mono text-xs md:text-sm select-text w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-emerald-500/30 pb-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-emerald-400 font-bold text-sm md:text-base">
            PROFESSIONAL CERTIFICATIONS & HONORS
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {certs.length} Credentials • {awards.length} Honors
        </span>
      </div>

      {/* Certifications Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Certifications & Technical Courses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certs.map((cert, idx) => {
            let badgeBg = "bg-emerald-950 text-emerald-300 border-emerald-700/60";
            if (cert.issuer.toLowerCase().includes("oracle")) badgeBg = "bg-rose-950 text-rose-300 border-rose-700/60";
            else if (cert.issuer.toLowerCase().includes("google")) badgeBg = "bg-sky-950 text-sky-300 border-sky-700/60";
            else if (cert.issuer.toLowerCase().includes("iit") || cert.issuer.toLowerCase().includes("nptel")) badgeBg = "bg-amber-950 text-amber-300 border-amber-700/60";
            else if (cert.issuer.toLowerCase().includes("deloitte")) badgeBg = "bg-emerald-950 text-emerald-300 border-emerald-700/60";

            return (
              <div 
                key={idx}
                className="p-3.5 bg-black/50 border border-emerald-500/30 hover:border-emerald-400/80 rounded-lg flex flex-col justify-between transition-all duration-200 shadow-md group hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold font-mono ${badgeBg}`}>
                      {cert.issuer}
                    </span>
                    <span className="text-xs text-emerald-400/90 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
                      {cert.year || '2025'}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs md:text-sm leading-snug group-hover:text-emerald-200 transition">
                    {cert.title}
                  </h3>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Credential</span>
                  </span>
                  <span className="text-gray-500">
                    Issuer: {cert.issuer}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Honors & Awards Section */}
      {awards.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Academic Honors & Recognition</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {awards.map((award, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-black/50 border border-amber-500/40 hover:border-amber-400 rounded-lg space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span>{award.issuer || 'Award'}</span>
                  </span>
                  <span className="text-xs text-yellow-400 font-mono">
                    {award.year}
                  </span>
                </div>

                <h3 className="font-bold text-yellow-200 text-sm">
                  {award.title}
                </h3>
                <p className="text-xs text-gray-300">
                  Awarded in recognition of exceptional academic merit and talent excellence.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Tip */}
      <div className="text-xs text-gray-400 pt-1">
        💡 Tip: Type <kbd className="text-emerald-300">resume</kbd> to view full CV with certifications, or <kbd className="text-emerald-300">projects</kbd> to see implementations.
      </div>
    </div>
  );
};
