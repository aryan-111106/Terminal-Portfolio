// Browser and DOM mock environment for headless testing

export function setupTestEnvironment() {
  if (typeof (globalThis as Record<string, unknown>).window === 'undefined') {
    const localStorageStore = new Map<string, string>();
    const mockLocalStorage = {
      getItem: (key: string) => (localStorageStore.has(key) ? localStorageStore.get(key)! : null),
      setItem: (key: string, val: string) => { localStorageStore.set(key, String(val)); },
      removeItem: (key: string) => { localStorageStore.delete(key); },
      clear: () => { localStorageStore.clear(); },
      get length() { return localStorageStore.size; },
      key: (i: number) => Array.from(localStorageStore.keys())[i] || null,
    };

    const mockStyle: Record<string, unknown> = {
      properties: {} as Record<string, string>,
      setProperty(k: string, v: string) { (this.properties as Record<string, string>)[k] = v; },
      getPropertyValue(k: string) { return (this.properties as Record<string, string>)[k] || ''; }
    };

    const mockDocument = {
      documentElement: {
        style: mockStyle,
        requestFullscreen: async () => {},
      },
      createElement: (tag: string) => ({
        tagName: tag.toUpperCase(),
        getContext: () => null,
        style: {},
        scrollIntoView: () => {},
        focus: () => {},
      }),
      fullscreenElement: null,
      exitFullscreen: async () => {},
    };

    const mockNavigator = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      hardwareConcurrency: 16,
      deviceMemory: 16,
      language: 'en-US',
      maxTouchPoints: 0,
      clipboard: {
        writeText: async (_text: string) => {},
      },
      connection: {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
      }
    };

    const mockWindow = {
      localStorage: mockLocalStorage,
      document: mockDocument,
      navigator: mockNavigator,
      screen: { width: 1920, height: 1080, colorDepth: 24 },
      innerWidth: 1920,
      innerHeight: 1080,
      devicePixelRatio: 1,
      open: (url: string, target?: string) => ({ url, target }),
      AudioContext: class {
        currentTime = 0;
        state = 'running';
        createOscillator() {
          return {
            type: 'sine',
            frequency: { value: 440, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} },
            connect() {},
            start() {},
            stop() {},
          };
        }
        createGain() {
          return {
            gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
            connect() {},
          };
        }
        createBiquadFilter() {
          return {
            type: 'highpass',
            frequency: { value: 800 },
            connect() {},
          };
        }
        get destination() { return {}; }
        resume() { return Promise.resolve(); }
      }
    };

    Object.defineProperty(globalThis, 'window', { value: mockWindow, writable: true, configurable: true });
    Object.defineProperty(globalThis, 'document', { value: mockDocument, writable: true, configurable: true });
    Object.defineProperty(globalThis, 'localStorage', { value: mockLocalStorage, writable: true, configurable: true });

    // Augment global navigator properties if navigator already exists
    if (typeof globalThis.navigator !== 'undefined') {
      try {
        Object.defineProperties(globalThis.navigator, {
          userAgent: { value: mockNavigator.userAgent, configurable: true },
          hardwareConcurrency: { value: mockNavigator.hardwareConcurrency, configurable: true },
          deviceMemory: { value: mockNavigator.deviceMemory, configurable: true },
          language: { value: mockNavigator.language, configurable: true },
          clipboard: { value: mockNavigator.clipboard, configurable: true },
          connection: { value: mockNavigator.connection, configurable: true },
        });
      } catch {
        // Ignore if read-only
      }
    } else {
      Object.defineProperty(globalThis, 'navigator', { value: mockNavigator, writable: true, configurable: true });
    }
  }
}
