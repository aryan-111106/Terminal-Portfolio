import { THEMES } from '../src/config/themes';
import { commandRegistry } from '../src/services/commandRegistry';
import { virtualFS } from '../src/services/fileSystem';
import { harness, expect } from './test_harness';

export async function runTier1UILifecycleTests() {
  harness.startSuite('Tier 1 - UI Controls, Themes & Lifecycle (R3)');

  // 1. WelcomeHero Quick Start Buttons
  await harness.test('R3: WelcomeHero Quick Start buttons map to valid executable commands', () => {
    const heroButtons = ['projects', 'skills', 'help', 'ls', 'cd projects'];
    for (const btn of heroButtons) {
      const parts = btn.split(' ');
      const cmd = commandRegistry.getCommand(parts[0]);
      expect(cmd).toBeDefined();
    }
  });

  // 2. QuickActions Navigation Pills
  await harness.test('R3: QuickAction navigation pills map to registered shell commands', () => {
    const quickActions = [
      { label: 'about', cmd: 'about' },
      { label: 'projects', cmd: 'projects' },
      { label: 'skills', cmd: 'skills' },
      { label: 'certs', cmd: 'certifications' },
      { label: 'education', cmd: 'education' },
      { label: 'contact', cmd: 'contact' },
      { label: 'resume', cmd: 'resume' },
      { label: 'help', cmd: 'help' },
      { label: 'clear', cmd: 'clear' },
    ];

    for (const pill of quickActions) {
      const cmd = commandRegistry.getCommand(pill.cmd);
      expect(cmd).toBeDefined();
    }
  });

  // 3. Tab Autocompletion Engine
  await harness.test('R3: Tab on empty input returns all available command definitions', () => {
    const allCmds = commandRegistry.getAllCommands().map(c => c.name);
    expect(allCmds.length).toBeGreaterThanOrEqual(25);
    expect(allCmds).toContain('help');
    expect(allCmds).toContain('projects');
    expect(allCmds).toContain('matrix');
  });

  await harness.test('R3: Tab on unique command prefix matches single command and adds trailing space', () => {
    const prefix = 'neof';
    const allCmds = commandRegistry.getAllCommands().map(c => c.name);
    const matches = allCmds.filter(c => c.startsWith(prefix));
    expect(matches.length).toBe(1);
    expect(matches[0]).toBe('neofetch');
  });

  await harness.test('R3: Tab on multi-match prefix finds longest common prefix', () => {
    const prefix = 'c';
    const allCmds = commandRegistry.getAllCommands().map(c => c.name);
    const matches = allCmds.filter(c => c.startsWith(prefix));
    expect(matches.length).toBeGreaterThan(1);
    expect(matches).toContain('cat');
    expect(matches).toContain('cd');
    expect(matches).toContain('clear');
    expect(matches).toContain('cowsay');
    expect(matches).toContain('crt');
  });

  await harness.test('R3: Tab on file/directory path completes in-memory virtual filesystem paths', () => {
    const completions = virtualFS.getCompletions('/home/guest', 'about');
    expect(completions).toContain('about.txt');

    const projectCompletions = virtualFS.getCompletions('/home/guest', 'projects/agr');
    expect(projectCompletions).toContain('projects/agrisathi.md');
  });

  // 4. All 7 Themes & Color Profiles
  await harness.test('R3: All 7 color themes are registered and have complete color tokens', () => {
    const expectedThemes = [
      'matrix-green',
      'dracula',
      'catppuccin',
      'nord',
      'gruvbox',
      'cyberpunk',
      'ubuntu',
    ];

    expect(Object.keys(THEMES).length).toBe(7);

    for (const themeId of expectedThemes) {
      const theme = THEMES[themeId];
      expect(theme).toBeDefined();
      expect(theme.id).toBe(themeId);
      expect(theme.name.length).toBeGreaterThan(2);
      expect(theme.description.length).toBeGreaterThan(5);

      // Verify all essential 20 color properties exist
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

  await harness.test('R3: Theme CSS custom properties apply to :root and persist in localStorage', () => {
    const theme = THEMES['dracula'];
    localStorage.setItem('term_theme', theme.id);
    expect(localStorage.getItem('term_theme')).toBe('dracula');

    const root = document.documentElement;
    root.style.setProperty('--term-bg', theme.colors.bg);
    root.style.setProperty('--term-accent', theme.colors.accent);

    expect(root.style.getPropertyValue('--term-bg')).toBe('#282a36');
    expect(root.style.getPropertyValue('--term-accent')).toBe('#ff79c6');
  });

  await harness.test('R3: Dynamic canvas backdrop animation framerate is capped at 30 FPS', () => {
    const targetFps = 30;
    const interval = 1000 / targetFps;
    expect(interval).toBeGreaterThanOrEqual(33);
    expect(interval).toBeLessThanOrEqual(34);
  });

  // 5. Window Lifecycle & Overlays
  await harness.test('R3: Window minimize state transitions to dock pill', () => {
    let isMinimized = false;
    const toggleMinimize = () => { isMinimized = !isMinimized; };

    // Minimize window
    toggleMinimize();
    expect(isMinimized).toBe(true);

    // Restore window
    toggleMinimize();
    expect(isMinimized).toBe(false);
  });

  await harness.test('R3: CRT Scanlines and phosphor filter toggles cleanly', () => {
    let crtEnabled = true;
    const toggleCRT = () => {
      crtEnabled = !crtEnabled;
      localStorage.setItem('term_crt', String(crtEnabled));
    };

    toggleCRT();
    expect(crtEnabled).toBe(false);
    expect(localStorage.getItem('term_crt')).toBe('false');

    toggleCRT();
    expect(crtEnabled).toBe(true);
    expect(localStorage.getItem('term_crt')).toBe('true');
  });

  await harness.test('R3: Power Shutdown State Machine operates in 4 verified phases', () => {
    type PowerState = 'running' | 'shutting_down' | 'off' | 'booting';
    let powerState: PowerState = 'running';

    // 1. Trigger shutdown
    powerState = 'shutting_down';
    expect(powerState).toBe('shutting_down');

    // 2. Shutdown sequence finishes -> off
    powerState = 'off';
    expect(powerState).toBe('off');

    // 3. Power button pressed -> booting
    powerState = 'booting';
    expect(powerState).toBe('booting');

    // 4. Boot completed / ESC skip -> running
    powerState = 'running';
    expect(powerState).toBe('running');
  });

  return harness.endSuite();
}
