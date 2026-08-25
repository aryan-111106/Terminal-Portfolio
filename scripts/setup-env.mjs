// Setup minimal browser mocks for headless Node test environment
if (typeof globalThis.window === 'undefined') {
  const localStorageStore = new Map();
  const mockLocalStorage = {
    getItem: (key) => (localStorageStore.has(key) ? localStorageStore.get(key) : null),
    setItem: (key, val) => { localStorageStore.set(key, String(val)); },
    removeItem: (key) => { localStorageStore.delete(key); },
    clear: () => { localStorageStore.clear(); },
    get length() { return localStorageStore.size; },
    key: (i) => Array.from(localStorageStore.keys())[i] || null,
  };

  const mockStyle = {
    properties: {},
    setProperty(k, v) { this.properties[k] = v; },
    getPropertyValue(k) { return this.properties[k] || ''; }
  };

  const mockDocument = {
    documentElement: {
      style: mockStyle,
      requestFullscreen: async () => {},
    },
    createElement: (tag) => ({
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
      writeText: async () => {},
    },
    connection: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
    }
  };

  globalThis.window = {
    localStorage: mockLocalStorage,
    document: mockDocument,
    navigator: mockNavigator,
    screen: { width: 1920, height: 1080, colorDepth: 24 },
    innerWidth: 1920,
    innerHeight: 1080,
    devicePixelRatio: 1,
    open: (url, target) => ({ url, target }),
    AudioContext: class {
      constructor() { this.currentTime = 0; this.state = 'running'; }
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

  globalThis.document = mockDocument;
  globalThis.navigator = mockNavigator;
  globalThis.localStorage = mockLocalStorage;
}
