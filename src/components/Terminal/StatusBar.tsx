import React, { useState, useEffect } from 'react';
import { TerminalTheme } from '../../config/themes';
import { GitBranch, Radio, Sparkles } from 'lucide-react';

interface StatusBarProps {
  theme: TerminalTheme;
  cwd: string;
  commandCount: number;
  soundEnabled: boolean;
  crtEnabled: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  theme,
  cwd,
  commandCount,
  soundEnabled,
  crtEnabled,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const displayCwd = cwd.replace('/home/guest', '~');

  return (
    <div 
      className="px-3 py-1 border-t text-[11px] font-mono flex items-center justify-between select-none"
      style={{
        backgroundColor: theme.statusBarBg,
        borderColor: theme.colors.border,
        color: theme.colors.textMuted,
      }}
    >
      {/* Left items */}
      <div className="flex items-center space-x-3">
        <span className="flex items-center gap-1 font-semibold" style={{ color: theme.colors.promptUser }}>
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </span>

        <span className="hidden sm:inline">
          {displayCwd}
        </span>

        <span className="hidden md:inline">
          history: {commandCount}
        </span>
      </div>

      {/* Right items */}
      <div className="flex items-center space-x-3">
        <span className="hidden sm:flex items-center gap-1">
          <Sparkles className="w-3 h-3" style={{ color: theme.colors.accent }} />
          <span>{theme.name}</span>
        </span>

        <span className="hidden lg:inline">
          UTF-8
        </span>

        <span className="flex items-center gap-1">
          <Radio className="w-3 h-3" style={{ color: soundEnabled ? theme.colors.success : theme.colors.textMuted }} />
          <span>{soundEnabled ? 'SFX' : 'MUTED'}</span>
        </span>

        {crtEnabled && (
          <span className="hidden sm:inline px-1 py-0.2 rounded bg-black/40 text-emerald-400 border border-emerald-800/40 text-[10px]">
            CRT
          </span>
        )}

        <span className="font-bold text-gray-300">
          {time}
        </span>
      </div>
    </div>
  );
};
