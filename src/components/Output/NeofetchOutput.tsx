import React from 'react';
import { portfolioConfig } from '../../config/portfolio.config';

export const NeofetchOutput: React.FC = () => {
  const asciiLogo = `
       /\\
      /  \\
     /\\   \\
    /      \\
   /   ,,   \\
  /   |  |  -\\
 /_-''    ''-_\\
`;

  const infoRows = [
    { label: 'USER', value: `${portfolioConfig.handle}@${portfolioConfig.hostname}` },
    { label: 'OS', value: 'Portfolio Linux 6.8.0-custom-arch (x86_64)' },
    { label: 'HOST', value: `${portfolioConfig.name} [Portfolio Edition]` },
    { label: 'ROLE', value: portfolioConfig.title },
    { label: 'LOCATION', value: portfolioConfig.location },
    { label: 'UPTIME', value: '42 days, 13 hours, 37 mins' },
    { label: 'SHELL', value: 'zsh 5.9 (x86_64-apple-darwin)' },
    { label: 'PROJECTS', value: `${portfolioConfig.projects.length} featured active repositories` },
    { label: 'EXPERIENCE', value: `${portfolioConfig.experience.length} career milestones` },
    { label: 'TERMINAL', value: 'VibeTerm v2.4.0 (WebGL accelerated)' },
    { label: 'CPU', value: 'Quantum Core i9-14900K @ 5.80GHz' },
    { label: 'MEMORY', value: '1840MiB / 32768MiB (6%)' },
  ];

  const paletteColors = [
    '#000000', '#ef4444', '#22c55e', '#eab308',
    '#3b82f6', '#a855f7', '#06b6d4', '#ffffff'
  ];

  return (
    <div className="my-3 font-mono text-xs md:text-sm">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
        {/* ASCII Art */}
        <pre className="text-emerald-400 font-bold leading-none select-none text-sm md:text-base hidden sm:block">
          {asciiLogo}
        </pre>

        {/* System Specs List */}
        <div className="space-y-1 flex-1">
          <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 mb-2">
            {portfolioConfig.handle}@{portfolioConfig.hostname}
          </div>

          {infoRows.map((row, idx) => (
            <div key={idx} className="flex flex-wrap">
              <span className="text-emerald-400 font-semibold w-28 md:w-32">{row.label}:</span>
              <span className="text-gray-300">{row.value}</span>
            </div>
          ))}

          {/* Color Palette Bar */}
          <div className="pt-3 flex gap-1.5 items-center">
            {paletteColors.map((col, i) => (
              <span 
                key={i} 
                className="w-4 h-3 md:w-5 md:h-3.5 inline-block rounded-sm shadow-sm"
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Start Tip */}
      <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs text-gray-400">
        💡 <strong className="text-emerald-400">Quick Start:</strong> Type <kbd className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-700/50">projects</kbd> to view work, <kbd className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-700/50">skills</kbd> for stack, <kbd className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-700/50">help</kbd> for commands, or explore with <kbd className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-700/50">ls</kbd> & <kbd className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-700/50">cd</kbd>.
      </div>
    </div>
  );
};
