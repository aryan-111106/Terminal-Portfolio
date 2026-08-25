import React, { useState, useEffect, useRef } from 'react';
import { TerminalTheme } from '../../config/themes';
import { virtualFS } from '../../services/fileSystem';
import { soundFX } from '../../services/soundFX';
import { Save, X, HelpCircle, Check } from 'lucide-react';

interface VimEditorProps {
  filePath?: string;
  cwd: string;
  theme: TerminalTheme;
  onClose: (message?: string) => void;
}

type VimMode = 'NORMAL' | 'INSERT' | 'COMMAND';

export const VimEditor: React.FC<VimEditorProps> = ({
  filePath,
  cwd,
  theme,
  onClose,
}) => {
  const resolvedPath = filePath ? virtualFS.resolvePath(cwd, filePath) : virtualFS.resolvePath(cwd, 'untitled.txt');
  const filename = resolvedPath.split('/').pop() || 'untitled.txt';

  const [content, setContent] = useState<string>(() => {
    if (filePath) {
      const res = virtualFS.readFile(resolvedPath);
      if (!res.error) return res.content;
    }
    return '';
  });

  const [mode, setMode] = useState<VimMode>('NORMAL');
  const [commandInput, setCommandInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>(`"${filename}" ${content.split('\n').length}L, ${content.length}B`);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (mode === 'INSERT' && textareaRef.current) {
      textareaRef.current.focus();
    } else if (mode === 'COMMAND' && commandInputRef.current) {
      commandInputRef.current.focus();
    }
  }, [mode]);

  // Track cursor position
  const handleCursorUpdate = () => {
    if (!textareaRef.current) return;
    const textBeforeCursor = textareaRef.current.value.substring(0, textareaRef.current.selectionStart);
    const lines = textBeforeCursor.split('\n');
    setCursorPos({
      line: lines.length,
      col: (lines[lines.length - 1] || '').length + 1
    });
  };

  // Keyboard navigation & Vim hotkeys
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (showHelp) {
        if (e.key === 'Escape' || e.key === 'q' || e.key === 'Enter') {
          setShowHelp(false);
        }
        return;
      }

      if (mode === 'NORMAL') {
        if (e.key === 'i' || e.key === 'a' || e.key === 'Insert') {
          e.preventDefault();
          setMode('INSERT');
          setStatusMessage('-- INSERT --');
          soundFX.playKeyClick();
        } else if (e.key === ':') {
          e.preventDefault();
          setMode('COMMAND');
          setCommandInput(':');
          setStatusMessage('');
          soundFX.playKeyClick();
        } else if (e.key === 'h' || e.key === 'j' || e.key === 'k' || e.key === 'l') {
          // Normal mode arrow navigation
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        } else if (e.key === 'u') {
          setStatusMessage('Already at oldest change');
        } else if (e.key === '?') {
          setShowHelp(true);
        }
      } else if (mode === 'INSERT') {
        if (e.key === 'Escape') {
          e.preventDefault();
          setMode('NORMAL');
          setStatusMessage('');
          soundFX.playBeep(440, 0.03);
        }
      } else if (mode === 'COMMAND') {
        if (e.key === 'Escape') {
          e.preventDefault();
          setMode('NORMAL');
          setCommandInput('');
          setStatusMessage('');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [mode, showHelp]);

  // Execute Vim :commands
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();

    if (cmd === ':w') {
      // Save
      virtualFS.createFile(resolvedPath, content);
      setIsModified(false);
      setStatusMessage(`"${filename}" [OK] ${content.split('\n').length}L, ${content.length}B written`);
      setMode('NORMAL');
      soundFX.playChime();
    } else if (cmd === ':q') {
      // Quit
      if (isModified) {
        setStatusMessage('E37: No write since last change (add ! to override)');
        soundFX.playError();
        setMode('NORMAL');
      } else {
        soundFX.playBeep(400, 0.05);
        onClose();
      }
    } else if (cmd === ':q!' || cmd === ':qa!') {
      // Force quit
      soundFX.playBeep(400, 0.05);
      onClose();
    } else if (cmd === ':wq' || cmd === ':x') {
      // Save and quit
      virtualFS.createFile(resolvedPath, content);
      soundFX.playChime();
      onClose(`"${filename}" saved and buffer closed.`);
    } else if (cmd === ':help' || cmd === ':h') {
      setShowHelp(true);
      setMode('NORMAL');
    } else {
      setStatusMessage(`E492: Not an editor command: ${cmd}`);
      soundFX.playError();
      setMode('NORMAL');
    }
  };

  const lines = content.split('\n');
  const totalLines = Math.max(lines.length, 18);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col font-mono text-xs md:text-sm select-none">
      {/* Top Vim Title Bar */}
      <div 
        className="flex items-center justify-between px-3 py-1.5 border-b text-xs"
        style={{
          backgroundColor: theme.headerBg || '#0f172a',
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400">VIM</span>
          <span className="text-gray-400">— Vi IMproved 9.1</span>
          <span className="text-gray-300 bg-black/50 px-2 py-0.5 rounded border border-slate-700 font-mono">
            {filename} {isModified ? '[+]' : ''}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              virtualFS.createFile(resolvedPath, content);
              setIsModified(false);
              setStatusMessage(`"${filename}" saved successfully`);
              soundFX.playChime();
            }}
            className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-300 rounded flex items-center gap-1 text-[11px] transition"
            title="Save (:w)"
          >
            <Save className="w-3 h-3" />
            <span className="hidden sm:inline">Save (:w)</span>
          </button>

          <button
            onClick={() => {
              setMode((prev: VimMode) => prev === 'INSERT' ? 'NORMAL' : 'INSERT');
              soundFX.playKeyClick();
            }}
            className={`px-2 py-0.5 border rounded flex items-center gap-1 text-[11px] transition ${
              mode === 'INSERT' 
                ? 'bg-emerald-600 text-black font-bold border-emerald-400' 
                : 'bg-slate-800 text-gray-200 border-slate-600 hover:bg-slate-700'
            }`}
          >
            <span>{mode === 'INSERT' ? 'NORMAL (Esc)' : 'INSERT (i)'}</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-gray-300 rounded flex items-center gap-1 text-[11px] transition"
            title="Vim Cheatsheet"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Help</span>
          </button>

          <button
            onClick={() => {
              if (isModified) {
                if (window.confirm('You have unsaved changes. Quit without saving?')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            className="px-2 py-0.5 bg-red-950/80 hover:bg-red-900 border border-red-600/70 text-red-300 rounded flex items-center gap-1 text-[11px] transition ml-1"
            title="Quit (:q)"
          >
            <X className="w-3 h-3" />
            <span>Quit (:q)</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden bg-[#0d1117] text-gray-200 relative select-text">
        {/* Line Numbers Column */}
        <div className="w-10 sm:w-12 bg-[#090d13] border-r border-slate-800 py-2 select-none text-right pr-2 font-mono text-xs text-gray-600 shrink-0 leading-5">
          {Array.from({ length: totalLines }).map((_, i) => (
            <div key={i} className={i + 1 === cursorPos.line ? 'text-yellow-400 font-bold' : ''}>
              {i < lines.length ? i + 1 : '~'}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsModified(true);
            handleCursorUpdate();
          }}
          onKeyUp={handleCursorUpdate}
          onClick={handleCursorUpdate}
          readOnly={mode === 'NORMAL'}
          className={`flex-1 p-2 bg-transparent text-gray-100 font-mono text-xs md:text-sm leading-5 resize-none outline-none border-none overflow-y-auto no-scrollbar ${
            mode === 'NORMAL' ? 'cursor-default' : 'cursor-text'
          }`}
          placeholder="Start typing or press 'i' to enter INSERT mode..."
          autoFocus
          spellCheck={false}
        />
      </div>

      {/* Vim Bottom Command & Status Bar */}
      <div className="bg-[#161b22] border-t border-slate-800 px-3 py-1 font-mono text-xs shrink-0 flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {/* Mode Badge */}
          {mode === 'INSERT' && (
            <span className="bg-emerald-600 text-black font-bold px-1.5 py-0.2 rounded text-[11px] tracking-wider animate-pulse">
              -- INSERT --
            </span>
          )}
          {mode === 'NORMAL' && (
            <span className="bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded text-[11px] tracking-wider">
              -- NORMAL --
            </span>
          )}

          {/* Command Prompt or Status Message */}
          {mode === 'COMMAND' ? (
            <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center">
              <input
                ref={commandInputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-full bg-transparent text-yellow-300 font-mono text-xs outline-none border-none"
                placeholder="type :w, :q, :wq, :q!"
                autoFocus
              />
            </form>
          ) : (
            <span className="text-gray-300 text-[11px] truncate">
              {statusMessage || `Press 'i' to Edit • ':' for Commands • ':wq' to Save & Exit`}
            </span>
          )}
        </div>

        {/* Position Metrics */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 shrink-0 font-mono">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="text-emerald-400 font-semibold">{Math.round((cursorPos.line / Math.max(lines.length, 1)) * 100)}%</span>
        </div>
      </div>

      {/* Help Modal Cheatsheet */}
      {showHelp && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 bg-slate-900 border border-emerald-500/50 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h3 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Vim Quick Keybindings & Cheatsheet</span>
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-300 font-mono">
              <div className="grid grid-cols-2 gap-2 p-2 bg-black/40 rounded border border-slate-800">
                <span className="text-yellow-300 font-semibold">i or Insert</span>
                <span>Enter INSERT mode</span>
                <span className="text-yellow-300 font-semibold">Escape</span>
                <span>Return to NORMAL mode</span>
                <span className="text-yellow-300 font-semibold">:w</span>
                <span>Save buffer to virtual file</span>
                <span className="text-yellow-300 font-semibold">:q</span>
                <span>Quit editor</span>
                <span className="text-yellow-300 font-semibold">:wq / :x</span>
                <span>Save & Exit</span>
                <span className="text-yellow-300 font-semibold">:q!</span>
                <span>Force quit without saving</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs transition"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
