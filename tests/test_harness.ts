// Lightweight, zero-dependency Test Assertion & Reporting Harness

export interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  error?: string;
  details?: string;
}

export interface SuiteSummary {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestResult[];
}

export class TestHarness {
  private currentSuite = 'Default Suite';
  private results: TestResult[] = [];
  private suiteStartTime = Date.now();
  private allSummaries: SuiteSummary[] = [];

  public startSuite(name: string) {
    this.currentSuite = name;
    this.results = [];
    this.suiteStartTime = Date.now();
    console.log(`\n================================================================`);
    console.log(`🚀 STARTING TEST SUITE: [${name}]`);
    console.log(`================================================================`);
  }

  public async test(name: string, fn: () => void | Promise<void>, details?: string): Promise<boolean> {
    const start = performance.now();
    try {
      await fn();
      const durationMs = Math.round((performance.now() - start) * 100) / 100;
      this.results.push({
        name,
        category: this.currentSuite,
        passed: true,
        durationMs,
        details,
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
        details,
      });
      console.error(`  ❌ FAIL: ${name} (${durationMs}ms)`);
      console.error(`     Error: ${errorMsg}`);
      return false;
    }
  }

  public endSuite(): SuiteSummary {
    const totalDuration = Date.now() - this.suiteStartTime;
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    const summary: SuiteSummary = {
      suiteName: this.currentSuite,
      total,
      passed,
      failed,
      durationMs: totalDuration,
      results: [...this.results],
    };

    this.allSummaries.push(summary);
    console.log(`----------------------------------------------------------------`);
    console.log(`Suite [${this.currentSuite}] Complete: ${passed}/${total} passed (${failed} failed) in ${totalDuration}ms`);
    console.log(`----------------------------------------------------------------\n`);
    return summary;
  }

  public getAllSummaries(): SuiteSummary[] {
    return this.allSummaries;
  }

  public printOverallSummary(): boolean {
    const totalSuites = this.allSummaries.length;
    const totalTests = this.allSummaries.reduce((acc, s) => acc + s.total, 0);
    const totalPassed = this.allSummaries.reduce((acc, s) => acc + s.passed, 0);
    const totalFailed = this.allSummaries.reduce((acc, s) => acc + s.failed, 0);
    const totalDuration = this.allSummaries.reduce((acc, s) => acc + s.durationMs, 0);

    console.log(`\n================================================================`);
    console.log(`📊 MASTER TEST EXECUTION SUMMARY`);
    console.log(`================================================================`);
    console.log(`Total Test Suites: ${totalSuites}`);
    console.log(`Total Tests Run:   ${totalTests}`);
    console.log(`Total Passed:      ${totalPassed}`);
    console.log(`Total Failed:      ${totalFailed}`);
    console.log(`Success Rate:      ${totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(2) : 0}%`);
    console.log(`Total Execution:   ${totalDuration}ms`);

    if (totalFailed > 0) {
      console.log(`\n❌ FAILED TESTS LIST:`);
      for (const suite of this.allSummaries) {
        for (const res of suite.results) {
          if (!res.passed) {
            console.log(`  - [${suite.suiteName}] ${res.name}`);
            console.log(`    Error: ${res.error}`);
          }
        }
      }
    }

    console.log(`================================================================\n`);

    return totalFailed === 0;
  }
}

export const harness = new TestHarness();

export function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
      }
    },
    toEqual(expected: unknown) {
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
      if (actual === undefined) {
        throw new Error(`Expected value to be defined, received undefined`);
      }
    },
    toContain(expected: unknown) {
      if (typeof actual === 'string') {
        if (!actual.includes(String(expected))) {
          throw new Error(`Expected string "${actual.substring(0, 100)}..." to contain "${expected}"`);
        }
      } else if (Array.isArray(actual)) {
        if (!actual.includes(expected as never)) {
          throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
        }
      } else {
        throw new Error(`toContain only supports string and array, received ${typeof actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual < expected) {
        throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (typeof actual !== 'number' || actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== 'number' || actual > expected) {
        throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, received ${JSON.stringify(actual)}`);
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected undefined, received ${JSON.stringify(actual)}`);
      }
    },
    toMatch(regex: RegExp) {
      if (typeof actual !== 'string' || !regex.test(actual)) {
        throw new Error(`Expected "${String(actual).substring(0, 100)}" to match pattern ${regex}`);
      }
    },
    toThrow(expectedSubstring?: string) {
      if (typeof actual !== 'function') {
        throw new Error(`toThrow expected a function, received ${typeof actual}`);
      }
      let threw = false;
      let errorMsg = '';
      try {
        (actual as () => unknown)();
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
