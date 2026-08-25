import React, { useState, useEffect } from 'react';
import { visitorService, VisitorHardware, VisitorLocation } from '../../services/visitorService';
import { Loader2 } from 'lucide-react';

const sessionStartTime = Date.now();

export const SysinfoOutput: React.FC = () => {
  const [hardware, setHardware] = useState<VisitorHardware | null>(null);
  const [location, setLocation] = useState<VisitorLocation | null>(null);
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

  if (loading || !hardware || !location) {
    return (
      <div className="my-2 text-xs md:text-sm font-mono text-emerald-400 flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Querying system hardware and IP telemetry...</span>
      </div>
    );
  }

  // Calculate session uptime
  const uptimeSeconds = Math.max(1, Math.floor((Date.now() - sessionStartTime) / 1000));
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

  const nav = typeof navigator !== 'undefined' ? navigator as unknown as { platform?: string; userAgentData?: { architecture?: string } } : {};
  const platform = nav.platform || hardware.os || 'Win32';
  const cpuArch = nav.userAgentData?.architecture || 'x86_64';
  const memoryStr = hardware.memory.replace('~', '').replace(' RAM', '');

  return (
    <div className="my-2 font-mono text-xs md:text-sm select-text space-y-4">
      {/* SYSTEM INFORMATION SECTION */}
      <div>
        <div className="text-emerald-400 font-bold uppercase tracking-wider">SYSTEM INFORMATION</div>
        <div className="text-emerald-500/60 select-none">------------------</div>
        <div className="space-y-0.5 mt-1 text-gray-200">
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Browser</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{hardware.browser}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Platform</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{platform}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">CPU Cores</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{hardware.cpuCores}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Memory</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{memoryStr}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">CPU Arch</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{cpuArch}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Network</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{hardware.networkType} (Online)</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Language</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{hardware.language}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Timezone</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{hardware.timezone}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Screen</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{hardware.screenRes}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Uptime</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{uptimeStr}</span>
          </div>
        </div>
      </div>

      {/* IP INFORMATION SECTION */}
      <div>
        <div className="text-emerald-400 font-bold uppercase tracking-wider">IP INFORMATION</div>
        <div className="text-emerald-500/60 select-none">--------------</div>
        <div className="space-y-0.5 mt-1 text-gray-200">
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">IP Address</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.ip}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">City</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.city}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Region</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.region || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Country</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.country}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Postal Code</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.postalCode || '700059'}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Latitude/Long.</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Currency</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.currency || 'INR'}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Time Zone (IP)</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.timezone}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">Org</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.org || location.isp}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">ASN</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.asn || 'AS55836'}</span>
          </div>
          <div className="flex">
            <span className="w-36 text-gray-400 shrink-0">VPN/Proxy</span>
            <span className="text-gray-400 mr-2">:</span>
            <span className="text-white font-medium">{location.vpn || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
