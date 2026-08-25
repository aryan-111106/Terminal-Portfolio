import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';
import { User, Heart, Sparkles, Compass } from 'lucide-react';

export const AboutOutput: React.FC = () => {
  return (
    <div className="my-3 space-y-4 font-mono text-sm max-w-3xl">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 flex items-center gap-2">
        <User className="w-4 h-4 text-emerald-400" />
        <span>ABOUT {portfolioConfig.name.toUpperCase()}</span>
      </div>

      {/* Bio paragraphs */}
      <div className="space-y-2 text-xs md:text-sm text-gray-200 leading-relaxed bg-black/40 p-3 border border-emerald-500/20 rounded-md">
        {portfolioConfig.bio.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Passions */}
        <div className="p-3 bg-black/40 border border-emerald-500/20 rounded-md">
          <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>CORE PASSIONS</span>
          </h4>
          <ul className="space-y-1 text-xs text-gray-300">
            {portfolioConfig.about.passions.map((p, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400">▹</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Focus & Fun fact */}
        <div className="p-3 bg-black/40 border border-emerald-500/20 rounded-md space-y-3">
          <div>
            <h4 className="text-xs font-bold text-sky-300 flex items-center gap-1.5 mb-1">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>CURRENT FOCUS</span>
            </h4>
            <p className="text-xs text-gray-300">
              {portfolioConfig.about.currentFocus}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>FUN FACT</span>
            </h4>
            <p className="text-xs text-gray-300 italic">
              "{portfolioConfig.about.funFact}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
