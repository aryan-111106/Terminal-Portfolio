import React, { useState, useEffect } from 'react';
import { Power, Terminal } from 'lucide-react';
import { soundFX } from '../../services/soundFX';

export type PowerState = 'running' | 'shutting_down' | 'off' | 'booting';

interface PowerOverlayProps {
  powerState: PowerState;
  onPowerOn: () => void;
  onShutdownComplete: () => void;
  onBootComplete: () => void;
}

const SHUTDOWN_LOGS = [
  'Stopping User Manager for UID 1000...',
  'Stopped target Graphical Interface.',
  'Stopped Portfolio Terminal Shell Session.',
  'Unmounted Virtual Filesystem (/home/guest).',
  'Stopping Network Name Resolution & Telemetry...',
  'Stopped Network Connection Manager.',
  'Reached target System Shutdown.',
  'Reached target System Power Off.',
  'Powering off system hardware.'
];

const BOOT_LOGS = [
  'Linux version 6.8.0-portfolio-arch (x86_64)',
  'Command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=term-root rw quiet',
  'Initializing CPU & WebGL Hardware Acceleration...',
  'Loading Virtual In-Memory Filesystem (rootfs on /)...',
  '[  OK  ] Mounted Virtual Unix Filesystem (/home/guest).',
  '[  OK  ] Started Network Configuration & Visitor Geolocation Daemon.',
  '[  OK  ] Initialized Web Audio Procedural Synthesizer.',
  '[  OK  ] Loaded Multi-Theme Color Palettes & CRT Shader Engine.',
  '[  OK  ] Reached target Multi-User System.',
  'Starting ZSH Interactive Shell for user guest...'
];

export const PowerOverlay: React.FC<PowerOverlayProps> = ({
  powerState,
  onPowerOn,
  onShutdownComplete,
  onBootComplete,
}) => {
  const [shutdownStep, setShutdownStep] = useState<number>(0);
  const [bootStep, setBootStep] = useState<number>(0);

  // Shutdown logs animation
  useEffect(() => {
    if (powerState === 'shutting_down') {
      setShutdownStep(0);
      soundFX.playError();
      const interval = setInterval(() => {
        setShutdownStep((prev) => {
          if (prev >= SHUTDOWN_LOGS.length - 1) {
            clearInterval(interval);
            setTimeout(onShutdownComplete, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 180);
      return () => clearInterval(interval);
    }
  }, [powerState, onShutdownComplete]);

  // Boot logs animation
  useEffect(() => {
    if (powerState === 'booting') {
      setBootStep(0);
      soundFX.playChime();
      const interval = setInterval(() => {
        setBootStep((prev) => {
          if (prev >= BOOT_LOGS.length - 1) {
            clearInterval(interval);
            setTimeout(onBootComplete, 400);
            return prev;
          }
          return prev + 1;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [powerState, onBootComplete]);

  if (powerState === 'running') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 font-mono select-none">
      {/* SHUTTING DOWN SCREEN */}
      {powerState === 'shutting_down' && (
        <div className="w-full max-w-2xl text-xs sm:text-sm text-gray-300 space-y-1">
          <div className="text-red-400 font-bold mb-3 border-b border-red-500/40 pb-1 flex items-center gap-2">
            <Power className="w-4 h-4 text-red-400 animate-pulse" />
            <span>[ SYSTEM SHUTDOWN IN PROGRESS ]</span>
          </div>

          {SHUTDOWN_LOGS.slice(0, shutdownStep + 1).map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">[  OK  ]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* POWERED OFF STATE */}
      {powerState === 'off' && (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative">
            <button
              onClick={onPowerOn}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-emerald-500/60 hover:border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition cursor-pointer group"
              title="Power On Terminal"
            >
              <Power className="w-10 h-10 sm:w-12 sm:h-12 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] transition" />
            </button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-200">Terminal Powered Off</h2>
            <p className="text-xs text-gray-400">Click the power button above to reboot the system.</p>
          </div>

          <div className="text-[11px] text-emerald-500/60 flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Portfolio Linux 6.8.0</span>
          </div>
        </div>
      )}

      {/* BOOTING SCREEN */}
      {powerState === 'booting' && (
        <div className="w-full max-w-2xl text-xs sm:text-sm text-gray-300 space-y-1">
          <div className="text-emerald-400 font-bold mb-3 border-b border-emerald-500/40 pb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>[ INITIALIZING LINUX KERNEL BOOT ]</span>
            </div>
            <button
              onClick={onBootComplete}
              className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
            >
              Skip (ESC)
            </button>
          </div>

          {BOOT_LOGS.slice(0, bootStep + 1).map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-400 font-bold shrink-0">{`[ ${(idx * 0.08 + 0.01).toFixed(4)} ]`}</span>
              <span className="text-gray-200">{log}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
