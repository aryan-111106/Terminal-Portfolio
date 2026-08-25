import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';

export const SkillsOutput: React.FC = () => {
  return (
    <div className="my-3 space-y-4 font-mono text-sm">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1">
        🛠️ TECHNICAL COMPETENCIES & PROFICIENCY
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioConfig.skills.map((group, idx) => (
          <div 
            key={idx} 
            className="p-3 bg-black/40 border border-emerald-500/20 rounded-md"
          >
            <h3 className="text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-800">
              // {group.category}
            </h3>

            <div className="space-y-2">
              {group.skills.map((skill, sIdx) => {
                const filledBlocks = Math.round(skill.level / 10);
                const emptyBlocks = 10 - filledBlocks;
                return (
                  <div key={sIdx} className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-semibold text-gray-200">{skill.name}</span>
                      <span className="text-emerald-400 text-[11px] font-mono">
                        [{'#'.repeat(filledBlocks)}{'.'.repeat(emptyBlocks)}] {skill.level}%
                      </span>
                    </div>
                    {skill.description && (
                      <p className="text-[11px] text-gray-400 leading-tight">
                        {skill.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
