import React from 'react';
import { TerminalTheme } from '../../config/themes';

interface TerminalPromptProps {
  user: string;
  hostname: string;
  cwd: string;
  input: string;
  setInput: (val: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  theme: TerminalTheme;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  user,
  hostname,
  cwd,
  input,
  setInput,
  inputRef,
  onKeyDown,
  theme,
}) => {
  const displayCwd = cwd.replace('/home/guest', '~');

  return (
    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 font-mono text-xs md:text-sm pt-1">
      {/* Prompt Prefix */}
      <span className="font-bold select-none shrink-0" style={{ color: theme.colors.promptUser }}>
        {user}@{hostname}
      </span>
      <span className="font-bold select-none shrink-0" style={{ color: theme.colors.textMuted }}>
        :
      </span>
      <span className="font-bold select-none shrink-0" style={{ color: theme.colors.promptPath }}>
        {displayCwd}
      </span>
      <span className="font-bold select-none shrink-0" style={{ color: theme.colors.promptChar }}>
        $
      </span>

      {/* Input container */}
      <div className="relative flex-1 min-w-[120px] flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="w-full bg-transparent outline-none border-none p-0 font-mono text-xs md:text-sm text-inherit caret-transparent"
          style={{
            color: theme.colors.text,
          }}
        />

        {/* Custom Visual Caret Block Cursor */}
        <span
          className="absolute pointer-events-none inline-block w-2.5 h-4 md:h-4.5 animate-blink"
          style={{
            left: `${input.length}ch`,
            backgroundColor: theme.colors.cursor,
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
};
