import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';

export const WelcomeHero: React.FC = () => {
  return (
    <div className="my-3 font-mono text-xs md:text-sm select-text">
      {/* ASCII Art Hero Container */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6 p-3 md:p-4 bg-black/40 border border-emerald-500/30 rounded-lg">
        {/* Left: ASCII Portrait */}
        {portfolioConfig.asciiPortrait && (
          <div className="shrink-0 flex flex-col items-center">
            <pre className="text-emerald-400 font-bold leading-none select-none text-xs md:text-sm drop-shadow-sm whitespace-pre">
              {portfolioConfig.asciiPortrait.trim()}
            </pre>
            <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">[ AVATAR ]</span>
          </div>
        )}

        {/* Right: Big ASCII Name + Welcome message */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 overflow-x-auto w-full">
          {/* Big ASCII Name Banner */}
          {portfolioConfig.asciiName && (
            <pre className="text-emerald-400 font-bold leading-none select-none text-[8px] sm:text-[10px] md:text-xs overflow-x-auto max-w-full whitespace-pre">
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

          {/* Quick Command Guidance Banner */}
          <div className="pt-2 border-t border-emerald-500/20 w-full text-xs text-gray-400 flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
            <span>Type</span>
            <kbd className="bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50 font-bold">'help'</kbd>
            <span>or</span>
            <kbd className="bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/50 font-bold">'?'</kbd>
            <span>to view available commands, or click the quick action pills below.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
