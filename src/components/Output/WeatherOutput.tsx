import React, { useEffect, useState } from 'react';
import { visitorService, VisitorWeather } from '../../services/visitorService';
import { CloudSun, Wind, Droplets, MapPin, Loader2 } from 'lucide-react';

export const WeatherOutput: React.FC = () => {
  const [weather, setWeather] = useState<VisitorWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    visitorService.getVisitorWeather().then((w) => {
      if (mounted) {
        setWeather(w);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading || !weather) {
    return (
      <div className="my-2 text-xs md:text-sm font-mono text-emerald-400 flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Fetching live meteorological forecast for your coordinates...</span>
      </div>
    );
  }

  return (
    <div className="my-3 font-mono text-xs md:text-sm max-w-xl">
      <div className="text-emerald-400 font-bold border-b border-emerald-500/30 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-emerald-400" />
          <span>LOCAL METEOROLOGICAL REPORT</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-300 font-normal">
          <MapPin className="w-3 h-3 text-rose-400" />
          <span>{weather.city}</span>
        </div>
      </div>

      <div className="mt-2 p-3.5 bg-black/40 border border-emerald-500/30 rounded-md flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* ASCII Weather Icon */}
        <pre className="text-yellow-400 font-bold leading-none select-none text-xs md:text-sm shrink-0 whitespace-pre">
          {weather.asciiArt}
        </pre>

        {/* Weather Metrics */}
        <div className="space-y-1.5 flex-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">{weather.tempC}°C</span>
            <span className="text-gray-400 text-sm">/ {weather.tempF}°F</span>
            <span className="text-base">{weather.icon}</span>
          </div>

          <div className="text-emerald-300 font-semibold text-sm">
            {weather.condition} — <span className="text-gray-300 font-normal text-xs">{weather.description}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>Wind: {weather.windSpeed}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Humidity: {weather.humidity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
