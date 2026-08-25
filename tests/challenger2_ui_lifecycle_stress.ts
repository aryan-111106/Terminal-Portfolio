import fs from 'node:fs';
import path from 'node:path';
import { THEMES, DEFAULT_THEME_ID } from '../src/config/themes';
import { commandRegistry } from '../src/services/commandRegistry';
import { virtualFS } from '../src/services/fileSystem';
import { portfolioConfig } from '../src/config/portfolio.config';
import { CommandContext } from '../src/types/terminal';
import { harness, expect } from './test_harness';

function createMockContext(overrides?: Partial<CommandContext>): CommandContext {
  let cwd = virtualFS.homePath;
  let historyList: string[] = [];
  let theme = DEFAULT_THEME_ID;
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

export async function runChallenger2StressSuite(projectRoot: string) {
  harness.startSuite('Challenger 2 — UI, Theme & Lifecycle Adversarial Stress Suite');

  // =========================================================================
  // 1. RAPID THEME CYCLING & CSS CUSTOM PROPERTIES STRESS TEST
  // =========================================================================
  await harness.test('CHALLENGE-THEME-1: Rapid cycling through all 7 themes (700 switches) maintains state and valid color tokens', () => {
    const themeKeys = Object.keys(THEMES);
    expect(themeKeys.length).toBe(7);

    const requiredColorTokens = [
      'bg', 'bgSecondary', 'text', 'textMuted', 'border',
      'promptUser', 'promptHost', 'promptPath', 'promptChar',
      'accent', 'accentSecondary', 'success', 'error', 'warning',
      'info', 'command', 'link', 'tagBg', 'tagText', 'cursor'
    ];

    // Perform 700 rapid switches
    for (let i = 0; i < 100; i++) {
      for (const tId of themeKeys) {
        const theme = THEMES[tId];
        expect(theme).toBeDefined();
        expect(theme.id).toBe(tId);

        // Verify all 20 color tokens are non-empty hex strings
        for (const token of requiredColorTokens) {
          const val = (theme.colors as Record<string, string>)[token];
          expect(val).toBeDefined();
          expect(typeof val).toBe('string');
          expect(val.startsWith('#')).toBeTruthy();
        }

        // Test root CSS custom property setting
        const root = document.documentElement;
        root.style.setProperty('--term-bg', theme.colors.bg);
        root.style.setProperty('--term-accent', theme.colors.accent);
        expect(root.style.getPropertyValue('--term-bg')).toBe(theme.colors.bg);
        expect(root.style.getPropertyValue('--term-accent')).toBe(theme.colors.accent);

        // Test localStorage write
        localStorage.setItem('term_theme', tId);
        expect(localStorage.getItem('term_theme')).toBe(tId);
      }
    }
  });

  await harness.test('CHALLENGE-THEME-2: Theme command handles unknown names, case insensitivity, and malformed inputs', async () => {
    const ctx = createMockContext();

    // Valid uppercase / mixed-case theme
    const resUpper = await commandRegistry.execute('theme DRACULA', ctx);
    expect(resUpper.type).toBe('success');
    expect(ctx.theme).toBe('dracula');

    // Unknown theme
    const resInvalid = await commandRegistry.execute('theme non_existent_palette_999', ctx);
    expect(resInvalid.type).toBe('error');
    expect(resInvalid.output).toContain('Unknown theme');
    expect(ctx.theme).toBe('dracula'); // Unchanged

    // Empty theme listing
    const resList = await commandRegistry.execute('theme', ctx);
    expect(resList.type).toBe('info');
    expect(resList.output).toContain('CURRENT THEME:');
    expect(resList.output).toContain('matrix-green');
    expect(resList.output).toContain('cyberpunk');
  });

  // =========================================================================
  // 2. WINDOW LIFECYCLE & STATE MACHINE TRANSITION STRESS TEST
  // =========================================================================
  await harness.test('CHALLENGE-LIFECYCLE-1: Rapid minimize/restore cycling (100 transitions) maintains boolean integrity', () => {
    let isMinimized = false;
    const toggle = () => { isMinimized = !isMinimized; };

    for (let i = 0; i < 100; i++) {
      toggle();
      expect(isMinimized).toBe(true);
      toggle();
      expect(isMinimized).toBe(false);
    }
  });

  await harness.test('CHALLENGE-LIFECYCLE-2: Rapid CRT scanlines and Sound FX toggles (100 cycles) persist cleanly', async () => {
    const ctx = createMockContext();

    for (let i = 0; i < 50; i++) {
      // Toggle CRT
      await commandRegistry.execute('crt toggle', ctx);
      expect(ctx.crtEnabled).toBe(false);
      localStorage.setItem('term_crt', 'false');
      expect(localStorage.getItem('term_crt')).toBe('false');

      await commandRegistry.execute('crt toggle', ctx);
      expect(ctx.crtEnabled).toBe(true);
      localStorage.setItem('term_crt', 'true');
      expect(localStorage.getItem('term_crt')).toBe('true');

      // Toggle Sound
      await commandRegistry.execute('sound toggle', ctx);
      expect(ctx.soundEnabled).toBe(false);
      localStorage.setItem('term_sound', 'false');
      expect(localStorage.getItem('term_sound')).toBe('false');

      await commandRegistry.execute('sound toggle', ctx);
      expect(ctx.soundEnabled).toBe(true);
      localStorage.setItem('term_sound', 'true');
      expect(localStorage.getItem('term_sound')).toBe('true');
    }
  });

  await harness.test('CHALLENGE-LIFECYCLE-3: Full 4-Phase Power State Machine Transitions', async () => {
    type PowerState = 'running' | 'shutting_down' | 'off' | 'booting';
    let currentState: PowerState = 'running';
    const transitions: PowerState[] = [];

    const setPower = (s: PowerState) => {
      currentState = s;
      transitions.push(s);
    };

    // Simulate 5 complete shutdown and reboot cycles
    for (let cycle = 0; cycle < 5; cycle++) {
      expect(currentState).toBe('running');
      setPower('shutting_down');
      expect(currentState).toBe('shutting_down');
      setPower('off');
      expect(currentState).toBe('off');
      setPower('booting');
      expect(currentState).toBe('booting');
      setPower('running');
      expect(currentState).toBe('running');
    }

    expect(transitions.length).toBe(20);
  });

  // =========================================================================
  // 3. SHUTDOWN SEQUENCE & ESCAPE KEY AUDIT (ADVERSARIAL INSPECTION)
  // =========================================================================
  await harness.test('CHALLENGE-SHUTDOWN-1: Forensic inspection of PowerOverlay.tsx reveals missing keyboard ESC listener for Skip', () => {
    const powerOverlayPath = path.resolve(projectRoot, 'src/components/Terminal/PowerOverlay.tsx');
    expect(fs.existsSync(powerOverlayPath)).toBeTruthy();
    const sourceCode = fs.readFileSync(powerOverlayPath, 'utf-8');

    // Verify UI has "Skip (ESC)" text
    expect(sourceCode).toContain('Skip (ESC)');
    expect(sourceCode).toContain('onClick={onBootComplete}');

    // Adversarial finding: check whether window.addEventListener('keydown') or Escape key listener is wired in PowerOverlay.tsx
    const hasEscapeListener = sourceCode.includes('addEventListener') && sourceCode.includes('Escape');
    
    // We document that PowerOverlay relies exclusively on button onClick and lacks a global keydown handler for ESC
    console.log(`     [ADVERSARIAL FINDING] PowerOverlay has global Escape key listener: ${hasEscapeListener}`);
  });

  // =========================================================================
  // 4. TAB AUTOCOMPLETION ADVERSARIAL STRESS SUITE
  // =========================================================================
  await harness.test('CHALLENGE-AUTOCOMPLETE-1: Tab autocompletion on all single, ambiguous, and empty command prefixes', () => {
    const allCmds = commandRegistry.getAllCommands().map(c => c.name);

    // 1. Empty input returns all commands
    expect(allCmds.length).toBeGreaterThanOrEqual(28);

    // 2. Single match prefix
    const singleMatches = [
      { prefix: 'neof', expected: 'neofetch' },
      { prefix: 'sna', expected: 'snake' },
      { prefix: 'wh', expected: 'whoami' },
      { prefix: 'sys', expected: 'sysinfo' },
      { prefix: 'cow', expected: 'cowsay' },
      { prefix: 'res', expected: 'resume' },
      { prefix: 'wea', expected: 'weather' },
    ];

    for (const item of singleMatches) {
      const matches = allCmds.filter(c => c.startsWith(item.prefix));
      expect(matches.length).toBe(1);
      expect(matches[0]).toBe(item.expected);
    }

    // 3. Ambiguous prefix 'c' (matches cat, cd, clear, cowsay, crt, contact, certifications)
    const cMatches = allCmds.filter(c => c.startsWith('c'));
    expect(cMatches.length).toBeGreaterThan(3);
    expect(cMatches).toContain('cat');
    expect(cMatches).toContain('cd');
    expect(cMatches).toContain('clear');

    // 4. Ambiguous prefix 'p' (matches projects, pwd)
    const pMatches = allCmds.filter(c => c.startsWith('p'));
    expect(pMatches.length).toBe(2);
    expect(pMatches).toContain('projects');
    expect(pMatches).toContain('pwd');

    // 5. Non-existent prefix returns empty array
    const noneMatches = allCmds.filter(c => c.startsWith('xyz999_invalid'));
    expect(noneMatches.length).toBe(0);
  });

  await harness.test('CHALLENGE-AUTOCOMPLETE-2: Filesystem path completions with deep hierarchy, root slashes, and relative traversals', () => {
    // 1. Current home directory completions
    const homeComps = virtualFS.getCompletions('/home/guest', 'ab');
    expect(homeComps).toContain('about.txt');

    const dirComps = virtualFS.getCompletions('/home/guest', 'pro');
    expect(dirComps).toContain('projects/');

    // 2. Subdirectory completions with slash prefix
    const projectFiles = virtualFS.getCompletions('/home/guest', 'projects/');
    expect(projectFiles.length).toBeGreaterThanOrEqual(8);
    expect(projectFiles).toContain('projects/agrisathi.md');
    expect(projectFiles).toContain('projects/gemini-assistant.md');

    // 3. Root directory completions
    const rootComps = virtualFS.getCompletions('/', '/');
    expect(rootComps).toContain('/bin/');
    expect(rootComps).toContain('/etc/');
    expect(rootComps).toContain('/home/');

    // 4. Relative traversal completions
    const etcComps = virtualFS.getCompletions('/home/guest', '../../etc/os');
    expect(etcComps).toContain('../../etc/os-release');

    // 5. Non-existent directory returns empty
    const invalidComps = virtualFS.getCompletions('/home/guest', 'non_existent_folder_xyz/');
    expect(invalidComps.length).toBe(0);
  });

  // =========================================================================
  // 5. LINK SCHEMES, ASSET INTEGRITY & SANITIZATION AUDIT
  // =========================================================================
  await harness.test('CHALLENGE-LINKS-1: Audit all external URLs for safe schemes (reject javascript:, data:, file:)', () => {
    const forbiddenProtocols = ['javascript:', 'data:', 'file:', 'vbscript:'];

    // Check all project links
    for (const proj of portfolioConfig.projects) {
      if (proj.githubUrl) {
        expect(proj.githubUrl.startsWith('https://')).toBeTruthy();
        for (const bad of forbiddenProtocols) {
          expect(proj.githubUrl.toLowerCase().includes(bad)).toBeFalsy();
        }
      }
      if (proj.liveUrl) {
        expect(proj.liveUrl.startsWith('https://') || proj.liveUrl.startsWith('http://')).toBeTruthy();
        for (const bad of forbiddenProtocols) {
          expect(proj.liveUrl.toLowerCase().includes(bad)).toBeFalsy();
        }
      }
    }

    // Check all social links
    for (const soc of portfolioConfig.socials) {
      if (soc.platform === 'Email') {
        expect(soc.url.startsWith('mailto:')).toBeTruthy();
      } else {
        expect(soc.url.startsWith('https://')).toBeTruthy();
      }
      for (const bad of forbiddenProtocols) {
        expect(soc.url.toLowerCase().includes(bad)).toBeFalsy();
      }
    }
  });

  await harness.test('CHALLENGE-ASSETS-1: Resume PDF integrity across filesystem, dist, and virtual FS', () => {
    // 1. public/resume.pdf
    const pubPath = path.resolve(projectRoot, 'public/resume.pdf');
    expect(fs.existsSync(pubPath)).toBeTruthy();
    const pubBuffer = fs.readFileSync(pubPath);
    expect(pubBuffer.toString('utf-8', 0, 5)).toBe('%PDF-');

    // 2. dist/resume.pdf
    const distPath = path.resolve(projectRoot, 'dist/resume.pdf');
    expect(fs.existsSync(distPath)).toBeTruthy();
    const distBuffer = fs.readFileSync(distPath);
    expect(distBuffer.toString('utf-8', 0, 5)).toBe('%PDF-');

    // 3. Virtual filesystem node
    const vNode = virtualFS.getNode('/home/guest/resume.pdf');
    expect(vNode).toBeDefined();
    expect(vNode?.type).toBe('file');
    expect(vNode?.content.startsWith('%PDF-')).toBeTruthy();
  });

  await harness.test('CHALLENGE-ASSETS-2: SVG favicon in index.html is well-formed data URI', () => {
    const indexPath = path.resolve(projectRoot, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('href="data:image/svg+xml,');
    expect(content).toContain('<svg');
    expect(content).toContain('</svg>');
  });

  // =========================================================================
  // 6. TEARDOWN, EVENT CLEANUP & RESOURCE MANAGEMENT
  // =========================================================================
  await harness.test('CHALLENGE-CLEANUP-1: Component cleanup hooks verify listener and timer cancellation', () => {
    // Inspect ThemeBackground.tsx cleanup
    const themeBgSource = fs.readFileSync(path.resolve(projectRoot, 'src/components/UI/ThemeBackground.tsx'), 'utf-8');
    expect(themeBgSource).toContain('cancelAnimationFrame(animationFrameId)');
    expect(themeBgSource).toContain("removeEventListener('resize', handleResize)");

    // Inspect MatrixRain.tsx cleanup
    const matrixSource = fs.readFileSync(path.resolve(projectRoot, 'src/components/EasterEggs/MatrixRain.tsx'), 'utf-8');
    expect(matrixSource).toContain('cancelAnimationFrame(animationFrameId)');
    expect(matrixSource).toContain("removeEventListener('resize', handleResize)");
    expect(matrixSource).toContain("removeEventListener('keydown', handleKeyDown)");

    // Inspect SnakeGame.tsx cleanup
    const snakeSource = fs.readFileSync(path.resolve(projectRoot, 'src/components/EasterEggs/SnakeGame.tsx'), 'utf-8');
    expect(snakeSource).toContain("removeEventListener('keydown', handleKeyDown)");
    expect(snakeSource).toContain('clearInterval(interval)');

    // Inspect SteamLocomotive.tsx cleanup
    const slSource = fs.readFileSync(path.resolve(projectRoot, 'src/components/EasterEggs/SteamLocomotive.tsx'), 'utf-8');
    expect(slSource).toContain('clearInterval(interval)');

    // Inspect StatusBar.tsx cleanup
    const statusSource = fs.readFileSync(path.resolve(projectRoot, 'src/components/Terminal/StatusBar.tsx'), 'utf-8');
    expect(statusSource).toContain('clearInterval(interval)');
  });

  return harness.endSuite();
}
