import React, { useState, useEffect } from 'react';
import { visitorService, VisitorHardware, VisitorLocation } from '../../services/visitorService';
import { Cpu, HardDrive, Tv, Wifi, Battery, Layers, CheckCircle2 } from 'lucide-react';

export const SysinfoOutput: React.FC = () => {
  const [hardware, setHardware] = useState<VisitorHardware | null>(null);
  const [location, setLocation] = useState<VisitorLocation | null>(null);

  useEffect(() => {
    setHardware(visitorService.getHardwareInfo());
    visitorService.getVisitorLocation().then(loc => setLocation(loc));
  }, []);

  if (!hardware) return null;

  return (
    <div className="my-3 space-y-3 font-mono text-xs md:text-sm max-w-2xl">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-emerald-400" />
        <span>VISITOR CLIENT SYSTEM & HARDWARE INFO</span>
      </div>

      <div className="p-3.5 bg-black/40 border border-emerald-500/30 rounded-md space-y-3">
        {/* Specs Table */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start justify-between border-b border-slate-800 pb-1.5">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>CPU Concurrency:</span>
            </span>
            <span className="font-semibold text-white">{hardware.cpuCores} Logical Threads / Cores</span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-800 pb-1.5">
            <span className="text-gray-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>System Memory (RAM):</span>
            </span>
            <span className="font-semibold text-white">{hardware.memory}</span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-800 pb-1.5">
            <span className="text-gray-400 flex items-center gap-1.5 shrink-0">
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>Graphics / WebGL GPU:</span>
            </span>
            <span className="font-semibold text-emerald-300 text-right truncate max-w-[280px]" title={hardware.gpu}>
              {hardware.gpu}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-800 pb-1.5">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Display & Viewport:</span>
            </span>
            <span className="font-semibold text-white">
              {hardware.screenRes} ({hardware.viewport} inner @ {hardware.pixelRatio}x DPR)
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-800 pb-1.5">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>Network Connection:</span>
            </span>
            <span className="font-semibold text-white">
              {hardware.networkType} {hardware.downlink ? `(${hardware.downlink}, RTT: ${hardware.rtt})` : ''}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-800 pb-1.5">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>Touch Support:</span>
            </span>
            <span className="font-semibold text-white">{hardware.touchSupport ? 'Enabled (Touch Device)' : 'Disabled (Keyboard & Mouse)'}</span>
          </div>

          <div className="flex items-start justify-between pb-1">
            <span className="text-gray-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language & Locale:</span>
            </span>
            <span className="font-semibold text-white">{hardware.language} ({location?.timezone || hardware.timezone})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
