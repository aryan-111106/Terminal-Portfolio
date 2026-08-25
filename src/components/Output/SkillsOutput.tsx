import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { Code2, Brain, Globe, Wrench, Languages, Sparkles } from 'lucide-react';

export const SkillsOutput: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('programming') || lower.includes('languages') && !lower.includes('spoken')) {
      return <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (lower.includes('ai') || lower.includes('vision') || lower.includes('llm')) {
      return <Brain className="w-4 h-4 text-purple-400 shrink-0" />;
    }
    if (lower.includes('web') || lower.includes('backend') || lower.includes('frontend')) {
      return <Globe className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    if (lower.includes('devops') || lower.includes('tools') || lower.includes('environment')) {
      return <Wrench className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (lower.includes('spoken')) {
      return <Languages className="w-4 h-4 text-rose-400 shrink-0" />;
    }
    return <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />;
  };

  return (
    <div className="my-3 space-y-4 font-mono text-xs md:text-sm select-text w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-emerald-500/30 pb-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-emerald-400 font-bold text-sm md:text-base">
            TECHNICAL COMPETENCIES & PROFICIENCY MATRIX
          </span>
        </div>
        <span className="text-xs text-gray-400">
          Core AI/ML & Full-Stack Development
        </span>
      </div>

      {/* Grid of Categorized Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolioConfig.skills.map((group, idx) => (
          <div 
            key={idx} 
            className="p-4 md:p-4.5 bg-black/50 border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl space-y-3.5 shadow-lg transition-all"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {getCategoryIcon(group.category)}
                <h3 className="text-emerald-300 font-bold text-xs md:text-sm uppercase tracking-wider">
                  {group.category}
                </h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                {group.skills.length} skills
              </span>
            </div>

            {/* Skill Items with Roomy Spacing */}
            <div className="space-y-3">
              {group.skills.map((skill, sIdx) => {
                const filledBlocks = Math.round(skill.level / 10);
                const emptyBlocks = 10 - filledBlocks;
                return (
                  <div 
                    key={sIdx} 
                    className="p-2.5 bg-black/40 border border-slate-800/80 rounded-lg space-y-1.5 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-1">
                      <span className="font-bold text-white text-xs md:text-sm">
                        {skill.name}
                      </span>
                      <span className="text-emerald-400 text-[11px] font-mono shrink-0 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                        [{'#'.repeat(filledBlocks)}{'.'.repeat(emptyBlocks)}] {skill.level}%
                      </span>
                    </div>

                    {skill.description && (
                      <p className="text-xs text-gray-400 leading-relaxed">
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

      <div className="text-xs text-gray-400 pt-1">
        💡 Tip: Type <kbd className="text-emerald-300">projects</kbd> to inspect code implementations, or run <kbd className="text-emerald-300">resume</kbd> to view full CV.
      </div>
    </div>
  );
};
