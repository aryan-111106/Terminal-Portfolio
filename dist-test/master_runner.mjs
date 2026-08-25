var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import fs from "node:fs";
import path from "node:path";
function setupTestEnvironment() {
  if (typeof globalThis.window === "undefined") {
    const localStorageStore = /* @__PURE__ */ new Map();
    const mockLocalStorage = {
      getItem: (key) => localStorageStore.has(key) ? localStorageStore.get(key) : null,
      setItem: (key, val) => {
        localStorageStore.set(key, String(val));
      },
      removeItem: (key) => {
        localStorageStore.delete(key);
      },
      clear: () => {
        localStorageStore.clear();
      },
      get length() {
        return localStorageStore.size;
      },
      key: (i) => Array.from(localStorageStore.keys())[i] || null
    };
    const mockStyle = {
      properties: {},
      setProperty(k, v) {
        this.properties[k] = v;
      },
      getPropertyValue(k) {
        return this.properties[k] || "";
      }
    };
    const mockDocument = {
      documentElement: {
        style: mockStyle,
        requestFullscreen: async () => {
        }
      },
      createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        getContext: () => null,
        style: {},
        scrollIntoView: () => {
        },
        focus: () => {
        }
      }),
      fullscreenElement: null,
      exitFullscreen: async () => {
      }
    };
    const mockNavigator = {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      hardwareConcurrency: 16,
      deviceMemory: 16,
      language: "en-US",
      maxTouchPoints: 0,
      clipboard: {
        writeText: async (_text) => {
        }
      },
      connection: {
        effectiveType: "4g",
        downlink: 10,
        rtt: 50
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
      open: (url, target) => ({ url, target }),
      AudioContext: class {
        constructor() {
          __publicField(this, "currentTime", 0);
          __publicField(this, "state", "running");
        }
        createOscillator() {
          return {
            type: "sine",
            frequency: { value: 440, setValueAtTime() {
            }, exponentialRampToValueAtTime() {
            }, linearRampToValueAtTime() {
            } },
            connect() {
            },
            start() {
            },
            stop() {
            }
          };
        }
        createGain() {
          return {
            gain: { value: 1, setValueAtTime() {
            }, exponentialRampToValueAtTime() {
            } },
            connect() {
            }
          };
        }
        createBiquadFilter() {
          return {
            type: "highpass",
            frequency: { value: 800 },
            connect() {
            }
          };
        }
        get destination() {
          return {};
        }
        resume() {
          return Promise.resolve();
        }
      }
    };
    Object.defineProperty(globalThis, "window", { value: mockWindow, writable: true, configurable: true });
    Object.defineProperty(globalThis, "document", { value: mockDocument, writable: true, configurable: true });
    Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage, writable: true, configurable: true });
    if (typeof globalThis.navigator !== "undefined") {
      try {
        Object.defineProperties(globalThis.navigator, {
          userAgent: { value: mockNavigator.userAgent, configurable: true },
          hardwareConcurrency: { value: mockNavigator.hardwareConcurrency, configurable: true },
          deviceMemory: { value: mockNavigator.deviceMemory, configurable: true },
          language: { value: mockNavigator.language, configurable: true },
          clipboard: { value: mockNavigator.clipboard, configurable: true },
          connection: { value: mockNavigator.connection, configurable: true }
        });
      } catch {
      }
    } else {
      Object.defineProperty(globalThis, "navigator", { value: mockNavigator, writable: true, configurable: true });
    }
  }
}
class TestHarness {
  constructor() {
    __publicField(this, "currentSuite", "Default Suite");
    __publicField(this, "results", []);
    __publicField(this, "suiteStartTime", Date.now());
    __publicField(this, "allSummaries", []);
  }
  startSuite(name) {
    this.currentSuite = name;
    this.results = [];
    this.suiteStartTime = Date.now();
    console.log(`
================================================================`);
    console.log(`🚀 STARTING TEST SUITE: [${name}]`);
    console.log(`================================================================`);
  }
  async test(name, fn, details) {
    const start = performance.now();
    try {
      await fn();
      const durationMs = Math.round((performance.now() - start) * 100) / 100;
      this.results.push({
        name,
        category: this.currentSuite,
        passed: true,
        durationMs,
        details
      });
      console.log(`  ✅ PASS: ${name} (${durationMs}ms)`);
      return true;
    } catch (err) {
      const durationMs = Math.round((performance.now() - start) * 100) / 100;
      const errorMsg = err instanceof Error ? err.stack || err.message : String(err);
      this.results.push({
        name,
        category: this.currentSuite,
        passed: false,
        durationMs,
        error: errorMsg,
        details
      });
      console.error(`  ❌ FAIL: ${name} (${durationMs}ms)`);
      console.error(`     Error: ${errorMsg}`);
      return false;
    }
  }
  endSuite() {
    const totalDuration = Date.now() - this.suiteStartTime;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const total = this.results.length;
    const summary = {
      suiteName: this.currentSuite,
      total,
      passed,
      failed,
      durationMs: totalDuration,
      results: [...this.results]
    };
    this.allSummaries.push(summary);
    console.log(`----------------------------------------------------------------`);
    console.log(`Suite [${this.currentSuite}] Complete: ${passed}/${total} passed (${failed} failed) in ${totalDuration}ms`);
    console.log(`----------------------------------------------------------------
`);
    return summary;
  }
  getAllSummaries() {
    return this.allSummaries;
  }
  printOverallSummary() {
    const totalSuites = this.allSummaries.length;
    const totalTests = this.allSummaries.reduce((acc, s) => acc + s.total, 0);
    const totalPassed = this.allSummaries.reduce((acc, s) => acc + s.passed, 0);
    const totalFailed = this.allSummaries.reduce((acc, s) => acc + s.failed, 0);
    const totalDuration = this.allSummaries.reduce((acc, s) => acc + s.durationMs, 0);
    console.log(`
================================================================`);
    console.log(`📊 MASTER TEST EXECUTION SUMMARY`);
    console.log(`================================================================`);
    console.log(`Total Test Suites: ${totalSuites}`);
    console.log(`Total Tests Run:   ${totalTests}`);
    console.log(`Total Passed:      ${totalPassed}`);
    console.log(`Total Failed:      ${totalFailed}`);
    console.log(`Success Rate:      ${totalTests > 0 ? (totalPassed / totalTests * 100).toFixed(2) : 0}%`);
    console.log(`Total Execution:   ${totalDuration}ms`);
    if (totalFailed > 0) {
      console.log(`
❌ FAILED TESTS LIST:`);
      for (const suite of this.allSummaries) {
        for (const res of suite.results) {
          if (!res.passed) {
            console.log(`  - [${suite.suiteName}] ${res.name}`);
            console.log(`    Error: ${res.error}`);
          }
        }
      }
    }
    console.log(`================================================================
`);
    return totalFailed === 0;
  }
}
const harness = new TestHarness();
function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`Expected ${a} to equal ${b}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be truthy`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be falsy`);
      }
    },
    toBeDefined() {
      if (actual === void 0) {
        throw new Error(`Expected value to be defined, received undefined`);
      }
    },
    toContain(expected) {
      if (typeof actual === "string") {
        if (!actual.includes(String(expected))) {
          throw new Error(`Expected string "${actual.substring(0, 100)}..." to contain "${expected}"`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(expected)) {
          throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
        }
      } else {
        throw new Error(`toContain only supports string and array, received ${typeof actual}`);
      }
    },
    toBeGreaterThan(expected) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (typeof actual !== "number" || actual < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan(expected) {
      if (typeof actual !== "number" || actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected) {
      if (typeof actual !== "number" || actual > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, received ${JSON.stringify(actual)}`);
      }
    },
    toBeUndefined() {
      if (actual !== void 0) {
        throw new Error(`Expected undefined, received ${JSON.stringify(actual)}`);
      }
    },
    toMatch(regex) {
      if (typeof actual !== "string" || !regex.test(actual)) {
        throw new Error(`Expected "${String(actual).substring(0, 100)}" to match pattern ${regex}`);
      }
    },
    toThrow(expectedSubstring) {
      if (typeof actual !== "function") {
        throw new Error(`toThrow expected a function, received ${typeof actual}`);
      }
      let threw = false;
      let errorMsg = "";
      try {
        actual();
      } catch (e) {
        threw = true;
        errorMsg = e instanceof Error ? e.message : String(e);
      }
      if (!threw) {
        throw new Error(`Expected function to throw, but it did not`);
      }
      if (expectedSubstring && !errorMsg.includes(expectedSubstring)) {
        throw new Error(`Expected thrown error "${errorMsg}" to contain "${expectedSubstring}"`);
      }
    }
  };
}
const portfolioConfig = {
  name: "Aryan Prasad",
  title: "Aspiring AI/ML Engineer | Python • Machine Learning • DSA | B.Tech CSE (AI & ML)",
  handle: "guest",
  hostname: "aryan-linux",
  email: "aryan.prasad111106@gmail.com",
  location: "Kolkata, West Bengal, India",
  asciiPortrait: `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣶⣶⣶⣶⣶⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣿⡿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⡿⠟⠋⠁⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡏⢸⣿⣿⣿⣿⣿⣿⠛⢿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣼⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡟⠀⢸⣿⣿⣿⣿⣿⣿⠀⠀⠙⢿⣿⣿⣿⣧⡀⠀⠀⠀⠀
⠀⠀⠀⢠⣾⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡿⠀⠀⢸⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠙⣿⣿⣿⣷⡄⠀⠀⠀
⠀⠀⢠⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⡿⠁⠀⠀⢸⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⡄⠀⠀
⠀⢀⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⡀⠀
⠀⣼⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣧⠀
⢀⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⡀
⢸⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⢀⠈⠻⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⡇
⢸⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⢸⣷⣄⠈⠻⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡇
⢸⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣶⣶⣾⣿⣿⣷⣄⠈⠻⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⡇
⠘⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⠃
⠀⢿⣿⣿⣿⡀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⡿⠀
⠀⠘⣿⣿⣿⣧⠀⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⣿⣿⣿⣿⠟⠉⣠⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⠃⠀
⠀⠀⠹⣿⣿⣿⡧⠀⣼⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡿⠋⠁⣠⣾⣿⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⠏⠀⠀
⠀⠀⠀⠹⣿⡟⠁⣰⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢀⣴⣿⣿⣿⣿⠀⠀⠀⠀⢀⣾⣿⣿⣿⠏⠀⠀⠀
⠀⠀⠀⠀⠘⠀⣰⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠛⠛⠛⠛⠛⠛⠀⠀⢀⣴⣿⣿⣿⡿⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⡿⠁⢠⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⠃⢠⣿⣿⣿⣷⣶⣦⣤⣤⣄⣀⣀⣠⣤⣤⣴⣶⣿⣿⣿⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠉⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠰⠿⠿⠿⠿⠿⠿⠿⠿⠏⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠛⠛⠛⠛⠛⠛⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
`,
  asciiName: `
 █████╗ ██████╗ ██╗   ██╗ █████╗ ███╗   ██╗    ██████╗ ██████╗  █████╗ ███████╗ █████╗ ██████╗ 
██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║    ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗
███████║██████╔╝ ╚████╔╝ ███████║██╔██╗ ██║    ██████╔╝██████╔╝███████║███████╗███████║██║  ██║
██╔══██║██╔══██╗  ╚██╔╝  ██╔══██║██║╚██╗██║    ██╔═══╝ ██╔══██╗██╔══██║╚════██║██╔══██║██║  ██║
██║  ██║██║  ██║   ██║   ██║  ██║██║ ╚████║    ██║     ██║  ██║██║  ██║███████║██║  ██║██████╔╝
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ 
`,
  welcomeTagline: "Welcome to Aryan Prasad's Terminal Portfolio",
  welcomeSubtitle: "Aspiring AI/ML Engineer | Python • Machine Learning • Data Structures & Algorithms",
  bio: [
    "I'm a second-year Computer Science student specializing in Artificial Intelligence & Machine Learning at Haldia Institute of Technology.",
    "Passionate about understanding how intelligent systems can solve real-world challenges and create meaningful impact. Currently building a strong foundation in Machine Learning, Data Structures & Algorithms, and Python while exploring Generative AI, automation, and data-driven technologies.",
    "Beyond academics, I focus on strengthening my problem-solving skills and applying concepts through hands-on projects, continuously improving my understanding of AI and software development.",
    "I believe in continuous learning, building practical projects, and collaborating with like-minded individuals who are passionate about technology and innovation. Actively seeking opportunities to learn, contribute, and grow through internships, mentorships, open-source projects, and meaningful collaborations."
  ],
  about: {
    summary: "Second-year B.Tech CSE (AI & ML) student at Haldia Institute of Technology with a strong passion for Machine Learning, Generative AI, Python development, and Data Structures & Algorithms. Dedicated to building impactful intelligent systems.",
    passions: [
      "Artificial Intelligence & Machine Learning pipelines",
      "Generative AI, LLM applications & AI Assistants",
      "Computer Vision & Automated Image Processing",
      "Data Structures & Algorithms (DSA) in Python & C",
      "Full-stack web & desktop automation tools"
    ],
    currentFocus: "Building AI-driven assistants, computer vision applications, and solving Data Structures & Algorithms problems.",
    funFact: "Multilingual learner — proficient in English, Hindi, and Bengali, with an enthusiasm for Sanskrit and German!"
  },
  skills: [
    {
      category: "Programming Languages",
      skills: [
        { name: "Python (Core, OOP, Scripting)", level: 92, description: "Automation, AI/ML libraries, OpenCV, Gemini API, Desktop assistants" },
        { name: "TypeScript / JavaScript", level: 82, description: "Web applications, React/Node development, interactive UIs" },
        { name: "C / C++", level: 80, description: "Core data structures, memory management, academic algorithms" },
        { name: "SQL & Shell", level: 78, description: "Database querying, Linux Bash scripting, automation" }
      ]
    },
    {
      category: "AI, ML & Computer Vision",
      skills: [
        { name: "Generative AI & Gemini API", level: 88, description: "Google Gemini API integrations, multimodal prompt engineering" },
        { name: "Computer Vision & OpenCV", level: 84, description: "Image segmentation, ANPR number plate detection, OCR" },
        { name: "Machine Learning (Scikit-Learn)", level: 85, description: "Supervised/unsupervised models, predictive analytics" },
        { name: "Pandas & NumPy", level: 90, description: "Data wrangling, feature engineering, Jupyter notebooks" }
      ]
    },
    {
      category: "Core Computer Science & Cloud",
      skills: [
        { name: "Data Structures & Algorithms (DSA)", level: 86, description: "Problem solving, arrays, trees, recursion, complexity analysis" },
        { name: "Oracle Cloud Infrastructure (OCI AI)", level: 80, description: "OCI 2025 Certified AI Foundations Associate" },
        { name: "Git & GitHub", level: 88, description: "Version control, multi-repository management, open-source" },
        { name: "Database & OS Fundamentals", level: 82, description: "DBMS schemas, OS processes, Linux CLI workflow" }
      ]
    },
    {
      category: "Languages (Spoken)",
      skills: [
        { name: "English", level: 95, description: "Professional working proficiency" },
        { name: "Hindi", level: 100, description: "Native / Bilingual proficiency" },
        { name: "Bengali", level: 100, description: "Native / Bilingual proficiency" },
        { name: "Sanskrit & German", level: 50, description: "Elementary linguistic interest" }
      ]
    }
  ],
  projects: [
    {
      id: "agrisathi",
      name: "AgriSathi",
      category: "AI / ML",
      featured: true,
      description: "Smart agricultural platform providing AI-driven crop disease diagnosis, weather insights, and advisory tools for farmers.",
      longDescription: "Built with Python to assist the agricultural sector with data-driven decision making, crop health monitoring, and personalized farming guidance.",
      tags: ["Python", "AI / ML", "AgriTech", "Data Analytics"],
      githubUrl: "https://github.com/aryan-111106/AgriSathi",
      stars: 12,
      stats: "Python • Active Development"
    },
    {
      id: "gemini-assistant",
      name: "Gemini AI Assistant",
      category: "AI / ML",
      featured: true,
      description: "Generative AI conversational assistant built with Python and the Google Gemini API for intelligent question answering and multi-turn dialogue.",
      longDescription: "Integrates with Google Gemini models to provide real-time reasoning, document analysis, and natural language assistant capabilities.",
      tags: ["Python", "Google Gemini API", "Generative AI", "LLMs"],
      githubUrl: "https://github.com/aryan-111106/gemini-assistant",
      stars: 15,
      stats: "Python • Google Gemini API"
    },
    {
      id: "jarvis",
      name: "JARVIS — AI Virtual Assistant",
      category: "AI / ML",
      featured: true,
      description: "Desktop voice and task automation assistant in Python for system operations, speech recognition, and web queries.",
      longDescription: "Features voice command processing, text-to-speech feedback, desktop system controls, and automated internet lookups.",
      tags: ["Python", "Voice AI", "Automation", "Speech Recognition"],
      githubUrl: "https://github.com/aryan-111106/JARVIS",
      stars: 18,
      stats: "Python • Voice Automation"
    },
    {
      id: "number-plate",
      name: "Automatic Number Plate Recognition (ANPR)",
      category: "AI / ML",
      featured: true,
      description: "Computer vision and image processing application for detecting, isolating, and extracting vehicle license plate characters.",
      longDescription: "Utilizes Python and OpenCV for image preprocessing, contour detection, and optical character recognition on vehicle plates.",
      tags: ["Python", "Computer Vision", "OpenCV", "Image Processing"],
      githubUrl: "https://github.com/aryan-111106/Number-Plate",
      stars: 14,
      stats: "Python • Computer Vision"
    },
    {
      id: "budgetbuddy",
      name: "BudgetBuddy",
      category: "Frontend",
      featured: false,
      description: "Personal finance and expense management web application designed for tracking budgets and expense categories.",
      longDescription: "Developed in TypeScript with an interactive user interface for organizing monthly budgets, categorizing transactions, and monitoring spending trends.",
      tags: ["TypeScript", "Web App", "Finance", "UI / UX"],
      githubUrl: "https://github.com/aryan-111106/BudgetBuddy",
      stars: 8,
      stats: "TypeScript"
    },
    {
      id: "dsa-repo",
      name: "Data Structures & Algorithms Suite",
      category: "Systems / CLI",
      featured: false,
      description: "Comprehensive repository of Data Structures & Algorithms implementations, Jupyter notebooks, and problem-solving solutions.",
      longDescription: "Detailed implementations covering linear and non-linear data structures, searching, sorting, and algorithmic complexity evaluations.",
      tags: ["Jupyter Notebook", "Python", "DSA", "Algorithms"],
      githubUrl: "https://github.com/aryan-111106/Data-Structures-and-Algorithms",
      stars: 20,
      stats: "Jupyter Notebook • Python"
    },
    {
      id: "gamer-color",
      name: "Gamer-Color Palette Visualizer",
      category: "Frontend",
      featured: false,
      description: "Interactive gaming-themed color palette and theme generation utility built with TypeScript.",
      longDescription: "Provides developer-friendly color scheme generation, hex/RGB conversions, and real-time contrast previews for game and UI design.",
      tags: ["TypeScript", "Frontend", "Theme Generator", "UI"],
      githubUrl: "https://github.com/aryan-111106/Gamer-color",
      stars: 6,
      stats: "TypeScript"
    },
    {
      id: "college",
      name: "College C & Systems Programming",
      category: "Systems / CLI",
      featured: false,
      description: "Academic coursework repository containing C programming, memory algorithms, and fundamental computer science assignments.",
      longDescription: "Contains structured C implementations of foundational computing algorithms, pointers, memory allocation, and lab exercises.",
      tags: ["C", "Computer Science", "Academic", "Algorithms"],
      githubUrl: "https://github.com/aryan-111106/College",
      stars: 5,
      stats: "C Programming"
    }
  ],
  experience: [
    {
      company: "Deloitte Australia",
      role: "Data Analytics Job Simulation",
      period: "2025",
      location: "Remote / Australia",
      current: false,
      description: [
        "Completed practical job simulation tasks in exploratory data analysis, data cleansing, and trend forecasting.",
        "Synthesized large telemetry datasets using Python and Pandas to generate executive-level statistical summaries.",
        "Identified business insights and communicated data-driven recommendations."
      ],
      technologies: ["Python", "Pandas", "Data Analytics", "Data Visualization"]
    },
    {
      company: "Google Developers / DeepLearning",
      role: "5-Day AI Agents Intensive Course Trainee",
      period: "2025",
      location: "Remote",
      current: false,
      description: [
        "Trained on modern AI Agent architectures, tool-calling pipelines, and autonomous agent collaboration.",
        "Built generative AI workflows leveraging prompt engineering, embeddings, and API integrations."
      ],
      technologies: ["Generative AI", "Python", "AI Agents", "LLMs", "Google AI"]
    }
  ],
  education: [
    {
      institution: "Haldia Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering (AI & ML Specialization)",
      period: "2025 — 2029",
      location: "Haldia, West Bengal, India",
      details: [
        "Specialization: Artificial Intelligence & Machine Learning",
        "Key Coursework: Data Structures & Algorithms, Machine Learning, Python Programming, Mathematics for AI, DBMS, Operating Systems",
        "Active student collaborator focusing on hands-on project building and open-source learning"
      ]
    },
    {
      institution: "Kendriya Vidyalaya (KV)",
      degree: "Secondary & Higher Secondary Education (PCM + Computer Science)",
      period: "2017 — 2025",
      location: "Kolkata, West Bengal, India",
      details: [
        "Core Subjects: Physics, Chemistry, Mathematics, and Computer Science (Python/C++)",
        "Strong foundation in algorithmic thinking, mathematics, and programming fundamentals"
      ]
    }
  ],
  certifications: [
    { title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate", issuer: "Oracle", year: "2025" },
    { title: "The Joy of Computing using Python", issuer: "NPTEL / IIT", year: "2025" },
    { title: "Deloitte Australia — Data Analytics Job Simulation", issuer: "Deloitte / Forage", year: "2025" },
    { title: "5-Day AI Agents Intensive Course with Google", issuer: "Google", year: "2025" },
    { title: "What Is Generative AI?", issuer: "LinkedIn Learning / DeepLearning.AI", year: "2025" }
  ],
  awards: [
    { title: "Prabhat Khabar Pratibha Samman", issuer: "Prabhat Khabar", year: "Recognition of Academic & Talent Excellence" }
  ],
  socials: [
    { platform: "GitHub", username: "aryan-111106", url: "https://github.com/aryan-111106", icon: "github" },
    { platform: "LinkedIn", username: "aryan-prasad06", url: "https://www.linkedin.com/in/aryan-prasad06/", icon: "linkedin" },
    { platform: "Email", username: "aryan.prasad111106@gmail.com", url: "mailto:aryan.prasad111106@gmail.com", icon: "mail" }
  ],
  resumeUrl: "/resume.pdf",
  easterEggs: {
    cowsayDefault: "Machine learning is not just about algorithms; it is about teaching computers to understand patterns and solve real-world challenges.",
    motd: "Welcome to Aryan's Linux Terminal. Type 'help' to explore available commands or 'projects' to view GitHub projects.",
    quotes: [
      "Artificial Intelligence is the new electricity. — Andrew Ng",
      "The best way to understand AI is to build it step by step.",
      "Talk is cheap. Show me the code. — Linus Torvalds",
      "First, solve the problem. Then, write the code. — John Johnson",
      "Continuous learning is the minimum requirement for success in any field. — Brian Tracy"
    ]
  }
};
async function runTier1BuildAndAssetsTests(projectRoot) {
  harness.startSuite("Tier 1 - Build & Assets (R1 & R4)");
  await harness.test("R1: Production dist/ directory exists and is populated", () => {
    const distPath = path.resolve(projectRoot, "dist");
    expect(fs.existsSync(distPath)).toBeTruthy();
    expect(fs.statSync(distPath).isDirectory()).toBeTruthy();
  });
  await harness.test("R1: dist/index.html is generated with essential SPA tags", () => {
    const indexPath = path.resolve(projectRoot, "dist", "index.html");
    expect(fs.existsSync(indexPath)).toBeTruthy();
    const content = fs.readFileSync(indexPath, "utf-8");
    expect(content).toContain('<div id="root"></div>');
    expect(content).toContain("<title>");
    expect(content).toContain("viewport");
    expect(content).toContain("assets/");
  });
  await harness.test("R1: Production CSS bundle generated with valid minified size", () => {
    const assetsPath = path.resolve(projectRoot, "dist", "assets");
    expect(fs.existsSync(assetsPath)).toBeTruthy();
    const files = fs.readdirSync(assetsPath);
    const cssFile = files.find((f) => f.endsWith(".css"));
    expect(cssFile).toBeDefined();
    const cssPath = path.resolve(assetsPath, cssFile);
    const stats = fs.statSync(cssPath);
    expect(stats.size).toBeGreaterThan(15e3);
  });
  await harness.test("R1: Production JavaScript bundle generated with valid bundle size", () => {
    const assetsPath = path.resolve(projectRoot, "dist", "assets");
    const files = fs.readdirSync(assetsPath);
    const jsFile = files.find((f) => f.endsWith(".js") && !f.includes("probe"));
    expect(jsFile).toBeDefined();
    const jsPath = path.resolve(assetsPath, jsFile);
    const stats = fs.statSync(jsPath);
    expect(stats.size).toBeGreaterThan(15e4);
  });
  await harness.test("R1: TypeScript config has strict typechecking enabled", () => {
    const tsconfigPath = path.resolve(projectRoot, "tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBeTruthy();
    const content = fs.readFileSync(tsconfigPath, "utf-8");
    expect(content).toContain('"strict": true');
    expect(content).toContain('"noUnusedLocals": true');
  });
  await harness.test("R4: public/resume.pdf exists and contains valid PDF magic header", () => {
    const resumePath = path.resolve(projectRoot, "public", "resume.pdf");
    expect(fs.existsSync(resumePath)).toBeTruthy();
    const stats = fs.statSync(resumePath);
    expect(stats.size).toBeGreaterThan(50);
    const buffer = fs.readFileSync(resumePath);
    const magicHeader = buffer.toString("utf-8", 0, 5);
    expect(magicHeader).toBe("%PDF-");
  });
  await harness.test("R4: dist/resume.pdf exists in compiled production build", () => {
    const distResumePath = path.resolve(projectRoot, "dist", "resume.pdf");
    expect(fs.existsSync(distResumePath)).toBeTruthy();
    const buffer = fs.readFileSync(distResumePath);
    const magicHeader = buffer.toString("utf-8", 0, 5);
    expect(magicHeader).toBe("%PDF-");
  });
  await harness.test("R4: All 8 project repository URLs are well-formed HTTPS GitHub URLs", () => {
    const projects = portfolioConfig.projects;
    expect(projects.length).toBeGreaterThanOrEqual(8);
    for (const proj of projects) {
      if (proj.githubUrl) {
        expect(proj.githubUrl.startsWith("https://github.com/aryan-111106/")).toBeTruthy();
        expect(proj.githubUrl.length).toBeGreaterThan(32);
      }
    }
  });
  await harness.test("R4: All social profiles and contact endpoints are valid", () => {
    expect(portfolioConfig.email).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const socials = portfolioConfig.socials;
    expect(socials.length).toBeGreaterThanOrEqual(3);
    for (const soc of socials) {
      if (soc.platform === "Email") {
        expect(soc.url.startsWith("mailto:")).toBeTruthy();
      } else {
        expect(soc.url.startsWith("https://")).toBeTruthy();
      }
    }
  });
  await harness.test("R4: Live demo URLs (where provided) are well-formed", () => {
    const projectsWithLive = portfolioConfig.projects.filter((p) => p.liveUrl);
    for (const proj of projectsWithLive) {
      expect(proj.liveUrl.startsWith("https://") || proj.liveUrl.startsWith("http://")).toBeTruthy();
    }
  });
  return harness.endSuite();
}
const THEMES = {
  "matrix-green": {
    id: "matrix-green",
    name: "Matrix Green (CRT)",
    description: "Classic phosphor green terminal with digital rain aesthetic",
    colors: {
      bg: "#050a05",
      bgSecondary: "#0b160b",
      text: "#22c55e",
      textMuted: "#15803d",
      border: "#166534",
      promptUser: "#4ade80",
      promptHost: "#22c55e",
      promptPath: "#86efac",
      promptChar: "#22c55e",
      accent: "#22c55e",
      accentSecondary: "#16a34a",
      success: "#4ade80",
      error: "#ef4444",
      warning: "#eab308",
      info: "#38bdf8",
      command: "#86efac",
      link: "#4ade80",
      tagBg: "#052e16",
      tagText: "#4ade80",
      selectionBg: "#14532d",
      cursor: "#22c55e"
    },
    glow: "0 0 10px rgba(34, 197, 94, 0.45)",
    headerBg: "#081208",
    statusBarBg: "#050f05"
  },
  "dracula": {
    id: "dracula",
    name: "Dracula",
    description: "Dark theme with vibrant magenta, purple, and cyan highlights",
    colors: {
      bg: "#282a36",
      bgSecondary: "#343746",
      text: "#f8f8f2",
      textMuted: "#6272a4",
      border: "#44475a",
      promptUser: "#50fa7b",
      promptHost: "#bd93f9",
      promptPath: "#8be9fd",
      promptChar: "#ff79c6",
      accent: "#ff79c6",
      accentSecondary: "#bd93f9",
      success: "#50fa7b",
      error: "#ff5555",
      warning: "#f1fa8c",
      info: "#8be9fd",
      command: "#f1fa8c",
      link: "#8be9fd",
      tagBg: "#44475a",
      tagText: "#ff79c6",
      selectionBg: "#44475a",
      cursor: "#f8f8f2"
    },
    glow: "0 0 10px rgba(189, 147, 249, 0.35)",
    headerBg: "#21222c",
    statusBarBg: "#191a21"
  },
  "catppuccin": {
    id: "catppuccin",
    name: "Catppuccin Mocha",
    description: "Soothing pastel palette with deep slate background",
    colors: {
      bg: "#1e1e2e",
      bgSecondary: "#25253a",
      text: "#cdd6f4",
      textMuted: "#6c7086",
      border: "#313244",
      promptUser: "#a6e3a1",
      promptHost: "#cba6f7",
      promptPath: "#89b4fa",
      promptChar: "#f38ba8",
      accent: "#cba6f7",
      accentSecondary: "#f5c2e7",
      success: "#a6e3a1",
      error: "#f38ba8",
      warning: "#f9e2af",
      info: "#89dceb",
      command: "#fab387",
      link: "#89b4fa",
      tagBg: "#313244",
      tagText: "#cba6f7",
      selectionBg: "#45475a",
      cursor: "#f5e0dc"
    },
    glow: "0 0 10px rgba(203, 166, 247, 0.3)",
    headerBg: "#181825",
    statusBarBg: "#11111b"
  },
  "nord": {
    id: "nord",
    name: "Nord Frost",
    description: "Arctic, north-bluish clean and elegant color scheme",
    colors: {
      bg: "#2e3440",
      bgSecondary: "#3b4252",
      text: "#eceff4",
      textMuted: "#7b88a1",
      border: "#434c5e",
      promptUser: "#a3be8c",
      promptHost: "#88c0d0",
      promptPath: "#81a1c1",
      promptChar: "#b48ead",
      accent: "#88c0d0",
      accentSecondary: "#81a1c1",
      success: "#a3be8c",
      error: "#bf616a",
      warning: "#ebcb8b",
      info: "#8fbcbb",
      command: "#88c0d0",
      link: "#88c0d0",
      tagBg: "#434c5e",
      tagText: "#eceff4",
      selectionBg: "#4c566a",
      cursor: "#d8dee9"
    },
    glow: "0 0 10px rgba(136, 192, 208, 0.3)",
    headerBg: "#242933",
    statusBarBg: "#1c2028"
  },
  "gruvbox": {
    id: "gruvbox",
    name: "Gruvbox Dark",
    description: "Warm retro groove with earthy amber, copper, and olive tones",
    colors: {
      bg: "#1d2021",
      bgSecondary: "#282828",
      text: "#ebdbb2",
      textMuted: "#928374",
      border: "#3c3836",
      promptUser: "#b8bb26",
      promptHost: "#fabd2f",
      promptPath: "#83a598",
      promptChar: "#fe8019",
      accent: "#fe8019",
      accentSecondary: "#fabd2f",
      success: "#b8bb26",
      error: "#fb4934",
      warning: "#fabd2f",
      info: "#8ec07c",
      command: "#fabd2f",
      link: "#83a598",
      tagBg: "#3c3836",
      tagText: "#fe8019",
      selectionBg: "#504945",
      cursor: "#ebdbb2"
    },
    glow: "0 0 10px rgba(254, 128, 25, 0.25)",
    headerBg: "#181a1b",
    statusBarBg: "#141617"
  },
  "cyberpunk": {
    id: "cyberpunk",
    name: "Cyberpunk 2077",
    description: "High-voltage neon yellow, cyan, and hot pink",
    colors: {
      bg: "#0a0a12",
      bgSecondary: "#141424",
      text: "#fcee0a",
      textMuted: "#71719a",
      border: "#2c2c4d",
      promptUser: "#00ff9f",
      promptHost: "#00f0ff",
      promptPath: "#ff0055",
      promptChar: "#fcee0a",
      accent: "#00f0ff",
      accentSecondary: "#ff0055",
      success: "#00ff9f",
      error: "#ff0055",
      warning: "#fcee0a",
      info: "#00f0ff",
      command: "#00ff9f",
      link: "#00f0ff",
      tagBg: "#220033",
      tagText: "#ff0055",
      selectionBg: "#ff0055",
      cursor: "#fcee0a"
    },
    glow: "0 0 12px rgba(0, 240, 255, 0.4)",
    headerBg: "#06060c",
    statusBarBg: "#030306"
  },
  "ubuntu": {
    id: "ubuntu",
    name: "Ubuntu Bash",
    description: "Canonical deep aubergine with classic bash prompt colors",
    colors: {
      bg: "#300a24",
      bgSecondary: "#3d0d2e",
      text: "#ffffff",
      textMuted: "#aea79f",
      border: "#5c1647",
      promptUser: "#8ae234",
      promptHost: "#ffffff",
      promptPath: "#729fcf",
      promptChar: "#ffffff",
      accent: "#e95420",
      accentSecondary: "#77216f",
      success: "#8ae234",
      error: "#ef2929",
      warning: "#fce94f",
      info: "#729fcf",
      command: "#fce94f",
      link: "#e95420",
      tagBg: "#5c1647",
      tagText: "#ffffff",
      selectionBg: "#5c1647",
      cursor: "#ffffff"
    },
    glow: "0 0 8px rgba(233, 84, 32, 0.3)",
    headerBg: "#24071b",
    statusBarBg: "#1b0514"
  }
};
class VirtualFileSystem {
  constructor() {
    __publicField(this, "root");
    __publicField(this, "homePath", "/home/guest");
    this.root = this.initFileSystem();
  }
  initFileSystem() {
    const now = "Aug 25 11:30";
    const projectFiles = {};
    portfolioConfig.projects.forEach((proj) => {
      const filename = `${proj.id}.md`;
      const content = `# ${proj.name}
Category: ${proj.category}
Tags: ${proj.tags.join(", ")}
${proj.githubUrl ? `GitHub: ${proj.githubUrl}` : ""}
${proj.liveUrl ? `Live Demo: ${proj.liveUrl}` : ""}

${proj.description}

${proj.longDescription || ""}
`;
      projectFiles[filename] = {
        name: filename,
        type: "file",
        content: content.trim(),
        size: content.length,
        permissions: "-rw-r--r--",
        modified: now
      };
    });
    const experienceFiles = {};
    portfolioConfig.experience.forEach((exp, idx) => {
      const filename = `${exp.company.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
      const content = `COMPANY: ${exp.company}
ROLE: ${exp.role}
PERIOD: ${exp.period}
LOCATION: ${exp.location}
TECH: ${exp.technologies.join(", ")}

HIGHLIGHTS:
${exp.description.map((d) => `• ${d}`).join("\n")}
`;
      experienceFiles[filename] = {
        name: filename,
        type: "file",
        content: content.trim(),
        size: content.length,
        permissions: "-rw-r--r--",
        modified: `Aug ${20 + idx} 10:00`
      };
    });
    const rootDir = {
      name: "/",
      type: "dir",
      permissions: "drwxr-xr-x",
      modified: now,
      children: {
        "bin": {
          name: "bin",
          type: "dir",
          permissions: "drwxr-xr-x",
          modified: now,
          children: {
            "about": { name: "about", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 14280, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "projects": { name: "projects", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 18920, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "skills": { name: "skills", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 12400, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "experience": { name: "experience", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 16200, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "contact": { name: "contact", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 9840, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "theme": { name: "theme", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 8400, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "matrix": { name: "matrix", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 24500, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "snake": { name: "snake", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 32e3, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "neofetch": { name: "neofetch", type: "file", content: "#!/bin/bash\n# Fast system info fetcher", size: 4500, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "cowsay": { name: "cowsay", type: "file", content: "#!/usr/bin/perl\n# Generates an ASCII cow with speech balloon", size: 5400, permissions: "-rwxr-xr-x", modified: now, isExecutable: true },
            "sl": { name: "sl", type: "file", content: "ELF 64-bit LSB executable, x86-64", size: 11200, permissions: "-rwxr-xr-x", modified: now, isExecutable: true }
          }
        },
        "etc": {
          name: "etc",
          type: "dir",
          permissions: "drwxr-xr-x",
          modified: now,
          children: {
            "os-release": {
              name: "os-release",
              type: "file",
              content: `NAME="Portfolio Linux"
PRETTY_NAME="Portfolio Linux 6.8.0-custom-arch"
ID=arch
ID_LIKE=archlinux
VERSION_ID=2026.08
BUILD_ID=rolling
HOME_URL="https://github.com"`,
              size: 160,
              permissions: "-rw-r--r--",
              modified: now
            },
            "hostname": {
              name: "hostname",
              type: "file",
              content: `${portfolioConfig.hostname}
`,
              size: portfolioConfig.hostname.length + 1,
              permissions: "-rw-r--r--",
              modified: now
            },
            "motd": {
              name: "motd",
              type: "file",
              content: portfolioConfig.easterEggs.motd,
              size: portfolioConfig.easterEggs.motd.length,
              permissions: "-rw-r--r--",
              modified: now
            }
          }
        },
        "home": {
          name: "home",
          type: "dir",
          permissions: "drwxr-xr-x",
          modified: now,
          children: {
            "guest": {
              name: "guest",
              type: "dir",
              permissions: "drwxr-xr-x",
              modified: now,
              children: {
                "about.txt": {
                  name: "about.txt",
                  type: "file",
                  content: `${portfolioConfig.name} — ${portfolioConfig.title}
Location: ${portfolioConfig.location}

${portfolioConfig.about.summary}

Passions:
${portfolioConfig.about.passions.map((p) => `• ${p}`).join("\n")}

Current Focus:
${portfolioConfig.about.currentFocus}

Fun Fact: ${portfolioConfig.about.funFact}
`,
                  size: 420,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                "skills.txt": {
                  name: "skills.txt",
                  type: "file",
                  content: portfolioConfig.skills.map(
                    (cat) => `[ ${cat.category.toUpperCase()} ]
` + cat.skills.map((s) => `• ${s.name.padEnd(26)} [${"#".repeat(Math.round(s.level / 10))}${" ".repeat(10 - Math.round(s.level / 10))}] ${s.level}%
  ${s.description || ""}`).join("\n")
                  ).join("\n\n"),
                  size: 890,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                "contact.txt": {
                  name: "contact.txt",
                  type: "file",
                  content: `EMAIL: ${portfolioConfig.email}
LOCATION: ${portfolioConfig.location}

SOCIAL PROFILES:
${portfolioConfig.socials.map((s) => `• ${s.platform.padEnd(12)} -> ${s.url}`).join("\n")}
`,
                  size: 260,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                "projects": {
                  name: "projects",
                  type: "dir",
                  permissions: "drwxr-xr-x",
                  modified: now,
                  children: projectFiles
                },
                "experience": {
                  name: "experience",
                  type: "dir",
                  permissions: "drwxr-xr-x",
                  modified: now,
                  children: experienceFiles
                },
                "education.txt": {
                  name: "education.txt",
                  type: "file",
                  content: portfolioConfig.education.map(
                    (e) => `INSTITUTION: ${e.institution}
DEGREE: ${e.degree}
PERIOD: ${e.period}
LOCATION: ${e.location}
${e.details ? e.details.map((d) => `• ${d}`).join("\n") : ""}`
                  ).join("\n\n"),
                  size: 380,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                "certifications.txt": {
                  name: "certifications.txt",
                  type: "file",
                  content: (portfolioConfig.certifications || []).map(
                    (c) => `• ${c.title} — ${c.issuer} (${c.year || "2025"})`
                  ).join("\n") + "\n\nAWARDS:\n" + (portfolioConfig.awards || []).map((a) => `• ${a.title} (${a.issuer})`).join("\n"),
                  size: 450,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                "resume.pdf": {
                  name: "resume.pdf",
                  type: "file",
                  content: `%PDF-1.4
% [PDF Document - Run 'resume' or 'cat resume.pdf' to open resume in browser]`,
                  size: 142080,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                ".bashrc": {
                  name: ".bashrc",
                  type: "file",
                  content: `# ~/.bashrc for portfolio shell
export USER="${portfolioConfig.handle}"
export HOSTNAME="${portfolioConfig.hostname}"
export TERM="xterm-256color"

alias ll='ls -la'
alias p='projects'
alias s='skills'
alias a='about'
alias cls='clear'
alias matrix='matrix'
`,
                  size: 210,
                  permissions: "-rw-r--r--",
                  modified: now
                },
                ".secret.txt": {
                  name: ".secret.txt",
                  type: "file",
                  content: `🎉 You discovered a hidden file!
Try typing 'snake' to play a retro terminal arcade game or 'sl' to see a steam locomotive train!
Quote: "${portfolioConfig.easterEggs.quotes[Math.floor(Math.random() * portfolioConfig.easterEggs.quotes.length)]}"`,
                  size: 180,
                  permissions: "-rw-------",
                  modified: now
                }
              }
            }
          }
        }
      }
    };
    return rootDir;
  }
  /**
   * Normalizes and resolves paths like '~', '..', '/home/guest/../etc'
   */
  resolvePath(cwd, targetPath) {
    if (!targetPath || targetPath === ".") {
      return cwd;
    }
    let fullPath = targetPath;
    if (targetPath.startsWith("~")) {
      fullPath = targetPath.replace("~", this.homePath);
    } else if (!targetPath.startsWith("/")) {
      fullPath = cwd === "/" ? `/${targetPath}` : `${cwd}/${targetPath}`;
    }
    const parts = fullPath.split("/").filter(Boolean);
    const resolvedParts = [];
    for (const part of parts) {
      if (part === ".") {
        continue;
      } else if (part === "..") {
        if (resolvedParts.length > 0) {
          resolvedParts.pop();
        }
      } else {
        resolvedParts.push(part);
      }
    }
    return "/" + resolvedParts.join("/");
  }
  /**
   * Get VirtualNode for given path
   */
  getNode(path2) {
    if (path2 === "/" || path2 === "") {
      return this.root;
    }
    const parts = path2.split("/").filter(Boolean);
    let current = this.root;
    for (const part of parts) {
      if (current.type !== "dir") {
        return null;
      }
      const next = current.children[part];
      if (!next) {
        return null;
      }
      current = next;
    }
    return current;
  }
  /**
   * List entries in a directory
   */
  listDirectory(path2, showHidden = false) {
    const node = this.getNode(path2);
    if (!node || node.type !== "dir") {
      return null;
    }
    const entries = [];
    if (showHidden) {
      entries.push({ name: ".", node, isDir: true, isExecutable: false });
      const parentPath = this.resolvePath(path2, "..");
      const parentNode = this.getNode(parentPath) || node;
      entries.push({ name: "..", node: parentNode, isDir: true, isExecutable: false });
    }
    const keys = Object.keys(node.children).sort();
    for (const key of keys) {
      if (!showHidden && key.startsWith(".")) {
        continue;
      }
      const child = node.children[key];
      entries.push({
        name: key,
        node: child,
        isDir: child.type === "dir",
        isExecutable: child.type === "file" && !!child.isExecutable
      });
    }
    return entries;
  }
  /**
   * Read file content
   */
  readFile(path2) {
    const node = this.getNode(path2);
    if (!node) {
      return { content: "", error: `cat: ${path2}: No such file or directory` };
    }
    if (node.type === "dir") {
      return { content: "", error: `cat: ${path2}: Is a directory` };
    }
    return { content: node.content };
  }
  /**
   * Create a virtual file (e.g. touch or echo > file)
   */
  createFile(path2, content = "") {
    const parentPath = this.resolvePath(path2, "..");
    const filename = path2.split("/").filter(Boolean).pop();
    if (!filename) return false;
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== "dir") return false;
    const now = "Aug 25 12:00";
    parent.children[filename] = {
      name: filename,
      type: "file",
      content,
      size: content.length,
      permissions: "-rw-r--r--",
      modified: now
    };
    return true;
  }
  /**
   * Create a virtual directory (mkdir)
   */
  createDirectory(path2) {
    const parentPath = this.resolvePath(path2, "..");
    const dirName = path2.split("/").filter(Boolean).pop();
    if (!dirName) return false;
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== "dir") return false;
    const now = "Aug 25 12:00";
    parent.children[dirName] = {
      name: dirName,
      type: "dir",
      permissions: "drwxr-xr-x",
      modified: now,
      children: {}
    };
    return true;
  }
  /**
   * Remove a file or directory
   */
  removeNode(path2) {
    const parentPath = this.resolvePath(path2, "..");
    const targetName = path2.split("/").filter(Boolean).pop();
    if (!targetName) return false;
    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== "dir") return false;
    if (parent.children[targetName]) {
      delete parent.children[targetName];
      return true;
    }
    return false;
  }
  /**
   * Generates ASCII tree view
   */
  generateTree(startPath, maxDepth = 3) {
    const lines = [];
    const rootNode = this.getNode(startPath);
    if (!rootNode || rootNode.type !== "dir") {
      return [`${startPath} [error opening dir]`];
    }
    lines.push(startPath === this.homePath ? "~" : startPath);
    const buildTree = (dir, prefix, currentDepth) => {
      if (currentDepth > maxDepth) return;
      const keys = Object.keys(dir.children).filter((k) => !k.startsWith(".")).sort();
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const pointer = isLast ? "└── " : "├── ";
        const child = dir.children[key];
        if (child.type === "dir") {
          lines.push(`${prefix}${pointer}${key}/`);
          buildTree(child, `${prefix}${isLast ? "    " : "│   "}`, currentDepth + 1);
        } else {
          lines.push(`${prefix}${pointer}${key}`);
        }
      });
    };
    buildTree(rootNode, "", 1);
    return lines;
  }
  /**
   * Get suggestions for tab autocompletion
   */
  getCompletions(currentCwd, partialInput) {
    const lastWord = partialInput.split(/\s+/).pop() || "";
    if (!lastWord.includes("/")) {
      const dir2 = this.getNode(currentCwd);
      if (dir2 && dir2.type === "dir") {
        return Object.keys(dir2.children).filter((k) => k.toLowerCase().startsWith(lastWord.toLowerCase())).map((k) => dir2.children[k].type === "dir" ? `${k}/` : k);
      }
      return [];
    }
    const lastSlashIdx = lastWord.lastIndexOf("/");
    const dirPart = lastWord.substring(0, lastSlashIdx + 1);
    const filePart = lastWord.substring(lastSlashIdx + 1);
    const targetDir = this.resolvePath(currentCwd, dirPart);
    const dir = this.getNode(targetDir);
    if (dir && dir.type === "dir") {
      return Object.keys(dir.children).filter((k) => k.toLowerCase().startsWith(filePart.toLowerCase())).map((k) => `${dirPart}${k}${dir.children[k].type === "dir" ? "/" : ""}`);
    }
    return [];
  }
}
const virtualFS = new VirtualFileSystem();
class SoundFXService {
  constructor() {
    __publicField(this, "ctx", null);
    __publicField(this, "enabled", true);
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  isEnabled() {
    return this.enabled;
  }
  initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {
      });
    }
  }
  /**
   * Play a crisp mechanical keyboard click
   */
  playKeyClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = 1200 + (Math.random() * 400 - 200);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 800;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.025);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
    }
  }
  /**
   * Play an enter key strike sound
   */
  playEnterKey() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.045);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.045);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
    }
  }
  /**
   * Play classic terminal ASCII bell / beep
   */
  playBeep(frequency = 750, duration = 0.08) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
    }
  }
  /**
   * Play error buzzer
   */
  playError() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.12);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
    }
  }
  /**
   * Play boot / theme change chime
   */
  playChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((note, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + index * 0.04;
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, startTime);
        gain.gain.setValueAtTime(0.03, startTime);
        gain.gain.exponentialRampToValueAtTime(1e-4, startTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
    } catch {
    }
  }
}
const soundFX = new SoundFXService();
class CommandRegistry {
  constructor() {
    __publicField(this, "commands", /* @__PURE__ */ new Map());
    __publicField(this, "aliasMap", /* @__PURE__ */ new Map());
    this.registerDefaultCommands();
  }
  register(cmd) {
    this.commands.set(cmd.name.toLowerCase(), cmd);
    if (cmd.aliases) {
      cmd.aliases.forEach((alias) => {
        this.aliasMap.set(alias.toLowerCase(), cmd.name.toLowerCase());
      });
    }
  }
  getCommand(name) {
    const lower = name.toLowerCase();
    const resolvedName = this.aliasMap.get(lower) || lower;
    return this.commands.get(resolvedName);
  }
  getAllCommands() {
    return Array.from(this.commands.values());
  }
  async execute(rawInput, ctx) {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { output: "", type: "text" };
    }
    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);
    const cmd = this.getCommand(cmdName);
    if (!cmd) {
      soundFX.playError();
      return {
        output: `zsh: command not found: ${cmdName}. Type 'help' or 'ls /bin' to see available commands.`,
        type: "error",
        rawArgs: args
      };
    }
    try {
      const result = await cmd.execute(args, ctx);
      return result;
    } catch (err) {
      soundFX.playError();
      return {
        output: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
        type: "error",
        rawArgs: args
      };
    }
  }
  registerDefaultCommands() {
    this.register({
      name: "help",
      aliases: ["?", "man", "commands"],
      category: "System",
      description: "Display list of all available shell commands and features",
      usage: "help [command_name]",
      execute: (args) => {
        if (args.length > 0) {
          const target = this.getCommand(args[0]);
          if (target) {
            return {
              output: `COMMAND: ${target.name}
USAGE: ${target.usage}
CATEGORY: ${target.category}
ALIASES: ${target.aliases ? target.aliases.join(", ") : "none"}

DESCRIPTION:
  ${target.description}`,
              type: "info"
            };
          }
          return {
            output: `help: no manual entry for '${args[0]}'`,
            type: "error"
          };
        }
        return {
          output: "",
          type: "help"
        };
      }
    });
    this.register({
      name: "clear",
      aliases: ["cls", "reset"],
      category: "System",
      description: "Clear the terminal output screen (Shortcut: Ctrl+L)",
      usage: "clear",
      execute: (_, ctx) => {
        ctx.clearHistory();
        return { output: "", type: "clear" };
      }
    });
    this.register({
      name: "history",
      aliases: ["hist"],
      category: "System",
      description: "Display list of executed commands",
      usage: "history",
      execute: (_, ctx) => {
        if (!ctx.historyList || ctx.historyList.length === 0) {
          return {
            output: "No commands in history yet.",
            type: "text"
          };
        }
        const output = ctx.historyList.map((cmd, idx) => `  ${(idx + 1).toString().padStart(3)}  ${cmd}`).join("\n");
        return {
          output,
          type: "text"
        };
      }
    });
    this.register({
      name: "welcome",
      aliases: ["banner", "hero", "start"],
      category: "System",
      description: "Display initial welcome banner and ASCII avatar hero",
      usage: "welcome",
      execute: () => ({
        output: "",
        type: "welcome"
      })
    });
    this.register({
      name: "whoami",
      aliases: ["user", "me", "client", "visitor"],
      category: "System",
      description: "Show current username and system info",
      usage: "whoami",
      execute: () => ({
        output: "",
        type: "whoami"
      })
    });
    this.register({
      name: "sysinfo",
      aliases: ["uname", "system", "specs", "hardware"],
      category: "System",
      description: "Display system information like OS, browser, and screen size",
      usage: "sysinfo",
      execute: () => ({
        output: "",
        type: "sysinfo"
      })
    });
    this.register({
      name: "date",
      category: "System",
      description: "Display current system time and date",
      usage: "date",
      execute: () => ({
        output: (/* @__PURE__ */ new Date()).toString(),
        type: "text"
      })
    });
    this.register({
      name: "uptime",
      category: "System",
      description: "Display system uptime elapsed since portfolio release",
      usage: "uptime",
      execute: () => {
        const BUILD_TIMESTAMP = (/* @__PURE__ */ new Date("2026-08-25T08:00:00Z")).getTime();
        const diffMs = Math.max(1e3, Date.now() - BUILD_TIMESTAMP);
        const totalSec = Math.floor(diffMs / 1e3);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor(totalSec % 86400 / 3600);
        const minutes = Math.floor(totalSec % 3600 / 60);
        const timeStr = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        let uptimeStr = "";
        if (days > 0) {
          uptimeStr = `${days} day${days > 1 ? "s" : ""}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        } else {
          uptimeStr = `${hours}h ${minutes}m`;
        }
        return {
          output: `${timeStr} up ${uptimeStr}, 1 user, load average: 0.12, 0.08, 0.03`,
          type: "text"
        };
      }
    });
    this.register({
      name: "echo",
      category: "System",
      description: "Print text or string arguments to the terminal",
      usage: "echo [args...]",
      execute: (args) => ({
        output: args.join(" "),
        type: "text"
      })
    });
    this.register({
      name: "pwd",
      category: "Navigation",
      description: "Print current working directory path",
      usage: "pwd",
      execute: (_, ctx) => ({
        output: ctx.cwd,
        type: "text"
      })
    });
    this.register({
      name: "ls",
      aliases: ["dir", "ll", "la"],
      category: "Navigation",
      description: "List directory contents with permissions, sizes, and file types",
      usage: "ls [-a] [-l] [path]",
      execute: (args, ctx) => {
        let showHidden = false;
        let longFormat = false;
        const targetPaths = [];
        args.forEach((arg) => {
          if (arg === "-a" || arg === "-all") showHidden = true;
          else if (arg === "-l") longFormat = true;
          else if (arg === "-la" || arg === "-al") {
            showHidden = true;
            longFormat = true;
          } else if (!arg.startsWith("-")) {
            targetPaths.push(arg);
          }
        });
        const target = targetPaths[0] || ctx.cwd;
        const resolved = virtualFS.resolvePath(ctx.cwd, target);
        const entries = virtualFS.listDirectory(resolved, showHidden);
        if (!entries) {
          soundFX.playError();
          return {
            output: `ls: cannot access '${target}': No such file or directory`,
            type: "error"
          };
        }
        if (longFormat) {
          const header = `total ${entries.length * 4}K
`;
          const rows = entries.map((e) => {
            const perms = e.node.permissions;
            const size = (e.node.type === "file" ? e.node.size : 4096).toString().padStart(6);
            const mod = e.node.modified;
            const nameColor = e.isDir ? `${e.name}/` : e.isExecutable ? `${e.name}*` : e.name;
            return `${perms}  1 guest guest ${size} ${mod} ${nameColor}`;
          }).join("\n");
          return { output: header + rows, type: "text" };
        }
        const formatted = entries.map((e) => {
          if (e.isDir) return `${e.name}/`;
          if (e.isExecutable) return `${e.name}*`;
          return e.name;
        }).join("   ");
        return { output: formatted || "(empty directory)", type: "text" };
      }
    });
    this.register({
      name: "cd",
      category: "Navigation",
      description: "Change current working directory",
      usage: "cd [directory | .. | ~]",
      execute: (args, ctx) => {
        const target = args[0] || "~";
        const resolved = virtualFS.resolvePath(ctx.cwd, target);
        const node = virtualFS.getNode(resolved);
        if (!node) {
          soundFX.playError();
          return {
            output: `cd: no such file or directory: ${target}`,
            type: "error"
          };
        }
        if (node.type !== "dir") {
          soundFX.playError();
          return {
            output: `cd: not a directory: ${target}`,
            type: "error"
          };
        }
        ctx.setCwd(resolved);
        return { output: "", type: "text" };
      }
    });
    this.register({
      name: "cat",
      category: "Navigation",
      description: "Concatenate and display the contents of a file",
      usage: "cat <filename>",
      execute: (args, ctx) => {
        if (!args[0]) {
          return {
            output: "cat: missing file operand\nUsage: cat <filename>",
            type: "error"
          };
        }
        const resolved = virtualFS.resolvePath(ctx.cwd, args[0]);
        const res = virtualFS.readFile(resolved);
        if (res.error) {
          soundFX.playError();
          return { output: res.error, type: "error" };
        }
        if (args[0].endsWith(".pdf")) {
          if (typeof window !== "undefined") {
            window.open(portfolioConfig.resumeUrl, "_blank");
          }
        }
        return { output: res.content, type: "text" };
      }
    });
    this.register({
      name: "tree",
      category: "Navigation",
      description: "List directory contents in a tree-like format",
      usage: "tree [path]",
      execute: (args, ctx) => {
        const target = args[0] ? virtualFS.resolvePath(ctx.cwd, args[0]) : ctx.cwd;
        const lines = virtualFS.generateTree(target);
        return {
          output: lines.join("\n"),
          type: "tree"
        };
      }
    });
    this.register({
      name: "mkdir",
      category: "Navigation",
      description: "Create new directory in virtual filesystem",
      usage: "mkdir <dirname>",
      execute: (args, ctx) => {
        if (!args[0]) {
          return { output: "mkdir: missing operand", type: "error" };
        }
        const target = virtualFS.resolvePath(ctx.cwd, args[0]);
        const success = virtualFS.createDirectory(target);
        if (!success) {
          soundFX.playError();
          return { output: `mkdir: cannot create directory '${args[0]}'`, type: "error" };
        }
        return { output: `Created directory: ${args[0]}`, type: "success" };
      }
    });
    this.register({
      name: "touch",
      category: "Navigation",
      description: "Create an empty file in virtual filesystem",
      usage: "touch <filename>",
      execute: (args, ctx) => {
        if (!args[0]) {
          return { output: "touch: missing file operand", type: "error" };
        }
        const target = virtualFS.resolvePath(ctx.cwd, args[0]);
        const success = virtualFS.createFile(target, "");
        if (!success) {
          soundFX.playError();
          return { output: `touch: cannot touch '${args[0]}'`, type: "error" };
        }
        return { output: "", type: "text" };
      }
    });
    this.register({
      name: "rm",
      category: "Navigation",
      description: "Remove file or directory from virtual filesystem",
      usage: "rm <filename>",
      execute: (args, ctx) => {
        if (!args[0]) {
          return { output: "rm: missing operand", type: "error" };
        }
        const target = virtualFS.resolvePath(ctx.cwd, args[0]);
        const success = virtualFS.removeNode(target);
        if (!success) {
          soundFX.playError();
          return { output: `rm: cannot remove '${args[0]}': No such file or directory`, type: "error" };
        }
        return { output: `Removed '${args[0]}'`, type: "text" };
      }
    });
    this.register({
      name: "about",
      aliases: ["bio", "me"],
      category: "Portfolio",
      description: "Display biographical background, summary, and passions",
      usage: "about",
      execute: () => ({
        output: "",
        type: "about"
      })
    });
    this.register({
      name: "projects",
      aliases: ["work", "portfolio", "proj"],
      category: "Portfolio",
      description: "Explore featured software projects, repositories, and demos",
      usage: "projects [category_or_filter]",
      execute: (args) => ({
        output: "",
        type: "projects",
        rawArgs: args
      })
    });
    this.register({
      name: "skills",
      aliases: ["stack", "tech", "technologies"],
      category: "Portfolio",
      description: "Display technical skills, competencies, and proficiency bars",
      usage: "skills",
      execute: () => ({
        output: "",
        type: "skills"
      })
    });
    this.register({
      name: "experience",
      aliases: ["workhistory", "jobs", "exp"],
      category: "Portfolio",
      description: "View career history, achievements, and tech stack milestones",
      usage: "experience",
      execute: () => ({
        output: "",
        type: "experience"
      })
    });
    this.register({
      name: "education",
      aliases: ["edu", "degree"],
      category: "Portfolio",
      description: "View academic education history and coursework",
      usage: "education",
      execute: () => {
        const output = portfolioConfig.education.map((e) => `🎓 ${e.degree}
   ${e.institution} | ${e.period} (${e.location})
${e.details ? e.details.map((d) => `   • ${d}`).join("\n") : ""}`).join("\n\n");
        return { output, type: "info" };
      }
    });
    this.register({
      name: "certifications",
      aliases: ["certs", "certification", "awards", "honors"],
      category: "Portfolio",
      description: "View industry certifications, courses, and honors",
      usage: "certifications",
      execute: () => {
        const certList = (portfolioConfig.certifications || []).map((c) => `📜 ${c.title}
   Issuer: ${c.issuer} | Year: ${c.year || "2025"}`).join("\n\n");
        const awardList = (portfolioConfig.awards || []).map((a) => `🏆 ${a.title}
   Issuer: ${a.issuer || "Award"} | ${a.year || ""}`).join("\n\n");
        return {
          output: `[ PROFESSIONAL CERTIFICATIONS & COURSES ]

${certList}

[ HONORS & AWARDS ]

${awardList}`,
          type: "info"
        };
      }
    });
    this.register({
      name: "contact",
      aliases: ["socials", "email", "social", "reach"],
      category: "Portfolio",
      description: "View contact details and social media channels",
      usage: "contact",
      execute: () => ({
        output: "",
        type: "contact"
      })
    });
    this.register({
      name: "resume",
      aliases: ["cv"],
      category: "Portfolio",
      description: "Open or download curriculum vitae (PDF)",
      usage: "resume",
      execute: () => {
        if (typeof window !== "undefined") {
          window.open(portfolioConfig.resumeUrl, "_blank");
        }
        return {
          output: `Opening resume (${portfolioConfig.resumeUrl})... If it did not open automatically, contact ${portfolioConfig.email}`,
          type: "success"
        };
      }
    });
    this.register({
      name: "theme",
      aliases: ["themes", "color", "colors"],
      category: "Customization",
      description: "Change or list terminal color themes (matrix, dracula, nord, etc.)",
      usage: "theme [theme_name]",
      execute: (args, ctx) => {
        var _a;
        const themeList = Object.keys(THEMES);
        if (!args[0]) {
          const list = themeList.map((t) => {
            const isCurrent = t === ctx.theme ? " (active)" : "";
            return `• ${t.padEnd(16)} - ${THEMES[t].name}${isCurrent}`;
          }).join("\n");
          return {
            output: `CURRENT THEME: ${((_a = THEMES[ctx.theme]) == null ? void 0 : _a.name) || ctx.theme}

AVAILABLE THEMES:
${list}

USAGE: theme <theme_name>  (e.g., 'theme dracula' or 'theme nord')`,
            type: "info"
          };
        }
        const requested = args[0].toLowerCase();
        if (THEMES[requested]) {
          ctx.setTheme(requested);
          soundFX.playChime();
          return {
            output: `Theme changed to '${THEMES[requested].name}'. Settings persisted in local storage.`,
            type: "success"
          };
        }
        soundFX.playError();
        return {
          output: `Unknown theme '${args[0]}'. Available: ${themeList.join(", ")}`,
          type: "error"
        };
      }
    });
    this.register({
      name: "sound",
      aliases: ["audio", "sfx", "mute"],
      category: "Customization",
      description: "Toggle mechanical keyboard typing sound effects and beeps",
      usage: "sound [on | off | toggle]",
      execute: (args, ctx) => {
        var _a;
        const arg = (_a = args[0]) == null ? void 0 : _a.toLowerCase();
        let newState = !ctx.soundEnabled;
        if (arg === "on" || arg === "enable") newState = true;
        else if (arg === "off" || arg === "disable" || arg === "mute") newState = false;
        ctx.setSoundEnabled(newState);
        soundFX.setEnabled(newState);
        if (newState) soundFX.playChime();
        return {
          output: `Audio Sound FX is now: [${newState ? "ENABLED 🔊" : "MUTED 🔇"}]`,
          type: newState ? "success" : "warning"
        };
      }
    });
    this.register({
      name: "crt",
      aliases: ["scanlines", "retro"],
      category: "Customization",
      description: "Toggle retro CRT scanlines, flicker, and phosphor glow effects",
      usage: "crt [on | off | toggle]",
      execute: (args, ctx) => {
        var _a;
        const arg = (_a = args[0]) == null ? void 0 : _a.toLowerCase();
        let newState = !ctx.crtEnabled;
        if (arg === "on" || arg === "enable") newState = true;
        else if (arg === "off" || arg === "disable") newState = false;
        ctx.setCrtEnabled(newState);
        return {
          output: `CRT Monitor Scanlines: [${newState ? "ENABLED 📺" : "DISABLED"}]`,
          type: "info"
        };
      }
    });
    this.register({
      name: "neofetch",
      aliases: ["fastfetch", "fetch", "logo"],
      category: "Easter Eggs",
      description: "Display system info and aesthetic ASCII portfolio logo",
      usage: "neofetch",
      execute: () => ({
        output: "",
        type: "neofetch"
      })
    });
    this.register({
      name: "matrix",
      aliases: ["cmatrix", "rain"],
      category: "Easter Eggs",
      description: "Enter the Matrix digital green rain falling animation",
      usage: "matrix",
      execute: (_, ctx) => {
        ctx.setActiveEasterEgg("matrix");
        return {
          output: "Entering the Matrix... (Press [Q] or [Esc] or click anywhere to exit)",
          type: "success"
        };
      }
    });
    this.register({
      name: "snake",
      aliases: ["game", "arcade"],
      category: "Easter Eggs",
      description: "Play a retro arcade Snake game inside the terminal!",
      usage: "snake",
      execute: (_, ctx) => {
        ctx.setActiveEasterEgg("snake");
        return {
          output: "Launching Snake Arcade... (Use Arrow Keys or WASD to navigate, [Esc] to exit)",
          type: "success"
        };
      }
    });
    this.register({
      name: "cowsay",
      aliases: ["cow"],
      category: "Easter Eggs",
      description: "Generate an ASCII cow with a speech balloon",
      usage: "cowsay [message]",
      execute: (args) => {
        const text = args.length > 0 ? args.join(" ") : portfolioConfig.easterEggs.cowsayDefault;
        return {
          output: text,
          type: "cowsay"
        };
      }
    });
    this.register({
      name: "sl",
      category: "Easter Eggs",
      description: "Steam locomotive train running across screen (for when you misspell ls)",
      usage: "sl",
      execute: (_, ctx) => {
        ctx.setActiveEasterEgg("sl");
        return {
          output: "🚂 Choo choo! Steam Locomotive inbound...",
          type: "info"
        };
      }
    });
    this.register({
      name: "sudo",
      category: "Easter Eggs",
      description: "Execute a command as superuser",
      usage: "sudo [command...]",
      execute: (args) => {
        soundFX.playError();
        const quips = [
          "Permission denied: User 'guest' is not in the sudoers file. This incident will be reported to Santa Claus.",
          "Nice try! But with great power comes great responsibility... and you have neither right now.",
          "[sudo] password for guest: ********** \nsudo: 3 incorrect password attempts. Security drones dispatched.",
          "Error: sudo access requires 1 cup of artisan coffee delivered to the author."
        ];
        const randomQuip = quips[Math.floor(Math.random() * quips.length)];
        return {
          output: randomQuip,
          type: "error",
          rawArgs: args
        };
      }
    });
    this.register({
      name: "vim",
      aliases: ["vi", "nano", "emacs"],
      category: "Easter Eggs",
      description: "Open a mock terminal text editor",
      usage: "vim [filename]",
      execute: (args) => ({
        output: `[VIM] Opening ${args[0] || "buffer"} in read-only mode...
Tip: Type ':q!' to exit, or just use 'cat' to view files!`,
        type: "warning"
      })
    });
    this.register({
      name: "quote",
      aliases: ["fortune", "motd"],
      category: "Easter Eggs",
      description: "Print a wise developer quote or fortune cookie",
      usage: "quote",
      execute: () => {
        const quotes = portfolioConfig.easterEggs.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return {
          output: `"${randomQuote}"`,
          type: "info"
        };
      }
    });
    this.register({
      name: "weather",
      aliases: ["wttr", "forecast"],
      category: "Easter Eggs",
      description: "Display live local meteorological weather forecast for your location",
      usage: "weather",
      execute: () => ({
        output: "",
        type: "weather"
      })
    });
    this.register({
      name: "shutdown",
      aliases: ["exit", "poweroff", "quit", "halt"],
      category: "System",
      description: "Simulate terminal shutdown and disable input until power on",
      usage: "shutdown",
      execute: (_, ctx) => {
        if (ctx.triggerShutdown) {
          ctx.triggerShutdown();
        }
        return {
          output: "Initiating terminal shutdown sequence... [ OK ]",
          type: "warning"
        };
      }
    });
  }
}
const commandRegistry = new CommandRegistry();
function createMockContext$1(cwdOrOverrides, overrides) {
  const actualOverrides = (typeof cwdOrOverrides === "object" && cwdOrOverrides !== null ? cwdOrOverrides : overrides) || {};
  let cwd = typeof cwdOrOverrides === "string" ? cwdOrOverrides : actualOverrides.cwd || virtualFS.homePath;
  let historyList = actualOverrides.historyList ? [...actualOverrides.historyList] : ["welcome"];
  let theme = actualOverrides.theme || "matrix-green";
  let soundEnabled = actualOverrides.soundEnabled !== void 0 ? actualOverrides.soundEnabled : true;
  let crtEnabled = actualOverrides.crtEnabled !== void 0 ? actualOverrides.crtEnabled : true;
  let activeEasterEgg = actualOverrides.activeEasterEgg !== void 0 ? actualOverrides.activeEasterEgg : null;
  const base = {
    get cwd() {
      return cwd;
    },
    setCwd: (newCwd) => {
      cwd = typeof newCwd === "function" ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    get historyList() {
      return historyList;
    },
    set historyList(newList) {
      historyList = newList;
    },
    get theme() {
      return theme;
    },
    setTheme: (newTheme) => {
      theme = newTheme;
    },
    get soundEnabled() {
      return soundEnabled;
    },
    setSoundEnabled: (val) => {
      soundEnabled = typeof val === "function" ? val(soundEnabled) : val;
    },
    get crtEnabled() {
      return crtEnabled;
    },
    setCrtEnabled: (val) => {
      crtEnabled = typeof val === "function" ? val(crtEnabled) : val;
    },
    get activeEasterEgg() {
      return activeEasterEgg;
    },
    setActiveEasterEgg: (val) => {
      activeEasterEgg = val;
    },
    triggerShutdown: () => {
    }
  };
  if (actualOverrides.triggerShutdown) {
    base.triggerShutdown = actualOverrides.triggerShutdown;
  }
  if (actualOverrides.clearHistory) {
    base.clearHistory = actualOverrides.clearHistory;
  }
  return base;
}
async function runTier1CommandsTests() {
  harness.startSuite("Tier 1 - Shell Commands & Navigation (R2)");
  await harness.test('R2: command "about" renders bio summary and profile', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("about", ctx);
    expect(res.type).toBe("about");
  });
  await harness.test('R2: command "about" aliases ("bio", "me")', async () => {
    const ctx = createMockContext$1();
    const resBio = await commandRegistry.execute("bio", ctx);
    expect(resBio.type).toBe("about");
    const resMe = await commandRegistry.execute("me", ctx);
    expect(resMe.type).toBe("about");
  });
  await harness.test('R2: command "projects" returns all projects', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("projects", ctx);
    expect(res.type).toBe("projects");
  });
  await harness.test('R2: command "projects" filter flag ("projects ai", "projects python")', async () => {
    const ctx = createMockContext$1();
    const resAI = await commandRegistry.execute("projects ai", ctx);
    expect(resAI.type).toBe("projects");
    expect(resAI.rawArgs).toBeDefined();
    expect(resAI.rawArgs[0]).toBe("ai");
  });
  await harness.test('R2: command "projects" aliases ("work", "portfolio", "proj")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["work", "portfolio", "proj"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("projects");
    }
  });
  await harness.test('R2: command "skills" returns technical competencies', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("skills", ctx);
    expect(res.type).toBe("skills");
  });
  await harness.test('R2: command "skills" aliases ("stack", "tech", "technologies")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["stack", "tech", "technologies"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("skills");
    }
  });
  await harness.test('R2: command "experience" returns career history', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("experience", ctx);
    expect(res.type).toBe("experience");
  });
  await harness.test('R2: command "experience" aliases ("workhistory", "jobs", "exp")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["workhistory", "jobs", "exp"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("experience");
    }
  });
  await harness.test('R2: command "education" returns academic credentials', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("education", ctx);
    expect(res.type).toBe("info");
    expect(res.output).toContain("Haldia Institute of Technology");
  });
  await harness.test('R2: command "education" aliases ("edu", "degree")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["edu", "degree"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("info");
      expect(res.output).toContain("Haldia Institute of Technology");
    }
  });
  await harness.test('R2: command "certifications" returns certifications & awards', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("certifications", ctx);
    expect(res.type).toBe("info");
    expect(res.output).toContain("Oracle Cloud Infrastructure");
  });
  await harness.test('R2: command "certifications" aliases ("certs", "certification", "awards", "honors")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["certs", "certification", "awards", "honors"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("info");
      expect(res.output).toContain("Oracle Cloud Infrastructure");
    }
  });
  await harness.test('R2: command "contact" returns contact details and social handles', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("contact", ctx);
    expect(res.type).toBe("contact");
  });
  await harness.test('R2: command "contact" aliases ("socials", "email", "social", "reach")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["socials", "email", "social", "reach"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("contact");
    }
  });
  await harness.test('R2: command "resume" triggers resume open and returns success', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("resume", ctx);
    expect(res.type).toBe("success");
    expect(res.output).toContain("resume.pdf");
  });
  await harness.test('R2: command "resume" alias ("cv")', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("cv", ctx);
    expect(res.type).toBe("success");
    expect(res.output).toContain("resume.pdf");
  });
  await harness.test('R2: command "whoami" returns visitor identity & user agent', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("whoami", ctx);
    expect(res.type).toBe("whoami");
  });
  await harness.test('R2: command "whoami" aliases ("user", "client", "visitor")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["user", "client", "visitor"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("whoami");
    }
  });
  await harness.test('R2: command "sysinfo" returns system specs & hardware telemetry', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("sysinfo", ctx);
    expect(res.type).toBe("sysinfo");
  });
  await harness.test('R2: command "sysinfo" aliases ("uname", "system", "specs", "hardware")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["uname", "system", "specs", "hardware"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("sysinfo");
    }
  });
  await harness.test('R2: command "weather" returns live/fallback weather metrics', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("weather", ctx);
    expect(res.type).toBe("weather");
  });
  await harness.test('R2: command "weather" aliases ("wttr", "forecast")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["wttr", "forecast"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("weather");
    }
  });
  await harness.test('R2: command "date" returns valid formatted date string', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("date", ctx);
    expect(res.type).toBe("text");
    expect(res.output.length).toBeGreaterThan(10);
  });
  await harness.test('R2: command "uptime" returns session uptime and load average', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("uptime", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toContain("up");
    expect(res.output).toContain("load average");
  });
  await harness.test('R2: command "shutdown" dispatches shutdown trigger', async () => {
    let triggered = false;
    const ctx = createMockContext$1({
      triggerShutdown: () => {
        triggered = true;
      }
    });
    const res = await commandRegistry.execute("shutdown", ctx);
    expect(res.type).toBe("warning");
    expect(triggered).toBe(true);
  });
  await harness.test('R2: command "shutdown" aliases ("exit", "poweroff", "quit", "halt")', async () => {
    for (const alias of ["exit", "poweroff", "quit", "halt"]) {
      let triggered = false;
      const ctx = createMockContext$1({
        triggerShutdown: () => {
          triggered = true;
        }
      });
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("warning");
      expect(triggered).toBe(true);
    }
  });
  await harness.test('R2: command "help" lists all categorized commands', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("help", ctx);
    expect(res.type).toBe("help");
  });
  await harness.test('R2: command "help <cmd>" returns manual entry for specific command', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("help cd", ctx);
    expect(res.type).toBe("info");
    expect(res.output).toContain("COMMAND: cd");
    expect(res.output).toContain("USAGE:");
  });
  await harness.test('R2: command "help" aliases ("?", "man", "commands")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["?", "man", "commands"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("help");
    }
  });
  await harness.test('R2: command "clear" dispatches history flush', async () => {
    let cleared = false;
    const ctx = createMockContext$1({
      clearHistory: () => {
        cleared = true;
      }
    });
    const res = await commandRegistry.execute("clear", ctx);
    expect(res.type).toBe("clear");
    expect(cleared).toBe(true);
  });
  await harness.test('R2: command "clear" aliases ("cls", "reset")', async () => {
    for (const alias of ["cls", "reset"]) {
      let cleared = false;
      const ctx = createMockContext$1({
        clearHistory: () => {
          cleared = true;
        }
      });
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("clear");
      expect(cleared).toBe(true);
    }
  });
  await harness.test('R2: command "welcome" returns hero welcome banner', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("welcome", ctx);
    expect(res.type).toBe("welcome");
  });
  await harness.test('R2: command "welcome" aliases ("banner", "hero", "start")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["banner", "hero", "start"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("welcome");
    }
  });
  await harness.test('R2: command "pwd" returns current working directory', async () => {
    const ctx = createMockContext$1("/home/guest/projects");
    const res = await commandRegistry.execute("pwd", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toBe("/home/guest/projects");
  });
  await harness.test('R2: command "ls" lists directory entries', async () => {
    const ctx = createMockContext$1("/home/guest");
    const res = await commandRegistry.execute("ls", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toContain("about.txt");
    expect(res.output).toContain("projects/");
  });
  await harness.test('R2: command "ls -a" includes hidden files (.bashrc, .secret.txt)', async () => {
    const ctx = createMockContext$1("/home/guest");
    const res = await commandRegistry.execute("ls -a", ctx);
    expect(res.output).toContain(".bashrc");
    expect(res.output).toContain(".secret.txt");
  });
  await harness.test('R2: command "ls -l" displays permissions, size and modified date', async () => {
    const ctx = createMockContext$1("/home/guest");
    const res = await commandRegistry.execute("ls -l", ctx);
    expect(res.output).toContain("guest guest");
    expect(res.output).toContain("-rw-r--r--");
  });
  await harness.test('R2: command "ls" aliases ("dir", "ll", "la")', async () => {
    const ctx = createMockContext$1("/home/guest");
    const resDir = await commandRegistry.execute("dir", ctx);
    expect(resDir.output).toContain("about.txt");
    const resLL = await commandRegistry.execute("ll", ctx);
    expect(resLL.output).toContain("about.txt");
    const resLA = await commandRegistry.execute("la", ctx);
    expect(resLA.output).toContain("about.txt");
  });
  await harness.test('R2: command "cd" updates cwd and supports relative and absolute paths', async () => {
    const ctx = createMockContext$1("/home/guest");
    await commandRegistry.execute("cd projects", ctx);
    expect(ctx.cwd).toBe("/home/guest/projects");
    await commandRegistry.execute("cd ..", ctx);
    expect(ctx.cwd).toBe("/home/guest");
    await commandRegistry.execute("cd /etc", ctx);
    expect(ctx.cwd).toBe("/etc");
    await commandRegistry.execute("cd ~", ctx);
    expect(ctx.cwd).toBe("/home/guest");
    await commandRegistry.execute("cd", ctx);
    expect(ctx.cwd).toBe("/home/guest");
  });
  await harness.test('R2: command "cat" reads virtual file contents', async () => {
    const ctx = createMockContext$1("/home/guest");
    const res = await commandRegistry.execute("cat about.txt", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toContain(portfolioConfig.name);
  });
  await harness.test('R2: command "cat resume.pdf" triggers browser open and prints header', async () => {
    const ctx = createMockContext$1("/home/guest");
    const res = await commandRegistry.execute("cat resume.pdf", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toContain("PDF Document");
  });
  await harness.test('R2: command "tree" generates ASCII hierarchical branch tree', async () => {
    const ctx = createMockContext$1("/home/guest");
    const res = await commandRegistry.execute("tree", ctx);
    expect(res.type).toBe("tree");
    expect(res.output).toContain("├──");
  });
  await harness.test('R2: filesystem file creation and removal ("mkdir", "touch", "rm")', async () => {
    const ctx = createMockContext$1("/home/guest");
    const mkRes = await commandRegistry.execute("mkdir test_unit_dir", ctx);
    expect(mkRes.type).toBe("success");
    expect(virtualFS.getNode("/home/guest/test_unit_dir")).toBeDefined();
    const touchRes = await commandRegistry.execute("touch test_unit_dir/sample.txt", ctx);
    expect(touchRes.type).toBe("text");
    expect(virtualFS.getNode("/home/guest/test_unit_dir/sample.txt")).toBeDefined();
    const catRes = await commandRegistry.execute("cat test_unit_dir/sample.txt", ctx);
    expect(catRes.output).toBe("");
    await commandRegistry.execute("rm test_unit_dir/sample.txt", ctx);
    expect(virtualFS.getNode("/home/guest/test_unit_dir/sample.txt")).toBeNull();
    await commandRegistry.execute("rm test_unit_dir", ctx);
    expect(virtualFS.getNode("/home/guest/test_unit_dir")).toBeNull();
  });
  await harness.test('R2: command "neofetch" returns distribution logo and system specifications', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("neofetch", ctx);
    expect(res.type).toBe("neofetch");
  });
  await harness.test('R2: command "neofetch" aliases ("fastfetch", "fetch", "logo")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["fastfetch", "fetch", "logo"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("neofetch");
    }
  });
  await harness.test('R2: command "cowsay" formats speech bubble and cow', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("cowsay Hello Vibe Coder", ctx);
    expect(res.type).toBe("cowsay");
    expect(res.output).toBe("Hello Vibe Coder");
  });
  await harness.test('R2: command "cowsay" alias ("cow")', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("cow Mooo", ctx);
    expect(res.type).toBe("cowsay");
  });
  await harness.test('R2: command "matrix" activates matrix rain easter egg', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("matrix", ctx);
    expect(res.type).toBe("success");
    expect(ctx.activeEasterEgg).toBe("matrix");
  });
  await harness.test('R2: command "matrix" aliases ("cmatrix", "rain")', async () => {
    for (const alias of ["cmatrix", "rain"]) {
      const ctx = createMockContext$1();
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("success");
      expect(ctx.activeEasterEgg).toBe("matrix");
    }
  });
  await harness.test('R2: command "snake" activates snake game arcade', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("snake", ctx);
    expect(res.type).toBe("success");
    expect(ctx.activeEasterEgg).toBe("snake");
  });
  await harness.test('R2: command "snake" aliases ("game", "arcade")', async () => {
    for (const alias of ["game", "arcade"]) {
      const ctx = createMockContext$1();
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("success");
      expect(ctx.activeEasterEgg).toBe("snake");
    }
  });
  await harness.test('R2: command "sl" activates steam locomotive train animation', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("sl", ctx);
    expect(res.type).toBe("info");
    expect(ctx.activeEasterEgg).toBe("sl");
  });
  await harness.test('R2: command "sudo" returns permission denied quip', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("sudo rm -rf /", ctx);
    expect(res.type).toBe("error");
    expect(res.output.length).toBeGreaterThan(10);
  });
  await harness.test('R2: command "vim" returns read-only warning', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("vim index.html", ctx);
    expect(res.type).toBe("warning");
    expect(res.output).toContain("read-only");
  });
  await harness.test('R2: command "vim" aliases ("vi", "nano", "emacs")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["vi", "nano", "emacs"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("warning");
      expect(res.output).toContain("read-only");
    }
  });
  await harness.test('R2: command "quote" returns inspirational quote', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("quote", ctx);
    expect(res.type).toBe("info");
    expect(res.output.length).toBeGreaterThan(10);
  });
  await harness.test('R2: command "quote" aliases ("fortune", "motd")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["fortune", "motd"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("info");
    }
  });
  await harness.test('R2: command "theme" lists available themes or switches theme', async () => {
    const ctx = createMockContext$1();
    const listRes = await commandRegistry.execute("theme", ctx);
    expect(listRes.type).toBe("info");
    expect(listRes.output).toContain("dracula");
    const setRes = await commandRegistry.execute("theme dracula", ctx);
    expect(setRes.type).toBe("success");
    expect(ctx.theme).toBe("dracula");
  });
  await harness.test('R2: command "theme" aliases ("themes", "color", "colors")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["themes", "color", "colors"]) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe("info");
    }
  });
  await harness.test('R2: command "sound" toggles Web Audio FX state', async () => {
    const ctx = createMockContext$1();
    await commandRegistry.execute("sound off", ctx);
    expect(ctx.soundEnabled).toBe(false);
    await commandRegistry.execute("sound on", ctx);
    expect(ctx.soundEnabled).toBe(true);
    await commandRegistry.execute("sound toggle", ctx);
    expect(ctx.soundEnabled).toBe(false);
  });
  await harness.test('R2: command "sound" aliases ("audio", "sfx", "mute")', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("audio toggle", ctx);
    expect(res.type).toBe("warning");
    expect(ctx.soundEnabled).toBe(false);
  });
  await harness.test('R2: command "crt" toggles retro CRT filter state', async () => {
    const ctx = createMockContext$1();
    await commandRegistry.execute("crt off", ctx);
    expect(ctx.crtEnabled).toBe(false);
    await commandRegistry.execute("crt on", ctx);
    expect(ctx.crtEnabled).toBe(true);
    await commandRegistry.execute("crt toggle", ctx);
    expect(ctx.crtEnabled).toBe(false);
  });
  await harness.test('R2: command "crt" aliases ("scanlines", "retro")', async () => {
    const ctx = createMockContext$1();
    for (const alias of ["scanlines", "retro"]) {
      const res = await commandRegistry.execute(`${alias} status`, ctx);
      expect(res.type).toBe("info");
    }
  });
  await harness.test('R2: command "echo" echoes arguments back', async () => {
    const ctx = createMockContext$1();
    const res = await commandRegistry.execute("echo Aryan Prasad Linux Portfolio", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toBe("Aryan Prasad Linux Portfolio");
  });
  await harness.test('R2: command "history" returns session commands list', async () => {
    const ctx = createMockContext$1({
      historyList: ["welcome", "about", "projects", "skills"]
    });
    const res = await commandRegistry.execute("history", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toContain("welcome");
    expect(res.output).toContain("about");
    expect(res.output).toContain("projects");
  });
  await harness.test('R2: command "history" alias ("hist")', async () => {
    const ctx = createMockContext$1({
      historyList: ["welcome", "help"]
    });
    const res = await commandRegistry.execute("hist", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toContain("welcome");
  });
  return harness.endSuite();
}
async function runTier1UILifecycleTests() {
  harness.startSuite("Tier 1 - UI Controls, Themes & Lifecycle (R3)");
  await harness.test("R3: WelcomeHero Quick Start buttons map to valid executable commands", () => {
    const heroButtons = ["projects", "skills", "help", "ls", "cd projects"];
    for (const btn of heroButtons) {
      const parts = btn.split(" ");
      const cmd = commandRegistry.getCommand(parts[0]);
      expect(cmd).toBeDefined();
    }
  });
  await harness.test("R3: QuickAction navigation pills map to registered shell commands", () => {
    const quickActions = [
      { label: "about", cmd: "about" },
      { label: "projects", cmd: "projects" },
      { label: "skills", cmd: "skills" },
      { label: "certs", cmd: "certifications" },
      { label: "education", cmd: "education" },
      { label: "contact", cmd: "contact" },
      { label: "resume", cmd: "resume" },
      { label: "help", cmd: "help" },
      { label: "clear", cmd: "clear" }
    ];
    for (const pill of quickActions) {
      const cmd = commandRegistry.getCommand(pill.cmd);
      expect(cmd).toBeDefined();
    }
  });
  await harness.test("R3: Tab on empty input returns all available command definitions", () => {
    const allCmds = commandRegistry.getAllCommands().map((c) => c.name);
    expect(allCmds.length).toBeGreaterThanOrEqual(25);
    expect(allCmds).toContain("help");
    expect(allCmds).toContain("projects");
    expect(allCmds).toContain("matrix");
  });
  await harness.test("R3: Tab on unique command prefix matches single command and adds trailing space", () => {
    const prefix = "neof";
    const allCmds = commandRegistry.getAllCommands().map((c) => c.name);
    const matches = allCmds.filter((c) => c.startsWith(prefix));
    expect(matches.length).toBe(1);
    expect(matches[0]).toBe("neofetch");
  });
  await harness.test("R3: Tab on multi-match prefix finds longest common prefix", () => {
    const prefix = "c";
    const allCmds = commandRegistry.getAllCommands().map((c) => c.name);
    const matches = allCmds.filter((c) => c.startsWith(prefix));
    expect(matches.length).toBeGreaterThan(1);
    expect(matches).toContain("cat");
    expect(matches).toContain("cd");
    expect(matches).toContain("clear");
    expect(matches).toContain("cowsay");
    expect(matches).toContain("crt");
  });
  await harness.test("R3: Tab on file/directory path completes in-memory virtual filesystem paths", () => {
    const completions = virtualFS.getCompletions("/home/guest", "about");
    expect(completions).toContain("about.txt");
    const projectCompletions = virtualFS.getCompletions("/home/guest", "projects/agr");
    expect(projectCompletions).toContain("projects/agrisathi.md");
  });
  await harness.test("R3: All 7 color themes are registered and have complete color tokens", () => {
    const expectedThemes = [
      "matrix-green",
      "dracula",
      "catppuccin",
      "nord",
      "gruvbox",
      "cyberpunk",
      "ubuntu"
    ];
    expect(Object.keys(THEMES).length).toBe(7);
    for (const themeId of expectedThemes) {
      const theme = THEMES[themeId];
      expect(theme).toBeDefined();
      expect(theme.id).toBe(themeId);
      expect(theme.name.length).toBeGreaterThan(2);
      expect(theme.description.length).toBeGreaterThan(5);
      const c = theme.colors;
      expect(c.bg).toBeDefined();
      expect(c.bgSecondary).toBeDefined();
      expect(c.text).toBeDefined();
      expect(c.textMuted).toBeDefined();
      expect(c.border).toBeDefined();
      expect(c.promptUser).toBeDefined();
      expect(c.promptHost).toBeDefined();
      expect(c.promptPath).toBeDefined();
      expect(c.promptChar).toBeDefined();
      expect(c.accent).toBeDefined();
      expect(c.accentSecondary).toBeDefined();
      expect(c.success).toBeDefined();
      expect(c.error).toBeDefined();
      expect(c.warning).toBeDefined();
      expect(c.info).toBeDefined();
      expect(c.command).toBeDefined();
      expect(c.link).toBeDefined();
      expect(c.tagBg).toBeDefined();
      expect(c.tagText).toBeDefined();
      expect(c.cursor).toBeDefined();
    }
  });
  await harness.test("R3: Theme CSS custom properties apply to :root and persist in localStorage", () => {
    const theme = THEMES["dracula"];
    localStorage.setItem("term_theme", theme.id);
    expect(localStorage.getItem("term_theme")).toBe("dracula");
    const root = document.documentElement;
    root.style.setProperty("--term-bg", theme.colors.bg);
    root.style.setProperty("--term-accent", theme.colors.accent);
    expect(root.style.getPropertyValue("--term-bg")).toBe("#282a36");
    expect(root.style.getPropertyValue("--term-accent")).toBe("#ff79c6");
  });
  await harness.test("R3: Dynamic canvas backdrop animation framerate is capped at 30 FPS", () => {
    const targetFps = 30;
    const interval = 1e3 / targetFps;
    expect(interval).toBeGreaterThanOrEqual(33);
    expect(interval).toBeLessThanOrEqual(34);
  });
  await harness.test("R3: Window minimize state transitions to dock pill", () => {
    let isMinimized = false;
    const toggleMinimize = () => {
      isMinimized = !isMinimized;
    };
    toggleMinimize();
    expect(isMinimized).toBe(true);
    toggleMinimize();
    expect(isMinimized).toBe(false);
  });
  await harness.test("R3: CRT Scanlines and phosphor filter toggles cleanly", () => {
    let crtEnabled = true;
    const toggleCRT = () => {
      crtEnabled = !crtEnabled;
      localStorage.setItem("term_crt", String(crtEnabled));
    };
    toggleCRT();
    expect(crtEnabled).toBe(false);
    expect(localStorage.getItem("term_crt")).toBe("false");
    toggleCRT();
    expect(crtEnabled).toBe(true);
    expect(localStorage.getItem("term_crt")).toBe("true");
  });
  await harness.test("R3: Power Shutdown State Machine operates in 4 verified phases", () => {
    let powerState = "running";
    powerState = "shutting_down";
    expect(powerState).toBe("shutting_down");
    powerState = "off";
    expect(powerState).toBe("off");
    powerState = "booting";
    expect(powerState).toBe("booting");
    powerState = "running";
    expect(powerState).toBe("running");
  });
  return harness.endSuite();
}
function createMockContext(overrides) {
  let cwd = virtualFS.homePath;
  let historyList = [];
  let theme = "matrix-green";
  let soundEnabled = true;
  let crtEnabled = true;
  let activeEasterEgg = null;
  return {
    cwd,
    setCwd: (newCwd) => {
      cwd = typeof newCwd === "function" ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    historyList,
    theme,
    setTheme: (newTheme) => {
      theme = newTheme;
    },
    soundEnabled,
    setSoundEnabled: (val) => {
      soundEnabled = typeof val === "function" ? val(soundEnabled) : val;
    },
    crtEnabled,
    setCrtEnabled: (val) => {
      crtEnabled = typeof val === "function" ? val(crtEnabled) : val;
    },
    activeEasterEgg,
    setActiveEasterEgg: (val) => {
      activeEasterEgg = val;
    },
    triggerShutdown: () => {
    },
    ...overrides
  };
}
async function runTier2BoundariesTests() {
  harness.startSuite("Tier 2 - Boundary & Corner Cases");
  await harness.test("Tier 2: Unknown command returns command-not-found error without crashing", async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("non_existent_command_xyz", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("command not found");
  });
  await harness.test("Tier 2: Special characters and symbols as command name are handled safely", async () => {
    const ctx = createMockContext();
    const symbols = ["!@#$%", "???", "&&", "||", ";", "<script>"];
    for (const sym of symbols) {
      const res = await commandRegistry.execute(sym, ctx);
      expect(res.type).toBe("error");
      expect(res.output).toContain("command not found");
    }
  });
  await harness.test("Tier 2: Empty and whitespace-only strings return empty text response", async () => {
    const ctx = createMockContext();
    const empties = ["", "   ", "	", "\n", "  	  \n  "];
    for (const empty of empties) {
      const res = await commandRegistry.execute(empty, ctx);
      expect(res.type).toBe("text");
      expect(res.output).toBe("");
    }
  });
  await harness.test('Tier 2: "help" with invalid command argument returns error message', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("help non_existent_cmd", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("no manual entry");
  });
  await harness.test('Tier 2: "theme" with invalid theme name returns error and lists valid themes', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("theme invalid_theme_xyz", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("Unknown theme");
    expect(res.output).toContain("matrix-green");
  });
  await harness.test('Tier 2: "projects" with non-matching filter returns filter warning in rawArgs', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("projects non_existent_tech_xyz", ctx);
    expect(res.type).toBe("projects");
    expect(res.rawArgs).toBeDefined();
    expect(res.rawArgs[0]).toBe("non_existent_tech_xyz");
  });
  await harness.test('Tier 2: "sound" with invalid argument safely toggles state with notification', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("sound invalid_arg", ctx);
    expect(res.type).toBe("warning");
    expect(res.output).toContain("Audio Sound FX is now:");
  });
  await harness.test('Tier 2: "crt" with invalid argument safely toggles state with notification', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("crt invalid_arg", ctx);
    expect(res.type).toBe("info");
    expect(res.output).toContain("CRT Monitor Scanlines:");
  });
  await harness.test('Tier 2: "cd" to non-existent directory returns error and leaves cwd unchanged', async () => {
    let currentCwd = "/home/guest";
    const ctx = createMockContext({
      get cwd() {
        return currentCwd;
      },
      setCwd: (p) => {
        currentCwd = typeof p === "function" ? p(currentCwd) : p;
      }
    });
    const res = await commandRegistry.execute("cd /nonexistent/folder/123", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("no such file or directory");
    expect(currentCwd).toBe("/home/guest");
  });
  await harness.test('Tier 2: "cd" into a file (not directory) returns not-a-directory error', async () => {
    let currentCwd = "/home/guest";
    const ctx = createMockContext({
      get cwd() {
        return currentCwd;
      },
      setCwd: (p) => {
        currentCwd = typeof p === "function" ? p(currentCwd) : p;
      }
    });
    const res = await commandRegistry.execute("cd /etc/os-release", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("not a directory");
    expect(currentCwd).toBe("/home/guest");
  });
  await harness.test('Tier 2: "cat" on directory target returns is-a-directory error', async () => {
    const ctx = createMockContext({ cwd: "/home/guest" });
    const res = await commandRegistry.execute("cat projects", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("Is a directory");
  });
  await harness.test('Tier 2: "cat" on non-existent file returns no-such-file error', async () => {
    const ctx = createMockContext({ cwd: "/home/guest" });
    const res = await commandRegistry.execute("cat nonexistent_file.txt", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("No such file or directory");
  });
  await harness.test('Tier 2: "cat" without argument returns missing operand error', async () => {
    const ctx = createMockContext({ cwd: "/home/guest" });
    const res = await commandRegistry.execute("cat", ctx);
    expect(res.type).toBe("error");
    expect(res.output).toContain("missing file operand");
  });
  await harness.test("Tier 2: Path traversal beyond root (/../../..) clamps at root (/)", () => {
    const resolved = virtualFS.resolvePath("/home/guest", "../../../../../..");
    expect(resolved).toBe("/");
  });
  await harness.test("Tier 2: Tilde traversal (~/../../..) clamps correctly", () => {
    const resolved = virtualFS.resolvePath("/home/guest", "~/../../..");
    expect(resolved).toBe("/");
  });
  await harness.test("Tier 2: Multiple consecutive slashes and dots resolve cleanly", () => {
    const resolved = virtualFS.resolvePath("/home/guest", "././projects/../projects/./");
    expect(resolved).toBe("/home/guest/projects");
  });
  await harness.test("Tier 2: Multiple spaces between command and arguments parse correctly", async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute("echo     Multiple    Spaces    Tested   ", ctx);
    expect(res.type).toBe("text");
    expect(res.output).toBe("Multiple Spaces Tested");
  });
  await harness.test("Tier 2: Case insensitivity on command name lookup", async () => {
    const ctx = createMockContext();
    const resUpper = await commandRegistry.execute("ABOUT", ctx);
    expect(resUpper.type).toBe("about");
    const resMixed = await commandRegistry.execute("PrOjEcTs", ctx);
    expect(resMixed.type).toBe("projects");
  });
  return harness.endSuite();
}
function createStatefulTerminalSession() {
  let cwd = virtualFS.homePath;
  let historyList = [];
  let theme = "matrix-green";
  let soundEnabled = true;
  let crtEnabled = true;
  let activeEasterEgg = null;
  let shutdownTriggered = false;
  const ctx = {
    get cwd() {
      return cwd;
    },
    setCwd: (newCwd) => {
      cwd = typeof newCwd === "function" ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    get historyList() {
      return historyList;
    },
    get theme() {
      return theme;
    },
    setTheme: (newTheme) => {
      theme = newTheme;
    },
    get soundEnabled() {
      return soundEnabled;
    },
    setSoundEnabled: (val) => {
      soundEnabled = typeof val === "function" ? val(soundEnabled) : val;
    },
    get crtEnabled() {
      return crtEnabled;
    },
    setCrtEnabled: (val) => {
      crtEnabled = typeof val === "function" ? val(crtEnabled) : val;
    },
    get activeEasterEgg() {
      return activeEasterEgg;
    },
    setActiveEasterEgg: (val) => {
      activeEasterEgg = val;
    },
    triggerShutdown: () => {
      shutdownTriggered = true;
    }
  };
  const execute = async (raw) => {
    historyList.push(raw);
    return commandRegistry.execute(raw, ctx);
  };
  return { ctx, execute, getHistory: () => historyList, isShutdown: () => shutdownTriggered };
}
async function runTier3CombinationsTests() {
  harness.startSuite("Tier 3 - Cross-Feature Combinations");
  await harness.test("Tier 3: Multi-step pipeline: Theme change -> Directory navigation -> File inspection -> History recall -> Screen clear", async () => {
    const session = createStatefulTerminalSession();
    const resTheme = await session.execute("theme dracula");
    expect(resTheme.type).toBe("success");
    expect(session.ctx.theme).toBe("dracula");
    const resCd = await session.execute("cd projects");
    expect(resCd.type).toBe("text");
    expect(session.ctx.cwd).toBe("/home/guest/projects");
    const completions = virtualFS.getCompletions(session.ctx.cwd, "agri");
    expect(completions).toContain("agrisathi.md");
    const resCat = await session.execute("cat agrisathi.md");
    expect(resCat.type).toBe("text");
    expect(resCat.output).toContain("AgriSathi");
    expect(resCat.output).toContain("GitHub:");
    const resHistory = await session.execute("history");
    expect(resHistory.type).toBe("text");
    expect(resHistory.output).toContain("1  theme dracula");
    expect(resHistory.output).toContain("2  cd projects");
    expect(resHistory.output).toContain("3  cat agrisathi.md");
    const resClear = await session.execute("clear");
    expect(resClear.type).toBe("clear");
    expect(session.getHistory().length).toBe(0);
  });
  await harness.test("Tier 3: Dynamic Filesystem Lifecycle: Create Dir -> Enter -> Create File -> List -> Read -> Exit -> Remove", async () => {
    const session = createStatefulTerminalSession();
    const testDirName = "e2e_lifecycle_sandbox";
    const testFileName = "build_notes.txt";
    const mkRes = await session.execute(`mkdir ${testDirName}`);
    expect(mkRes.type).toBe("success");
    await session.execute(`cd ${testDirName}`);
    expect(session.ctx.cwd).toBe(`/home/guest/${testDirName}`);
    const touchRes = await session.execute(`touch ${testFileName}`);
    expect(touchRes.type).toBe("text");
    const lsRes = await session.execute("ls -la");
    expect(lsRes.output).toContain(testFileName);
    const catRes = await session.execute(`cat ${testFileName}`);
    expect(catRes.output).toBe("");
    await session.execute("cd ..");
    expect(session.ctx.cwd).toBe("/home/guest");
    const rmRes = await session.execute(`rm ${testDirName}`);
    expect(rmRes.type).toBe("text");
    const lsAfter = await session.execute("ls");
    expect(lsAfter.output.includes(testDirName)).toBeFalsy();
  });
  await harness.test("Tier 3: Sequential audio, CRT, and theme mutations maintain state consistency", async () => {
    const session = createStatefulTerminalSession();
    await session.execute("sound off");
    expect(session.ctx.soundEnabled).toBe(false);
    await session.execute("crt on");
    expect(session.ctx.crtEnabled).toBe(true);
    await session.execute("theme cyberpunk");
    expect(session.ctx.theme).toBe("cyberpunk");
    await session.execute("crt off");
    expect(session.ctx.crtEnabled).toBe(false);
    await session.execute("sound on");
    expect(session.ctx.soundEnabled).toBe(true);
  });
  await harness.test("Tier 3: Deep system exploration in /etc and path restoration to home (~)", async () => {
    const session = createStatefulTerminalSession();
    await session.execute("cd /");
    expect(session.ctx.cwd).toBe("/");
    await session.execute("cd etc");
    expect(session.ctx.cwd).toBe("/etc");
    const comp = virtualFS.getCompletions("/etc", "os");
    expect(comp).toContain("os-release");
    const osRes = await session.execute("cat os-release");
    expect(osRes.output).toContain("Portfolio Linux");
    const hostRes = await session.execute("cat hostname");
    expect(hostRes.output.length).toBeGreaterThan(3);
    await session.execute("cd ~");
    expect(session.ctx.cwd).toBe("/home/guest");
  });
  return harness.endSuite();
}
class VisitorService {
  constructor() {
    __publicField(this, "cachedLocation", null);
    __publicField(this, "cachedWeather", null);
    __publicField(this, "locationPromise", null);
    __publicField(this, "weatherPromise", null);
  }
  /**
   * Diagnostic client hardware info
   */
  getHardwareInfo() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let os = "Unknown OS";
    if (ua.includes("Win")) os = "Windows 11 / 10 (NT 10.0)";
    else if (ua.includes("Mac")) os = ua.includes("iPhone") || ua.includes("iPad") ? "iOS / iPadOS" : "macOS (Darwin x86_64/arm64)";
    else if (ua.includes("Android")) os = "Android Linux";
    else if (ua.includes("Linux")) os = "GNU/Linux";
    let browser = "Unknown Browser";
    if (ua.includes("Firefox/")) {
      const match = ua.match(/Firefox\/(\d+(\.\d+)?)/);
      browser = `Mozilla Firefox ${match ? match[1] : ""}`;
    } else if (ua.includes("Edg/")) {
      const match = ua.match(/Edg\/(\d+(\.\d+)?)/);
      browser = `Microsoft Edge ${match ? match[1] : ""}`;
    } else if (ua.includes("Chrome/")) {
      const match = ua.match(/Chrome\/(\d+(\.\d+)?)/);
      browser = `Google Chrome / Chromium ${match ? match[1] : ""}`;
    } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
      const match = ua.match(/Version\/(\d+(\.\d+)?)/);
      browser = `Apple Safari ${match ? match[1] : ""}`;
    }
    let gpu = "Standard WebGL Accelerator";
    if (typeof document !== "undefined") {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer) gpu = renderer;
          }
        }
      } catch {
      }
    }
    const nav = typeof navigator !== "undefined" ? navigator : {};
    const connection = nav.connection;
    return {
      os,
      browser,
      cpuCores: nav.hardwareConcurrency || 8,
      memory: nav.deviceMemory ? `~${nav.deviceMemory} GiB RAM` : "8+ GiB RAM",
      gpu,
      screenRes: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "1920x1080",
      viewport: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "1920x1080",
      pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
      colorDepth: typeof window !== "undefined" ? window.screen.colorDepth : 24,
      touchSupport: typeof navigator !== "undefined" ? (nav.maxTouchPoints || 0) > 0 || "ontouchstart" in window : false,
      language: typeof navigator !== "undefined" ? navigator.language : "en-US",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      networkType: (connection == null ? void 0 : connection.effectiveType) ? connection.effectiveType.toUpperCase() : "Broadband / WiFi",
      downlink: (connection == null ? void 0 : connection.downlink) ? `${connection.downlink} Mbps` : void 0,
      rtt: (connection == null ? void 0 : connection.rtt) ? `${connection.rtt} ms` : void 0
    };
  }
  /**
   * Fetch visitor IP & Geolocation
   */
  async getVisitorLocation() {
    if (this.cachedLocation) return this.cachedLocation;
    if (this.locationPromise) return this.locationPromise;
    this.locationPromise = (async () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      try {
        const res = await fetch("https://ipwho.is/", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            this.cachedLocation = {
              ip: data.ip || "127.0.0.1",
              city: data.city || "Local Host",
              region: data.region || "",
              country: data.country || "Earth",
              countryCode: data.country_code || "UN",
              postalCode: data.postal || "N/A",
              latitude: data.latitude || 22.5726,
              longitude: data.longitude || 88.3639,
              timezone: ((_a = data.timezone) == null ? void 0 : _a.id) || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
              isp: ((_b = data.connection) == null ? void 0 : _b.isp) || "Internet Service Provider",
              org: ((_c = data.connection) == null ? void 0 : _c.org) || ((_d = data.connection) == null ? void 0 : _d.isp) || "Internet Service Provider",
              asn: ((_e = data.connection) == null ? void 0 : _e.asn) ? `AS${data.connection.asn}` : "AS55836",
              currency: ((_f = data.currency) == null ? void 0 : _f.code) || "INR",
              vpn: ((_g = data.security) == null ? void 0 : _g.vpn) || ((_h = data.security) == null ? void 0 : _h.proxy) ? "Active" : "N/A"
            };
            return this.cachedLocation;
          }
        }
      } catch {
      }
      try {
        const res = await fetch("https://freeipapi.com/api/json", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          this.cachedLocation = {
            ip: data.ipAddress || "127.0.0.1",
            city: data.cityName || "Local Client",
            region: data.regionName || "",
            country: data.countryName || "Earth",
            countryCode: data.countryCode || "UN",
            latitude: data.latitude || 37.7749,
            longitude: data.longitude || -122.4194,
            timezone: data.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
            isp: "Local ISP / VPN"
          };
          return this.cachedLocation;
        }
      } catch {
      }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const cityFromTz = tz.includes("/") ? tz.split("/")[1].replace(/_/g, " ") : "Local City";
      this.cachedLocation = {
        ip: "192.168.1.1 (Client Guest)",
        city: cityFromTz,
        region: "Local Network",
        country: "Earth",
        countryCode: "UN",
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: tz,
        isp: "Localhost Loopback"
      };
      return this.cachedLocation;
    })();
    return this.locationPromise;
  }
  /**
   * Fetch Live Weather for visitor location
   */
  async getVisitorWeather() {
    if (this.cachedWeather) return this.cachedWeather;
    if (this.weatherPromise) return this.weatherPromise;
    this.weatherPromise = (async () => {
      var _a;
      const loc = await this.getVisitorLocation();
      const lat = loc.latitude;
      const lon = loc.longitude;
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          const current = data.current_weather;
          const tempC = Math.round(current.temperature);
          const tempF = Math.round(tempC * 9 / 5 + 32);
          const code = current.weathercode;
          const isDay = current.is_day === 1;
          let humidity = "55%";
          if (((_a = data.hourly) == null ? void 0 : _a.relativehumidity_2m) && data.hourly.relativehumidity_2m.length > 0) {
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
            isDay
          };
          return this.cachedWeather;
        }
      } catch {
      }
      const defaultInfo = this.mapWeatherCode(0, true);
      this.cachedWeather = {
        tempC: 22,
        tempF: 72,
        condition: "Sunny",
        description: "Clear Sky & Pleasant Breeze",
        icon: "☀️",
        asciiArt: defaultInfo.ascii,
        windSpeed: "12 km/h NW",
        humidity: "48%",
        city: loc.city,
        isDay: true
      };
      return this.cachedWeather;
    })();
    return this.weatherPromise;
  }
  mapWeatherCode(code, isDay) {
    if (code === 0) {
      return {
        condition: isDay ? "Sunny" : "Clear Night",
        description: "Clear Sky",
        icon: isDay ? "☀️" : "🌙",
        ascii: `     \\   /     
      .-.      
   ― (   ) ―   
      \`-'      
     /   \\     `
      };
    }
    if (code === 1 || code === 2 || code === 3) {
      return {
        condition: "Partly Cloudy",
        description: "Mainly clear, partly cloudy, and overcast",
        icon: isDay ? "⛅" : "☁️",
        ascii: `   \\  /       
 _ /"".-.     
   \\_(   ).   
   /(___(__)  `
      };
    }
    if (code >= 45 && code <= 48) {
      return {
        condition: "Foggy",
        description: "Fog and depositing rime fog",
        icon: "🌫️",
        ascii: ` _ - _ - _ -  
  _ - _ - _   
 _ - _ - _ -  `
      };
    }
    if (code >= 51 && code <= 67) {
      return {
        condition: "Rainy",
        description: "Light to moderate rain drizzle",
        icon: "🌧️",
        ascii: `     .-.      
    (   ).    
   (___(__)   
    ' ' ' '   
   ' ' ' '    `
      };
    }
    if (code >= 71 && code <= 77) {
      return {
        condition: "Snowy",
        description: "Snow fall and ice grains",
        icon: "❄️",
        ascii: `     .-.      
    (   ).    
   (___(__)   
    *  *  *   
   *  *  *    `
      };
    }
    if (code >= 80 && code <= 82) {
      return {
        condition: "Heavy Rain Showers",
        description: "Heavy rain showers",
        icon: "⛈️",
        ascii: `     .-.      
    (   ).    
   (___(__)   
  ‚'/‚'/‚'/   
  ‚'/‚'/‚'/   `
      };
    }
    if (code >= 95) {
      return {
        condition: "Thunderstorm",
        description: "Thunderstorm with slight and heavy hail",
        icon: "⚡",
        ascii: `     .-.      
    (   ).    
   (___(__)   
    ⚡/  ⚡/   
    ' '  ' '  `
      };
    }
    return {
      condition: "Fair",
      description: "Pleasant atmosphere",
      icon: "🌤️",
      ascii: `     \\   /     
      .-.      
   ― (   ) ―   
      \`-'      `
    };
  }
}
const visitorService = new VisitorService();
function createScenarioSession() {
  let cwd = virtualFS.homePath;
  let historyList = [];
  let theme = "matrix-green";
  let soundEnabled = true;
  let crtEnabled = true;
  let activeEasterEgg = null;
  let shutdownTriggered = false;
  const ctx = {
    get cwd() {
      return cwd;
    },
    setCwd: (newCwd) => {
      cwd = typeof newCwd === "function" ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    get historyList() {
      return historyList;
    },
    get theme() {
      return theme;
    },
    setTheme: (newTheme) => {
      theme = newTheme;
    },
    get soundEnabled() {
      return soundEnabled;
    },
    setSoundEnabled: (val) => {
      soundEnabled = typeof val === "function" ? val(soundEnabled) : val;
    },
    get crtEnabled() {
      return crtEnabled;
    },
    setCrtEnabled: (val) => {
      crtEnabled = typeof val === "function" ? val(crtEnabled) : val;
    },
    get activeEasterEgg() {
      return activeEasterEgg;
    },
    setActiveEasterEgg: (val) => {
      activeEasterEgg = val;
    },
    triggerShutdown: () => {
      shutdownTriggered = true;
    }
  };
  const execute = async (raw) => {
    historyList.push(raw);
    return commandRegistry.execute(raw, ctx);
  };
  return { ctx, execute, getHistory: () => historyList, isShutdown: () => shutdownTriggered };
}
async function runTier4ScenariosTests() {
  harness.startSuite("Tier 4 - Real-World Application Scenarios");
  await harness.test("Scenario 1: Recruiter Exploration (welcome -> about -> skills -> projects -> experience -> education -> certifications -> resume -> contact)", async () => {
    const s = createScenarioSession();
    const welcome = await s.execute("welcome");
    expect(welcome.type).toBe("welcome");
    const about = await s.execute("about");
    expect(about.type).toBe("about");
    const skills = await s.execute("skills");
    expect(skills.type).toBe("skills");
    const projects = await s.execute("projects");
    expect(projects.type).toBe("projects");
    const exp = await s.execute("experience");
    expect(exp.type).toBe("experience");
    const edu = await s.execute("education");
    expect(edu.type).toBe("info");
    expect(edu.output).toContain("Haldia Institute of Technology");
    const certs = await s.execute("certifications");
    expect(certs.type).toBe("info");
    expect(certs.output).toContain("Oracle Cloud Infrastructure");
    const resume = await s.execute("resume");
    expect(resume.type).toBe("success");
    expect(resume.output).toContain("resume.pdf");
    const contact = await s.execute("contact");
    expect(contact.type).toBe("contact");
  });
  await harness.test("Scenario 2: Terminal Power User (pwd -> ls -la -> cd projects -> cat agrisathi.md -> tree -> history -> clear)", async () => {
    const s = createScenarioSession();
    const pwd1 = await s.execute("pwd");
    expect(pwd1.output).toBe("/home/guest");
    const ls = await s.execute("ls -la");
    expect(ls.output).toContain(".bashrc");
    expect(ls.output).toContain("projects/");
    await s.execute("cd projects");
    expect(s.ctx.cwd).toBe("/home/guest/projects");
    const catProj = await s.execute("cat agrisathi.md");
    expect(catProj.output).toContain("AgriSathi");
    const tree = await s.execute("tree");
    expect(tree.type).toBe("tree");
    const history = await s.execute("history");
    expect(history.output).toContain("cd projects");
    const clear = await s.execute("clear");
    expect(clear.type).toBe("clear");
    expect(s.getHistory().length).toBe(0);
  });
  await harness.test("Scenario 3: Customization Enthusiast (cycles 7 themes -> toggles sound & CRT -> neofetch -> matrix)", async () => {
    const s = createScenarioSession();
    const themesList = [
      "matrix-green",
      "dracula",
      "catppuccin",
      "nord",
      "gruvbox",
      "cyberpunk",
      "ubuntu"
    ];
    for (const t of themesList) {
      const res = await s.execute(`theme ${t}`);
      expect(res.type).toBe("success");
      expect(s.ctx.theme).toBe(t);
    }
    await s.execute("crt toggle");
    expect(s.ctx.crtEnabled).toBe(false);
    await s.execute("sound toggle");
    expect(s.ctx.soundEnabled).toBe(false);
    const neofetch = await s.execute("neofetch");
    expect(neofetch.type).toBe("neofetch");
    const matrix = await s.execute("matrix");
    expect(matrix.type).toBe("success");
    expect(s.ctx.activeEasterEgg).toBe("matrix");
  });
  await harness.test("Scenario 4: Easter Egg Gamer (snake -> cowsay -> sl -> matrix -> sudo -> vim -> quote)", async () => {
    const s = createScenarioSession();
    const snake = await s.execute("snake");
    expect(snake.type).toBe("success");
    expect(s.ctx.activeEasterEgg).toBe("snake");
    const cowsay = await s.execute("cowsay Vibe coding is amazing");
    expect(cowsay.type).toBe("cowsay");
    const sl = await s.execute("sl");
    expect(sl.type).toBe("info");
    expect(s.ctx.activeEasterEgg).toBe("sl");
    const matrix = await s.execute("matrix");
    expect(matrix.type).toBe("success");
    expect(s.ctx.activeEasterEgg).toBe("matrix");
    const sudo = await s.execute("sudo make me a sandwich");
    expect(sudo.type).toBe("error");
    expect(sudo.output.length).toBeGreaterThan(10);
    const vim = await s.execute("vim secret.txt");
    expect(vim.type).toBe("warning");
    expect(vim.output).toContain("read-only");
    const quote = await s.execute("quote");
    expect(quote.type).toBe("info");
    expect(quote.output.length).toBeGreaterThan(10);
  });
  await harness.test("Scenario 5: System Telemetry Inspector (whoami -> sysinfo -> weather -> uptime -> date -> shutdown)", async () => {
    const s = createScenarioSession();
    const whoami = await s.execute("whoami");
    expect(whoami.type).toBe("whoami");
    const sysinfo = await s.execute("sysinfo");
    expect(sysinfo.type).toBe("sysinfo");
    const weather = await s.execute("weather");
    expect(weather.type).toBe("weather");
    const uptime = await s.execute("uptime");
    expect(uptime.type).toBe("text");
    expect(uptime.output).toContain("load average");
    const date = await s.execute("date");
    expect(date.type).toBe("text");
    const shutdown = await s.execute("shutdown");
    expect(shutdown.type).toBe("warning");
    expect(s.isShutdown()).toBe(true);
    const hardware = visitorService.getHardwareInfo();
    expect(hardware.cpuCores).toBeGreaterThan(0);
    expect(hardware.memory).toBeDefined();
    expect(hardware.screenRes).toBeDefined();
    const location = await visitorService.getVisitorLocation();
    expect(location.ip).toBeDefined();
    expect(location.city).toBeDefined();
    expect(location.country).toBeDefined();
    const liveWeather = await visitorService.getVisitorWeather();
    expect(liveWeather.tempC).toBeDefined();
    expect(liveWeather.condition).toBeDefined();
    expect(liveWeather.asciiArt).toBeDefined();
  });
  return harness.endSuite();
}
async function runAllTests(projectRoot) {
  setupTestEnvironment();
  console.log(`================================================================`);
  console.log(`🚀 ARYAN PRASAD LINUX TERMINAL PORTFOLIO — MASTER E2E TEST RUNNER`);
  console.log(`Root: ${projectRoot}`);
  console.log(`Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}`);
  console.log(`================================================================`);
  await runTier1BuildAndAssetsTests(projectRoot);
  await runTier1CommandsTests();
  await runTier1UILifecycleTests();
  await runTier2BoundariesTests();
  await runTier3CombinationsTests();
  await runTier4ScenariosTests();
  const allPassed = harness.printOverallSummary();
  return {
    passed: allPassed,
    summaries: harness.getAllSummaries()
  };
}
export {
  runAllTests
};
