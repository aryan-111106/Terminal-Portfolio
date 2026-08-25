import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';

interface WelcomeHeroProps {
  onExecute?: (cmd: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onExecute }) => {
  return (
    <div className="my-3 font-mono text-xs md:text-sm select-text">
      {/* ASCII Art Hero Container */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 p-3 md:p-4 bg-black/40 border border-emerald-500/30 rounded-lg">
        {/* Left: ASCII Portrait */}
        {portfolioConfig.asciiPortrait && (
          <div className="shrink-0 flex flex-col items-center">
            <pre className="text-emerald-400 font-bold leading-none select-none text-[11px] md:text-xs drop-shadow-sm whitespace-pre">
              {portfolioConfig.asciiPortrait.trim()}
            </pre>
            <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">[ AVATAR ]</span>
          </div>
        )}

        {/* Right: Big ASCII Name + Welcome message */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-2 overflow-x-auto w-full">
          {/* Big ASCII Name Banner */}
          {portfolioConfig.asciiName && (
            <pre className="text-emerald-400 font-bold leading-none select-none text-[8px] sm:text-[9px] md:text-[11px] overflow-x-auto max-w-full whitespace-pre">
              {portfolioConfig.asciiName.trim()}
            </pre>
          )}

          {/* Welcome Taglines */}
          <div className="space-y-1 pt-1">
            <h1 className="text-sm md:text-base font-bold text-emerald-300">
              {portfolioConfig.welcomeTagline || `Welcome to ${portfolioConfig.name}'s Terminal Portfolio`}
            </h1>
            <p className="text-xs text-gray-300">
              {portfolioConfig.welcomeSubtitle || portfolioConfig.title}
            </p>
          </div>

          {/* Quick Start Interactive Command Buttons */}
          <div className="pt-2.5 border-t border-emerald-500/20 w-full text-xs text-gray-300 flex flex-wrap items-center justify-center md:justify-start gap-1.5 leading-relaxed">
            <span className="text-yellow-400 font-bold flex items-center gap-1">💡 Quick Start:</span>
            <span>Type</span>
            <button
              onClick={() => onExecute?.('projects')}
              className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 hover:border-emerald-400 text-emerald-300 rounded font-mono font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Click to execute 'projects'"
            >
              projects
            </button>
            <span>to view work,</span>
            <button
              onClick={() => onExecute?.('skills')}
              className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 hover:border-emerald-400 text-emerald-300 rounded font-mono font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Click to execute 'skills'"
            >
              skills
            </button>
            <span>for stack,</span>
            <button
              onClick={() => onExecute?.('help')}
              className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 hover:border-emerald-400 text-emerald-300 rounded font-mono font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Click to execute 'help'"
            >
              help
            </button>
            <span>for commands, or explore with</span>
            <button
              onClick={() => onExecute?.('ls')}
              className="px-1.5 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 hover:border-emerald-400 text-emerald-300 rounded font-mono font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Click to execute 'ls'"
            >
              ls
            </button>
            <span>&</span>
            <button
              onClick={() => onExecute?.('cd projects')}
              className="px-1.5 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 hover:border-emerald-400 text-emerald-300 rounded font-mono font-bold transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Click to execute 'cd projects'"
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
