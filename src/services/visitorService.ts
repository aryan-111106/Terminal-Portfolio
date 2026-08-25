export interface VisitorHardware {
  os: string;
  browser: string;
  cpuCores: number;
  memory: string;
  gpu: string;
  screenRes: string;
  viewport: string;
  pixelRatio: number;
  colorDepth: number;
  touchSupport: boolean;
  language: string;
  timezone: string;
  networkType: string;
  downlink?: string;
  rtt?: string;
  battery?: string;
}

export interface VisitorLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
}

export interface VisitorWeather {
  tempC: number;
  tempF: number;
  condition: string;
  description: string;
  icon: string;
  asciiArt: string;
  windSpeed: string;
  humidity: string;
  city: string;
  isDay: boolean;
}

class VisitorService {
  private cachedLocation: VisitorLocation | null = null;
  private cachedWeather: VisitorWeather | null = null;
  private locationPromise: Promise<VisitorLocation> | null = null;
  private weatherPromise: Promise<VisitorWeather> | null = null;

  /**
   * Diagnostic client hardware info
   */
  public getHardwareInfo(): VisitorHardware {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    
    // Detect OS
    let os = 'Unknown OS';
    if (ua.includes('Win')) os = 'Windows 11 / 10 (NT 10.0)';
    else if (ua.includes('Mac')) os = ua.includes('iPhone') || ua.includes('iPad') ? 'iOS / iPadOS' : 'macOS (Darwin x86_64/arm64)';
    else if (ua.includes('Android')) os = 'Android Linux';
    else if (ua.includes('Linux')) os = 'GNU/Linux';

    // Detect Browser
    let browser = 'Unknown Browser';
    if (ua.includes('Firefox/')) {
      const match = ua.match(/Firefox\/(\d+(\.\d+)?)/);
      browser = `Mozilla Firefox ${match ? match[1] : ''}`;
    } else if (ua.includes('Edg/')) {
      const match = ua.match(/Edg\/(\d+(\.\d+)?)/);
      browser = `Microsoft Edge ${match ? match[1] : ''}`;
    } else if (ua.includes('Chrome/')) {
      const match = ua.match(/Chrome\/(\d+(\.\d+)?)/);
      browser = `Google Chrome / Chromium ${match ? match[1] : ''}`;
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      const match = ua.match(/Version\/(\d+(\.\d+)?)/);
      browser = `Apple Safari ${match ? match[1] : ''}`;
    }

    // Detect GPU via WebGL
    let gpu = 'Standard WebGL Accelerator';
    if (typeof document !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer) gpu = renderer;
          }
        }
      } catch {
        // Ignore
      }
    }

    const nav = typeof navigator !== 'undefined' ? navigator as unknown as {
      hardwareConcurrency?: number;
      deviceMemory?: number;
      maxTouchPoints?: number;
      connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    } : {};

    const connection = nav.connection;

    return {
      os,
      browser,
      cpuCores: nav.hardwareConcurrency || 8,
      memory: nav.deviceMemory ? `~${nav.deviceMemory} GiB RAM` : '8+ GiB RAM',
      gpu,
      screenRes: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
      viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080',
      pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      colorDepth: typeof window !== 'undefined' ? window.screen.colorDepth : 24,
      touchSupport: typeof navigator !== 'undefined' ? (nav.maxTouchPoints || 0) > 0 || 'ontouchstart' in window : false,
      language: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      networkType: connection?.effectiveType ? connection.effectiveType.toUpperCase() : 'Broadband / WiFi',
      downlink: connection?.downlink ? `${connection.downlink} Mbps` : undefined,
      rtt: connection?.rtt ? `${connection.rtt} ms` : undefined,
    };
  }

  /**
   * Fetch visitor IP & Geolocation
   */
  public async getVisitorLocation(): Promise<VisitorLocation> {
    if (this.cachedLocation) return this.cachedLocation;
    if (this.locationPromise) return this.locationPromise;

    this.locationPromise = (async () => {
      // Try ipwho.is first
      try {
        const res = await fetch('https://ipwho.is/', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            this.cachedLocation = {
              ip: data.ip || '127.0.0.1',
              city: data.city || 'Local Host',
              region: data.region || '',
              country: data.country || 'Earth',
              countryCode: data.country_code || 'UN',
              latitude: data.latitude || 37.7749,
              longitude: data.longitude || -122.4194,
              timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
              isp: data.connection?.isp || 'Internet Service Provider',
            };
            return this.cachedLocation;
          }
        }
      } catch {
        // Failover
      }

      // Try freeipapi.com
      try {
        const res = await fetch('https://freeipapi.com/api/json', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          this.cachedLocation = {
            ip: data.ipAddress || '127.0.0.1',
            city: data.cityName || 'Local Client',
            region: data.regionName || '',
            country: data.countryName || 'Earth',
            countryCode: data.countryCode || 'UN',
            latitude: data.latitude || 37.7749,
            longitude: data.longitude || -122.4194,
            timezone: data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            isp: 'Local ISP / VPN',
          };
          return this.cachedLocation;
        }
      } catch {
        // Fallback to local browser timezone
      }

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const cityFromTz = tz.includes('/') ? tz.split('/')[1].replace(/_/g, ' ') : 'Local City';

      this.cachedLocation = {
        ip: '192.168.1.1 (Client Guest)',
        city: cityFromTz,
        region: 'Local Network',
        country: 'Earth',
        countryCode: 'UN',
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: tz,
        isp: 'Localhost Loopback',
      };
      return this.cachedLocation;
    })();

    return this.locationPromise;
  }

  /**
   * Fetch Live Weather for visitor location
   */
  public async getVisitorWeather(): Promise<VisitorWeather> {
    if (this.cachedWeather) return this.cachedWeather;
    if (this.weatherPromise) return this.weatherPromise;

    this.weatherPromise = (async () => {
      const loc = await this.getVisitorLocation();
      const lat = loc.latitude;
      const lon = loc.longitude;

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`,
          { cache: 'no-store' }
        );

        if (res.ok) {
          const data = await res.json();
          const current = data.current_weather;
          const tempC = Math.round(current.temperature);
          const tempF = Math.round((tempC * 9) / 5 + 32);
          const code = current.weathercode;
          const isDay = current.is_day === 1;

          // Estimate humidity
          let humidity = '55%';
          if (data.hourly?.relativehumidity_2m && data.hourly.relativehumidity_2m.length > 0) {
            humidity = `${data.hourly.relativehumidity_2m[0]}%`;
          }

          const info = this.mapWeatherCode(code, isDay);

          this.cachedWeather = {
            tempC,
            tempF,
            condition: info.condition,
            description: info.description,
            icon: info.icon,
            asciiArt: info.ascii,
            windSpeed: `${Math.round(current.windspeed)} km/h`,
            humidity,
            city: loc.city,
            isDay,
          };
          return this.cachedWeather;
        }
      } catch {
        // Failover
      }

      // Default pleasant weather fallback
      const defaultInfo = this.mapWeatherCode(0, true);
      this.cachedWeather = {
        tempC: 22,
        tempF: 72,
        condition: 'Sunny',
        description: 'Clear Sky & Pleasant Breeze',
        icon: '☀️',
        asciiArt: defaultInfo.ascii,
        windSpeed: '12 km/h NW',
        humidity: '48%',
        city: loc.city,
        isDay: true,
      };
      return this.cachedWeather;
    })();

    return this.weatherPromise;
  }

  private mapWeatherCode(code: number, isDay: boolean): { condition: string; description: string; icon: string; ascii: string } {
    // Open-Meteo WMO Weather codes
    if (code === 0) {
      return {
        condition: isDay ? 'Sunny' : 'Clear Night',
        description: 'Clear Sky',
        icon: isDay ? '☀️' : '🌙',
        ascii: `     \\   /     
      .-.      
   ― (   ) ―   
      \`-'      
     /   \\     `
      };
    }
    if (code === 1 || code === 2 || code === 3) {
      return {
        condition: 'Partly Cloudy',
        description: 'Mainly clear, partly cloudy, and overcast',
        icon: isDay ? '⛅' : '☁️',
        ascii: `   \\  /       
 _ /"".-.     
   \\_(   ).   
   /(___(__)  `
      };
    }
    if (code >= 45 && code <= 48) {
      return {
        condition: 'Foggy',
        description: 'Fog and depositing rime fog',
        icon: '🌫️',
        ascii: ` _ - _ - _ -  
  _ - _ - _   
 _ - _ - _ -  `
      };
    }
    if (code >= 51 && code <= 67) {
      return {
        condition: 'Rainy',
        description: 'Light to moderate rain drizzle',
        icon: '🌧️',
        ascii: `     .-.      
    (   ).    
   (___(__)   
    ' ' ' '   
   ' ' ' '    `
      };
    }
    if (code >= 71 && code <= 77) {
      return {
        condition: 'Snowy',
        description: 'Snow fall and ice grains',
        icon: '❄️',
        ascii: `     .-.      
    (   ).    
   (___(__)   
    *  *  *   
   *  *  *    `
      };
    }
    if (code >= 80 && code <= 82) {
      return {
        condition: 'Heavy Rain Showers',
        description: 'Heavy rain showers',
        icon: '⛈️',
        ascii: `     .-.      
    (   ).    
   (___(__)   
  ‚'/‚'/‚'/   
  ‚'/‚'/‚'/   `
      };
    }
    if (code >= 95) {
      return {
        condition: 'Thunderstorm',
        description: 'Thunderstorm with slight and heavy hail',
        icon: '⚡',
        ascii: `     .-.      
    (   ).    
   (___(__)   
    ⚡/  ⚡/   
    ' '  ' '  `
      };
    }

    return {
      condition: 'Fair',
      description: 'Pleasant atmosphere',
      icon: '🌤️',
      ascii: `     \\   /     
      .-.      
   ― (   ) ―   
      \`-'      `
    };
  }
}

export const visitorService = new VisitorService();
