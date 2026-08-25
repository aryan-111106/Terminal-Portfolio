import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { Briefcase } from 'lucide-react';

export const ExperienceOutput: React.FC = () => {
  return (
    <div className="my-3 space-y-4 font-mono text-sm">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-emerald-400" />
        <span>CAREER HISTORY & EXPERIENCE</span>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-emerald-500/20">
        {portfolioConfig.experience.map((exp, idx) => (
          <div key={idx} className="relative pl-6">
            {/* Timeline Dot */}
            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${exp.current ? 'bg-emerald-400 border-emerald-300 animate-pulse' : 'bg-slate-900 border-emerald-500/50'}`} />

            <div className="p-3 bg-black/40 border border-emerald-500/30 rounded-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h3 className="font-bold text-emerald-300 text-sm">
                  {exp.role} <span className="text-gray-400">@</span> <span className="text-white">{exp.company}</span>
                </h3>
                <span className="text-xs text-emerald-400/90 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
                  {exp.period}
                </span>
              </div>

              <div className="text-xs text-gray-400 mb-2">
                📍 {exp.location}
              </div>

              <ul className="space-y-1 text-xs text-gray-300 mb-3 list-disc list-inside">
                {exp.description.map((item, dIdx) => (
                  <li key={dIdx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800">
                {exp.technologies.map((tech, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
