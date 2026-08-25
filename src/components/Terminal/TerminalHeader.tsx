import React, { useEffect, useState } from 'react';
import { TerminalTheme } from '../../config/themes';
import { Volume2, VolumeX, Tv, Monitor, Palette, HelpCircle, Power } from 'lucide-react';
import { visitorService, VisitorWeather } from '../../services/visitorService';

interface TerminalHeaderProps {
  theme: TerminalTheme;
  allThemes: Record<string, TerminalTheme>;
  themeId: string;
  setTheme: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  onClear: () => void;
  onHelp: () => void;
  onMinimize?: () => void;
  onShutdown?: () => void;
  cwd: string;
  user: string;
  hostname: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  theme,
  allThemes,
  themeId,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  crtEnabled,
  setCrtEnabled,
  onHelp,
  onMinimize,
  onShutdown,
  cwd,
  user,
  hostname,
}) => {
  const displayCwd = cwd.replace('/home/guest', '~');
  const [weather, setWeather] = useState<VisitorWeather | null>(null);

  useEffect(() => {
    visitorService.getVisitorWeather().then(w => setWeather(w));
  }, []);

  return (
    <div 
      className="flex items-center justify-between px-3 md:px-4 py-2 border-b select-none transition-colors duration-200 gap-2"
      style={{
        backgroundColor: theme.headerBg,
        borderColor: theme.colors.border,
      }}
    >
      {/* Left: Window Controls (Traffic Lights) */}
      <div className="flex items-center space-x-2 shrink-0">
        <button 
          onClick={onShutdown}
          title="Shutdown / Power Off (Red)"
          className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition cursor-pointer border border-[#e0443e] flex items-center justify-center group"
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold leading-none">×</span>
        </button>
        <button 
          onClick={onMinimize}
          title="Minimize Window (Yellow)"
          className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 transition cursor-pointer border border-[#dea123] flex items-center justify-center group"
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold leading-none">-</span>
        </button>
        <button 
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          title="Toggle Fullscreen (Green)"
          className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 transition cursor-pointer border border-[#1aab29] flex items-center justify-center group"
        >
          <span className="opacity-0 group-hover:opacity-100 text-[7px] text-black font-bold leading-none">+</span>
        </button>

        <span className="hidden md:inline-block pl-2 text-xs font-mono opacity-80 truncate max-w-[200px]" style={{ color: theme.colors.textMuted }}>
          bash — {user}@{hostname}:{displayCwd}
        </span>
      </div>

      {/* Center: Live Visitor Weather Badge */}
      {weather && (
        <div 
          className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 border text-[11px] font-mono text-gray-300 truncate"
          style={{ borderColor: theme.colors.border }}
          title={`Weather in ${weather.city}: ${weather.condition}, ${weather.tempC}°C`}
        >
          <span>{weather.icon}</span>
          <span className="font-semibold text-white">{weather.tempC}°C</span>
          <span className="text-gray-400 hidden lg:inline">• {weather.city}</span>
        </div>
      )}

      {/* Right: Quick Settings (Theme, Sound, CRT, Help, Power Off) */}
      <div className="flex items-center space-x-1.5 md:space-x-2 text-xs font-mono shrink-0">
        {/* Theme Picker Dropdown */}
        <div className="relative flex items-center">
          <Palette className="w-3.5 h-3.5 mr-1 hidden lg:inline" style={{ color: theme.colors.accent }} />
          <select
            value={themeId}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-black/40 border text-[11px] md:text-xs rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-emerald-400/60 transition"
            style={{
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }}
            title="Switch Theme"
          >
            {Object.keys(allThemes).map((key) => (
              <option key={key} value={key} className="bg-slate-900 text-white">
                {allThemes[key].name}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className="p-1 rounded hover:bg-white/10 transition border border-transparent hover:border-slate-700 cursor-pointer"
          style={{ color: soundEnabled ? theme.colors.accent : theme.colors.textMuted }}
          title={soundEnabled ? "Mute typing sound FX" : "Enable typing sound FX"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={() => setCrtEnabled(prev => !prev)}
          className="p-1 rounded hover:bg-white/10 transition border border-transparent hover:border-slate-700 cursor-pointer"
          style={{ color: crtEnabled ? theme.colors.accent : theme.colors.textMuted }}
          title={crtEnabled ? "Disable CRT Scanline Filter" : "Enable CRT Scanline Filter"}
        >
          {crtEnabled ? <Tv className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
        </button>

        {/* Help Quick Button */}
        <button
          onClick={onHelp}
          className="p-1 rounded hover:bg-white/10 transition border border-transparent hover:border-slate-700 cursor-pointer"
          style={{ color: theme.colors.info }}
          title="Show Commands Help"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Power Off Button */}
        <button
          onClick={onShutdown}
          className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition border border-transparent hover:border-red-500/30 cursor-pointer"
          title="Shutdown Terminal (Power Off)"
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
