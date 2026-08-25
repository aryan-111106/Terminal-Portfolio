import { useState, useRef, useEffect, useCallback } from 'react';
import { CommandHistoryItem } from '../types/terminal';
import { commandRegistry } from '../services/commandRegistry';
import { virtualFS } from '../services/fileSystem';
import { soundFX } from '../services/soundFX';
import { portfolioConfig } from '../config/portfolio.config';

export function useTerminal(
  themeId: string,
  setTheme: (theme: string) => void,
  soundEnabled: boolean,
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void,
  crtEnabled: boolean,
  setCrtEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void,
  onShutdown?: () => void
) {
  const [cwd, setCwd] = useState<string>(virtualFS.homePath);
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [commandList, setCommandList] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [activeEasterEgg, setActiveEasterEgg] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize with initial banner
  useEffect(() => {
    const welcomeItem: CommandHistoryItem = {
      id: 'init-welcome',
      command: 'welcome',
      cwd: virtualFS.homePath,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: '',
      type: 'welcome'
    };
    setHistory([welcomeItem]);
  }, []);

  const resetTerminal = useCallback(() => {
    const welcomeItem: CommandHistoryItem = {
      id: `init-welcome-${Date.now()}`,
      command: 'welcome',
      cwd: virtualFS.homePath,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: '',
      type: 'welcome'
    };
    setHistory([welcomeItem]);
    setInput('');
    setSuggestions([]);
    setHistoryPointer(-1);
    setCwd(virtualFS.homePath);
  }, []);

  // Compute suggestions live as input changes
  useEffect(() => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      const allCmds = commandRegistry.getAllCommands();
      const matches = allCmds
        .filter(c => c.name.startsWith(parts[0]) || c.aliases?.some(a => a.startsWith(parts[0])))
        .map(c => c.name);
      setSuggestions(Array.from(new Set(matches)));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  // Auto-scroll on new output
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, suggestions]);

  // Keep input focused
  const focusInput = useCallback(() => {
    if (inputRef.current && !activeEasterEgg) {
      inputRef.current.focus();
    }
  }, [activeEasterEgg]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const executeCommand = useCallback(async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      // Empty enter
      soundFX.playEnterKey();
      const emptyItem: CommandHistoryItem = {
        id: `cmd-${Date.now()}-${Math.random()}`,
        command: '',
        cwd,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        output: '',
        type: 'text'
      };
      setHistory(prev => [...prev, emptyItem]);
      setInput('');
      setSuggestions([]);
      return;
    }

    soundFX.playEnterKey();

    const updatedCommandList = [...commandList, trimmed];
    setCommandList(updatedCommandList);
    setHistoryPointer(-1);

    const ctx = {
      cwd,
      setCwd,
      clearHistory,
      historyList: updatedCommandList,
      theme: themeId,
      setTheme,
      soundEnabled,
      setSoundEnabled,
      crtEnabled,
      setCrtEnabled,
      activeEasterEgg,
      setActiveEasterEgg,
      triggerShutdown: onShutdown,
    };

    const result = await commandRegistry.execute(trimmed, ctx);

    setInput('');
    setSuggestions([]);

    if (result.type === 'clear') {
      return;
    }

    const historyItem: CommandHistoryItem = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      command: trimmed,
      cwd,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      output: result.output,
      type: result.type,
      rawArgs: result.rawArgs,
    };

    setHistory(prev => [...prev, historyItem]);
  }, [cwd, commandList, themeId, setTheme, soundEnabled, setSoundEnabled, crtEnabled, setCrtEnabled, activeEasterEgg, clearHistory, onShutdown]);

  // Tab autocompletion logic
  const handleTabCompletion = useCallback(() => {
    soundFX.playBeep(600, 0.04);
    if (!input.trim()) {
      const allCmds = commandRegistry.getAllCommands().map(c => c.name);
      setSuggestions(allCmds);
      return;
    }

    const parts = input.split(/\s+/);
    if (parts.length === 1) {
      // Completing command name
      const prefix = parts[0].toLowerCase();
      const allCmds = commandRegistry.getAllCommands().map(c => c.name);
      const matches = allCmds.filter(cmd => cmd.startsWith(prefix) || cmdRegistryAliases(cmd, prefix));

      if (matches.length === 1) {
        setInput(matches[0] + ' ');
        setSuggestions([]);
      } else if (matches.length > 1) {
        // Find longest common prefix
        let common = prefix;
        let charIndex = prefix.length;
        while (true) {
          const nextChar = matches[0][charIndex];
          if (!nextChar || !matches.every(m => m[charIndex] === nextChar)) break;
          common += nextChar;
          charIndex++;
        }
        setInput(common);
        setSuggestions(matches);
      }
    } else {
      // Completing file or path argument
      const completions = virtualFS.getCompletions(cwd, input);
      if (completions.length === 1) {
        parts[parts.length - 1] = completions[0];
        setInput(parts.join(' '));
        setSuggestions([]);
      } else if (completions.length > 1) {
        setSuggestions(completions);
      }
    }
  }, [input, cwd]);

  // Helper for alias completion check
  function cmdRegistryAliases(cmdName: string, prefix: string): boolean {
    const cmd = commandRegistry.getCommand(cmdName);
    return !!cmd?.aliases?.some(a => a.startsWith(prefix));
  }

  // Keyboard navigation & hotkeys
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Keystroke sound
    if (e.key !== 'Tab' && e.key !== 'Enter' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      soundFX.playKeyClick();
    }

    // Ctrl+L (clear screen)
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      clearHistory();
      return;
    }

    // Ctrl+C (cancel input)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      const cancelItem: CommandHistoryItem = {
        id: `cmd-${Date.now()}`,
        command: input + '^C',
        cwd,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        output: '',
        type: 'text'
      };
      setHistory(prev => [...prev, cancelItem]);
      setInput('');
      setSuggestions([]);
      return;
    }

    // Tab completion
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
      return;
    }

    // Enter execution
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      return;
    }

    // History UP arrow
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length === 0) return;
      soundFX.playBeep(450, 0.02);

      const nextPointer = historyPointer === -1 ? commandList.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextPointer);
      setInput(commandList[nextPointer] || '');
      return;
    }

    // History DOWN arrow
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      soundFX.playBeep(500, 0.02);

      const nextPointer = historyPointer + 1;
      if (nextPointer >= commandList.length) {
        setHistoryPointer(-1);
        setInput('');
      } else {
        setHistoryPointer(nextPointer);
        setInput(commandList[nextPointer] || '');
      }
      return;
    }
  }, [input, cwd, commandList, historyPointer, handleTabCompletion, executeCommand, clearHistory]);

  return {
    cwd,
    setCwd,
    input,
    setInput,
    history,
    commandList,
    suggestions,
    inputRef,
    bottomRef,
    activeEasterEgg,
    setActiveEasterEgg,
    focusInput,
    handleKeyDown,
    executeCommand,
    clearHistory,
    resetTerminal,
    user: portfolioConfig.handle,
    hostname: portfolioConfig.hostname,
  };
}
