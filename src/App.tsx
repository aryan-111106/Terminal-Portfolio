import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useTerminal } from './hooks/useTerminal';
import { TerminalHeader } from './components/Terminal/TerminalHeader';
import { QuickActions } from './components/Terminal/QuickActions';
import { TerminalBody } from './components/Terminal/TerminalBody';
import { StatusBar } from './components/Terminal/StatusBar';
import { CRTOverlay } from './components/UI/CRTOverlay';
import { PowerOverlay, PowerState } from './components/Terminal/PowerOverlay';
import { MatrixRain } from './components/EasterEggs/MatrixRain';
import { SnakeGame } from './components/EasterEggs/SnakeGame';
import { SteamLocomotive } from './components/EasterEggs/SteamLocomotive';
import { VimEditor } from './components/EasterEggs/VimEditor';
import { ThemeBackground } from './components/UI/ThemeBackground';
import { Terminal as TerminalIcon } from 'lucide-react';

export function App() {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [powerState, setPowerState] = useState<PowerState>('running');

  const {
    theme,
    themeId,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    crtEnabled,
    setCrtEnabled,
    allThemes,
  } = useTheme();

  const {
    cwd,
    input,
    setInput,
    history,
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
    user,
    hostname,
  } = useTerminal(
    themeId,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    crtEnabled,
    setCrtEnabled,
    () => setPowerState('shutting_down')
  );

  return (
    <main 
      className="h-screen w-screen bg-black flex flex-col items-center justify-center p-0 md:p-4 overflow-hidden relative select-none"
      style={{
        boxShadow: theme.glow ? `inset 0 0 120px rgba(0,0,0,0.9)` : undefined
      }}
    >
      {/* Theme-Specific Dynamic Visual Backdrop */}
      <ThemeBackground themeId={themeId} />

      {/* CRT Scanline & Phosphor Overlay */}
      <CRTOverlay enabled={crtEnabled} />

      {/* Shutdown / Off / Booting Power Overlay */}
      <PowerOverlay
        powerState={powerState}
        onPowerOn={() => setPowerState('booting')}
        onShutdownComplete={() => setPowerState('off')}
        onBootComplete={() => {
          setPowerState('running');
          resetTerminal();
          setTimeout(focusInput, 100);
        }}
      />

      {/* Minimized Dock Pill */}
      {isMinimized && powerState === 'running' && (
        <button
          onClick={() => {
            setIsMinimized(false);
            setTimeout(focusInput, 50);
          }}
          className="fixed bottom-6 z-40 px-5 py-2.5 bg-slate-900/90 border-2 border-emerald-500/70 hover:border-emerald-400 text-emerald-400 rounded-full shadow-2xl backdrop-blur flex items-center gap-2.5 font-mono text-xs md:text-sm hover:scale-105 active:scale-95 transition cursor-pointer group animate-bounce"
        >
          <TerminalIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold">{user}@{hostname}</span>
          <span className="text-gray-400 text-xs">(Click to Restore Window)</span>
        </button>
      )}

      {/* Main Terminal Window Frame */}
      <div 
        className={`w-full h-full md:h-[95vh] md:max-w-6xl md:rounded-xl flex flex-col overflow-hidden border shadow-2xl transition-all duration-300 relative z-10 ${isMinimized || powerState !== 'running' ? 'hidden' : 'flex'}`}
        style={{
          backgroundColor: theme.colors.bg,
          borderColor: theme.colors.border,
          boxShadow: theme.glow ? `${theme.glow}, 0 25px 50px -12px rgba(0, 0, 0, 0.85)` : '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Title Bar */}
        <TerminalHeader
          theme={theme}
          allThemes={allThemes}
          themeId={themeId}
          setTheme={setTheme}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          crtEnabled={crtEnabled}
          setCrtEnabled={setCrtEnabled}
          onClear={clearHistory}
          onHelp={() => executeCommand('help')}
          onMinimize={() => setIsMinimized(true)}
          onShutdown={() => setPowerState('shutting_down')}
          cwd={cwd}
          user={user}
          hostname={hostname}
        />

        {/* Quick Action Navigation Bar */}
        <QuickActions 
          onExecute={executeCommand}
          theme={theme}
        />

        {/* Main Terminal Stream (History + Live Prompt) */}
        <TerminalBody
          history={history}
          user={user}
          hostname={hostname}
          cwd={cwd}
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          bottomRef={bottomRef}
          onKeyDown={handleKeyDown}
          onFocus={focusInput}
          suggestions={suggestions}
          onSelectSuggestion={(s) => {
            setInput(s + ' ');
            focusInput();
          }}
          onExecute={executeCommand}
          theme={theme}
        />

        {/* Bottom Status Bar */}
        <StatusBar
          theme={theme}
          cwd={cwd}
          commandCount={history.length}
          soundEnabled={soundEnabled}
          crtEnabled={crtEnabled}
        />
      </div>

      {/* Interactive Easter Egg Overlays */}
      {activeEasterEgg === 'matrix' && (
        <MatrixRain 
          onClose={() => setActiveEasterEgg(null)} 
          theme={theme} 
        />
      )}

      {activeEasterEgg === 'snake' && (
        <SnakeGame 
          onClose={() => setActiveEasterEgg(null)} 
          accentColor={theme.colors.accent}
        />
      )}

      {activeEasterEgg === 'sl' && (
        <SteamLocomotive 
          onComplete={() => setActiveEasterEgg(null)} 
        />
      )}

      {activeEasterEgg?.startsWith('vim') && (
        <VimEditor 
          filePath={activeEasterEgg.includes(':') ? activeEasterEgg.substring(4) : undefined}
          cwd={cwd}
          theme={theme}
          onClose={(msg) => {
            setActiveEasterEgg(null);
            if (msg) {
              executeCommand(`echo "${msg}"`);
            }
            setTimeout(focusInput, 50);
          }}
        />
      )}
    </main>
  );
}

export default App;
