import React, { useState, useEffect, useRef } from 'react';
import { TerminalTheme } from '../../config/themes';
import { virtualFS } from '../../services/fileSystem';
import { soundFX } from '../../services/soundFX';
import { Save, X, HelpCircle } from 'lucide-react';

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
      virtualFS.createFile(resolvedPath, content);
      setIsModified(false);
      setStatusMessage(`"${filename}" [OK] ${content.split('\n').length}L, ${content.length}B written`);
      setMode('NORMAL');
      soundFX.playChime();
    } else if (cmd === ':q') {
      if (isModified) {
        setStatusMessage('E37: No write since last change (add ! to override)');
        soundFX.playError();
        setMode('NORMAL');
      } else {
        soundFX.playBeep(400, 0.05);
        onClose();
      }
    } else if (cmd === ':q!' || cmd === ':qa!') {
      soundFX.playBeep(400, 0.05);
      onClose();
    } else if (cmd === ':wq' || cmd === ':x') {
      virtualFS.createFile(resolvedPath, content);
      soundFX.playChime();
      onClose(`"${filename}" ${content.split('\n').length}L, ${content.length}B written`);
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
  const totalLines = Math.max(lines.length, 22);

  return (
    <div 
      className="flex-1 flex flex-col w-full h-full overflow-hidden font-mono text-xs md:text-sm select-text relative"
      style={{
        backgroundColor: theme.colors.bg,
        color: theme.colors.text,
      }}
    >
      {/* Authentic Minimal Top Info Banner */}
      <div 
        className="flex items-center justify-between px-3 py-1 text-[11px] border-b select-none shrink-0"
        style={{
          backgroundColor: theme.headerBg || '#111827',
          borderColor: theme.colors.border,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400">VIM</span>
          <span className="text-gray-400">9.1</span>
          <span className="text-gray-200 bg-black/40 px-1.5 py-0.2 rounded border border-slate-700">
            {filename} {isModified ? '[+]' : ''}
          </span>
        </div>

        {/* Quick Clickable Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              virtualFS.createFile(resolvedPath, content);
              setIsModified(false);
              setStatusMessage(`"${filename}" saved successfully`);
              soundFX.playChime();
            }}
            className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/70 text-emerald-300 rounded flex items-center gap-1 text-[10px] transition cursor-pointer"
            title="Save (:w)"
          >
            <Save className="w-2.5 h-2.5" />
            <span>:w Save</span>
          </button>

          <button
            onClick={() => {
              setMode((prev: VimMode) => prev === 'INSERT' ? 'NORMAL' : 'INSERT');
              soundFX.playKeyClick();
            }}
            className={`px-2 py-0.5 border rounded flex items-center gap-1 text-[10px] transition cursor-pointer ${
              mode === 'INSERT' 
                ? 'bg-emerald-600 text-black font-bold border-emerald-400' 
                : 'bg-slate-800 text-gray-200 border-slate-600 hover:bg-slate-700'
            }`}
          >
            <span>{mode === 'INSERT' ? 'Esc (Normal)' : 'i (Insert)'}</span>
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-gray-300 rounded flex items-center gap-1 text-[10px] transition cursor-pointer"
            title="Cheatsheet"
          >
            <HelpCircle className="w-2.5 h-2.5" />
            <span>:help</span>
          </button>

          <button
            onClick={() => {
              if (isModified) {
                if (window.confirm('Discard unsaved changes and exit?')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            className="px-2 py-0.5 bg-red-950/80 hover:bg-red-900 border border-red-600/70 text-red-300 rounded flex items-center gap-1 text-[10px] transition cursor-pointer"
            title="Quit (:q)"
          >
            <X className="w-2.5 h-2.5" />
            <span>:q Quit</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers Column with Tildes */}
        <div 
          className="w-9 sm:w-11 py-2 select-none text-right pr-2 font-mono text-xs shrink-0 leading-5 border-r"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            color: '#4b5563'
          }}
        >
          {Array.from({ length: totalLines }).map((_, i) => (
            <div 
              key={i} 
              className={i + 1 === cursorPos.line ? 'text-yellow-400 font-bold' : i >= lines.length ? 'text-blue-500/70' : ''}
            >
              {i < lines.length ? i + 1 : '~'}
            </div>
          ))}
        </div>

        {/* Text Area Buffer */}
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
          placeholder="Type 'i' to insert text, or ':' for commands (:wq to save and exit)..."
          autoFocus
          spellCheck={false}
        />
      </div>

      {/* Classic Reverse-Video Status Line */}
      <div 
        className="px-3 py-0.5 font-mono text-xs shrink-0 flex items-center justify-between select-none"
        style={{
          backgroundColor: mode === 'INSERT' ? '#065f46' : mode === 'COMMAND' ? '#854d0e' : '#1e293b',
          color: mode === 'INSERT' ? '#d1fae5' : mode === 'COMMAND' ? '#fef08a' : '#e2e8f0',
        }}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden font-bold">
          {mode === 'INSERT' && <span>-- INSERT --</span>}
          {mode === 'NORMAL' && <span>[NORMAL]</span>}
          {mode === 'COMMAND' && <span>[COMMAND]</span>}

          <span className="font-normal truncate">
            "{filename}" {isModified ? '[+]' : ''}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-normal shrink-0">
          <span>{lines.length} lines --{Math.round((cursorPos.line / Math.max(lines.length, 1)) * 100)}%--</span>
          <span className="font-bold">{cursorPos.line}:{cursorPos.col}</span>
        </div>
      </div>

      {/* Bottom Command Input Bar */}
      <div className="px-3 py-1 bg-black border-t border-slate-800 font-mono text-xs shrink-0 flex items-center justify-between text-gray-300">
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
          <div className="flex items-center justify-between w-full text-[11px] text-gray-400">
            <span className="truncate">{statusMessage || "Tip: Press 'i' to edit • ':' for commands • ':wq' to save & exit"}</span>
            <span className="hidden sm:inline text-gray-500 shrink-0">Vim in React Terminal</span>
          </div>
        )}
      </div>

      {/* Cheatsheet Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-4 bg-slate-900 border border-emerald-500/50 rounded-lg shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
              <h3 className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Vim In-Terminal Commands</span>
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-300 font-mono">
              <div className="p-1.5 bg-black/50 rounded border border-slate-800">
                <span className="text-yellow-300 font-bold block">i / Insert</span>
                <span className="text-gray-400">Enter INSERT mode</span>
              </div>
              <div className="p-1.5 bg-black/50 rounded border border-slate-800">
                <span className="text-yellow-300 font-bold block">Escape</span>
                <span className="text-gray-400">Return to NORMAL mode</span>
              </div>
              <div className="p-1.5 bg-black/50 rounded border border-slate-800">
                <span className="text-yellow-300 font-bold block">:w</span>
                <span className="text-gray-400">Save to filesystem</span>
              </div>
              <div className="p-1.5 bg-black/50 rounded border border-slate-800">
                <span className="text-yellow-300 font-bold block">:wq or :x</span>
                <span className="text-gray-400">Save and exit</span>
              </div>
              <div className="p-1.5 bg-black/50 rounded border border-slate-800">
                <span className="text-yellow-300 font-bold block">:q</span>
                <span className="text-gray-400">Quit buffer</span>
              </div>
              <div className="p-1.5 bg-black/50 rounded border border-slate-800">
                <span className="text-yellow-300 font-bold block">:q!</span>
                <span className="text-gray-400">Force quit (discard)</span>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs transition cursor-pointer"
              >
                Back to Buffer (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
