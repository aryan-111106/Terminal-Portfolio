import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';

interface WelcomeHeroProps {
  onExecute?: (cmd: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onExecute }) => {
  const handleCommandClick = (cmd: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onExecute) {
      onExecute(cmd);
    }
  };

  return (
    <div className="my-3 font-mono text-xs md:text-sm select-text">
      {/* ASCII Art Hero Container */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 p-3 md:p-4 bg-black/40 border border-emerald-500/30 rounded-lg">
        {/* Left: ASCII Portrait */}
        {portfolioConfig.asciiPortrait && (
          <div className="shrink-0 flex flex-col items-center">
            <pre className="text-emerald-400 font-bold leading-none select-none text-[6.5px] sm:text-[8px] md:text-[9.5px] drop-shadow-sm whitespace-pre">
              {portfolioConfig.asciiPortrait.trim()}
            </pre>
            <span className="text-[10px] text-emerald-500/70 mt-1 uppercase tracking-widest font-mono">[ AVENGERS ]</span>
          </div>
        )}

        {/* Right: Big ASCII Name + Welcome message */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-2 overflow-hidden w-full">
          {/* Big ASCII Name Banner */}
          {portfolioConfig.asciiName && (
            <div className="w-full overflow-x-auto no-scrollbar">
              <pre className="text-emerald-400 font-bold leading-none select-none text-[7.5px] sm:text-[9px] md:text-[10.5px] whitespace-pre no-scrollbar">
                {portfolioConfig.asciiName.trim()}
              </pre>
            </div>
          )}

          {/* Welcome Tagline & Subtitle */}
          <div>
            <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
              {portfolioConfig.welcomeTagline || `Welcome to ${portfolioConfig.name}'s Portfolio`}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
              {portfolioConfig.welcomeSubtitle || portfolioConfig.title}
            </p>
          </div>

          {/* Quick Start Interactive Command Buttons */}
          <div className="pt-2.5 border-t border-emerald-500/20 w-full text-xs text-gray-300 flex flex-wrap items-center justify-center md:justify-start gap-1.5 leading-relaxed">
            <span className="text-yellow-400 font-bold flex items-center gap-1">💡 Quick Start:</span>
            <span>Click or type</span>

            <button
              type="button"
              onClick={(e) => handleCommandClick('projects', e)}
              className="px-2 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 rounded font-mono font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm inline-flex items-center"
              title="Click to run 'projects'"
            >
              projects
            </button>

            <span>to view work,</span>

            <button
              type="button"
              onClick={(e) => handleCommandClick('skills', e)}
              className="px-2 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 rounded font-mono font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm inline-flex items-center"
              title="Click to run 'skills'"
            >
              skills
            </button>

            <span>for stack,</span>

            <button
              type="button"
              onClick={(e) => handleCommandClick('experience', e)}
              className="px-2 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 rounded font-mono font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm inline-flex items-center"
              title="Click to run 'experience'"
            >
              experience
            </button>

            <span>for journey,</span>

            <button
              type="button"
              onClick={(e) => handleCommandClick('help', e)}
              className="px-2 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 rounded font-mono font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm inline-flex items-center"
              title="Click to run 'help'"
            >
              help
            </button>

            <span>for commands, or explore with</span>

            <button
              type="button"
              onClick={(e) => handleCommandClick('ls', e)}
              className="px-1.5 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 rounded font-mono font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm inline-flex items-center"
              title="Click to run 'ls'"
            >
              ls
            </button>

            <span>&</span>

            <button
              type="button"
              onClick={(e) => handleCommandClick('cd projects', e)}
              className="px-1.5 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-600/70 hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 rounded font-mono font-bold transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm inline-flex items-center"
              title="Click to run 'cd projects'"
            >
              cd
            </button>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
