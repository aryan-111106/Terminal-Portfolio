import React, { useEffect, useState } from 'react';
import { visitorService, VisitorLocation, VisitorHardware } from '../../services/visitorService';
import { UserCheck, MapPin, Globe, Monitor, Clock, ShieldCheck, Loader2 } from 'lucide-react';

export const WhoamiOutput: React.FC = () => {
  const [location, setLocation] = useState<VisitorLocation | null>(null);
  const [hardware, setHardware] = useState<VisitorHardware | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const hw = visitorService.getHardwareInfo();
      const loc = await visitorService.getVisitorLocation();
      if (mounted) {
        setHardware(hw);
        setLocation(loc);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading || !hardware) {
    return (
      <div className="my-2 text-xs md:text-sm font-mono text-emerald-400 flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Resolving visitor identity & network telemetry...</span>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    timeZone: location?.timezone || hardware.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="my-3 space-y-3 font-mono text-xs md:text-sm max-w-2xl">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 flex items-center gap-2">
        <UserCheck className="w-4 h-4 text-emerald-400" />
        <span>VISITOR IDENTITY PROFILE (YOU)</span>
      </div>

      <div className="p-3.5 bg-black/40 border border-emerald-500/30 rounded-md space-y-3">
        {/* Intro / Current User */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-800 gap-1.5 text-xs">
          <div>
            <span className="text-gray-400">Current Username: </span>
            <strong className="text-emerald-400 font-mono">visitor@aryan-linux</strong>
          </div>
          <div className="text-gray-400">
            Auth Status: <span className="text-emerald-300 font-semibold">Active Session</span>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
          <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">PUBLIC IP / HOST</span>
              <span className="font-semibold text-emerald-300">{location?.ip || '127.0.0.1'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">LOCATION</span>
              <span className="font-semibold text-white">
                {location?.city}, {location?.region ? `${location.region}, ` : ''}{location?.country}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded">
            <Monitor className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">OPERATING SYSTEM</span>
              <span className="font-semibold text-white">{hardware.os}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">BROWSER CLIENT</span>
              <span className="font-semibold text-white">{hardware.browser}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">LOCAL VISITOR TIME</span>
              <span className="font-semibold text-white">{currentTime} ({location?.timezone})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded">
            <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px]">SCREEN RESOLUTION</span>
              <span className="font-semibold text-white">{hardware.screenRes} ({hardware.pixelRatio}x DPR)</span>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-gray-400">
          💡 Run <kbd className="text-emerald-300">sysinfo</kbd> for deep hardware & GPU diagnostics or <kbd className="text-emerald-300">weather</kbd> for your local forecast.
        </div>
      </div>
    </div>
  );
};
