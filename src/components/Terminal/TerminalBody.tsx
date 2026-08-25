import React from 'react';
import { CommandHistoryItem } from '../../types/terminal';
import { TerminalTheme } from '../../config/themes';
import { WelcomeHero } from '../Output/WelcomeHero';
import { WhoamiOutput } from '../Output/WhoamiOutput';
import { SysinfoOutput } from '../Output/SysinfoOutput';
import { WeatherOutput } from '../Output/WeatherOutput';
import { NeofetchOutput } from '../Output/NeofetchOutput';
import { ProjectsOutput } from '../Output/ProjectsOutput';
import { SkillsOutput } from '../Output/SkillsOutput';
import { ExperienceOutput } from '../Output/ExperienceOutput';
import { AboutOutput } from '../Output/AboutOutput';
import { ContactOutput } from '../Output/ContactOutput';
import { Cowsay } from '../EasterEggs/Cowsay';
import { TerminalPrompt } from './TerminalPrompt';
import { commandRegistry } from '../../services/commandRegistry';

interface TerminalBodyProps {
  history: CommandHistoryItem[];
  user: string;
  hostname: string;
  cwd: string;
  input: string;
  setInput: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  suggestions: string[];
  onSelectSuggestion: (s: string) => void;
  theme: TerminalTheme;
}

export const TerminalBody: React.FC<TerminalBodyProps> = ({
  history,
  user,
  hostname,
  cwd,
  input,
  setInput,
  inputRef,
  bottomRef,
  onKeyDown,
  onFocus,
  suggestions,
  onSelectSuggestion,
  theme,
}) => {
  const renderHelpOutput = () => {
    const all = commandRegistry.getAllCommands();
    const categories: Record<string, typeof all> = {};

    all.forEach(cmd => {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd);
    });

    return (
      <div className="my-3 space-y-3 font-mono text-xs md:text-sm">
        <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1">
          📖 AVAILABLE SHELL COMMANDS & MANUAL
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(categories).map(([cat, cmds]) => (
            <div key={cat} className="p-2.5 bg-black/40 border border-emerald-500/20 rounded">
              <h4 className="text-xs font-bold text-emerald-300 mb-1.5 uppercase tracking-wider">
                [{cat}]
              </h4>
              <div className="space-y-1">
                {cmds.map(c => (
                  <div key={c.name} className="flex items-start text-xs">
                    <span className="font-semibold text-emerald-400 w-24 shrink-0">{c.name}</span>
                    <span className="text-gray-300">{c.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-400 pt-1">
          💡 Tip: Use <kbd className="text-emerald-300">Tab</kbd> for autocompletion and <kbd className="text-emerald-300">↑ / ↓</kbd> for command history.
        </div>
      </div>
    );
  };

  const renderHistoryOutput = (item: CommandHistoryItem) => {
    if (item.type === 'welcome') {
      return <WelcomeHero />;
    }
    if (item.type === 'whoami') {
      return <WhoamiOutput />;
    }
    if (item.type === 'sysinfo') {
      return <SysinfoOutput />;
    }
    if (item.type === 'weather') {
      return <WeatherOutput />;
    }
    if (item.type === 'neofetch') {
      return <NeofetchOutput />;
    }
    if (item.type === 'projects') {
      return <ProjectsOutput filter={item.rawArgs?.[0]} />;
    }
    if (item.type === 'skills') {
      return <SkillsOutput />;
    }
    if (item.type === 'experience') {
      return <ExperienceOutput />;
    }
    if (item.type === 'about') {
      return <AboutOutput />;
    }
    if (item.type === 'contact') {
      return <ContactOutput />;
    }
    if (item.type === 'help') {
      return renderHelpOutput();
    }
    if (item.type === 'cowsay' && typeof item.output === 'string') {
      return <Cowsay text={item.output} />;
    }

    if (item.type === 'error') {
      return (
        <div className="text-xs md:text-sm whitespace-pre-wrap font-mono my-1 font-semibold" style={{ color: theme.colors.error }}>
          {item.output}
        </div>
      );
    }

    if (item.type === 'success') {
      return (
        <div className="text-xs md:text-sm whitespace-pre-wrap font-mono my-1" style={{ color: theme.colors.success }}>
          {item.output}
        </div>
      );
    }

    if (item.type === 'warning') {
      return (
        <div className="text-xs md:text-sm whitespace-pre-wrap font-mono my-1" style={{ color: theme.colors.warning }}>
          {item.output}
        </div>
      );
    }

    if (item.type === 'info') {
      return (
        <div className="text-xs md:text-sm whitespace-pre-wrap font-mono my-1" style={{ color: theme.colors.info }}>
          {item.output}
        </div>
      );
    }

    if (item.type === 'tree') {
      return (
        <pre className="text-xs md:text-sm font-mono my-1 text-emerald-300 leading-tight whitespace-pre overflow-x-auto">
          {item.output}
        </pre>
      );
    }

    if (item.output) {
      return (
        <div className="text-xs md:text-sm whitespace-pre-wrap font-mono my-1 leading-relaxed text-gray-200">
          {item.output}
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      onClick={onFocus}
      className="flex-1 overflow-y-auto p-3 md:p-5 font-mono cursor-text select-text transition-colors duration-200"
      style={{
        backgroundColor: theme.colors.bg,
        color: theme.colors.text,
      }}
    >
      {/* Past commands stack */}
      {history.map((item) => (
        <div key={item.id} className="mb-3">
          {/* Historical prompt line */}
          {item.command !== 'welcome' && (
            <div className="flex items-center flex-wrap gap-x-1.5 font-mono text-xs md:text-sm opacity-90">
              <span className="font-bold select-none" style={{ color: theme.colors.promptUser }}>
                {user}@{hostname}
              </span>
              <span className="font-bold select-none" style={{ color: theme.colors.textMuted }}>
                :
              </span>
              <span className="font-bold select-none" style={{ color: theme.colors.promptPath }}>
                {item.cwd.replace('/home/guest', '~')}
              </span>
              <span className="font-bold select-none" style={{ color: theme.colors.promptChar }}>
                $
              </span>
              <span className="font-semibold" style={{ color: theme.colors.command }}>
                {item.command}
              </span>
            </div>
          )}

          {/* Historical command output */}
          <div className="mt-1">
            {renderHistoryOutput(item)}
          </div>
        </div>
      ))}

      {/* Autocomplete Suggestions */}
      {suggestions.length > 0 && (
        <div className="my-2 py-2 px-3 bg-black/50 border border-emerald-500/20 rounded-md font-mono text-xs max-h-56 overflow-y-auto">
          <div className="text-gray-400 italic mb-2 select-none">Suggestions:</div>
          <div className="space-y-1.5">
            {suggestions.map((s) => {
              const def = commandRegistry.getCommand(s);
              return (
                <div
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSuggestion(s);
                  }}
                  className="flex items-baseline gap-4 cursor-pointer hover:bg-emerald-500/10 p-1 rounded transition group"
                >
                  <span className="font-bold text-emerald-400 group-hover:text-emerald-300 min-w-[140px] md:min-w-[180px] shrink-0">
                    {s}
                  </span>
                  <span className="text-gray-400 group-hover:text-gray-300 italic text-[11px] md:text-xs">
                    - {def?.description || ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active input prompt */}
      <TerminalPrompt
        user={user}
        hostname={hostname}
        cwd={cwd}
        input={input}
        setInput={setInput}
        inputRef={inputRef}
        onKeyDown={onKeyDown}
        theme={theme}
      />

      {/* Auto-scroll anchor */}
      <div ref={bottomRef} className="h-6" />
    </div>
  );
};
