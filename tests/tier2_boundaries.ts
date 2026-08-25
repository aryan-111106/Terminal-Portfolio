import { commandRegistry } from '../src/services/commandRegistry';
import { virtualFS } from '../src/services/fileSystem';
import { CommandContext } from '../src/types/terminal';
import { harness, expect } from './test_harness';

function createMockContext(overrides?: Partial<CommandContext>): CommandContext {
  let cwd = virtualFS.homePath;
  let historyList: string[] = [];
  let theme = 'matrix-green';
  let soundEnabled = true;
  let crtEnabled = true;
  let activeEasterEgg: string | null = null;

  return {
    cwd,
    setCwd: (newCwd: string | ((p: string) => string)) => {
      cwd = typeof newCwd === 'function' ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    historyList,
    theme,
    setTheme: (newTheme: string) => {
      theme = newTheme;
    },
    soundEnabled,
    setSoundEnabled: (val) => {
      soundEnabled = typeof val === 'function' ? val(soundEnabled) : val;
    },
    crtEnabled,
    setCrtEnabled: (val) => {
      crtEnabled = typeof val === 'function' ? val(crtEnabled) : val;
    },
    activeEasterEgg,
    setActiveEasterEgg: (val: string | null) => {
      activeEasterEgg = val;
    },
    triggerShutdown: () => {},
    ...overrides,
  };
}

export async function runTier2BoundariesTests() {
  harness.startSuite('Tier 2 - Boundary & Corner Cases');

  // 1. Unknown Commands & Invalid Inputs
  await harness.test('Tier 2: Unknown command returns command-not-found error without crashing', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('non_existent_command_xyz', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('command not found');
  });

  await harness.test('Tier 2: Special characters and symbols as command name are handled safely', async () => {
    const ctx = createMockContext();
    const symbols = ['!@#$%', '???', '&&', '||', ';', '<script>'];
    for (const sym of symbols) {
      const res = await commandRegistry.execute(sym, ctx);
      expect(res.type).toBe('error');
      expect(res.output).toContain('command not found');
    }
  });

  await harness.test('Tier 2: Empty and whitespace-only strings return empty text response', async () => {
    const ctx = createMockContext();
    const empties = ['', '   ', '\t', '\n', '  \t  \n  '];
    for (const empty of empties) {
      const res = await commandRegistry.execute(empty, ctx);
      expect(res.type).toBe('text');
      expect(res.output).toBe('');
    }
  });

  // 2. Bad Arguments & Unknown Flags
  await harness.test('Tier 2: "help" with invalid command argument returns error message', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('help non_existent_cmd', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('no manual entry');
  });

  await harness.test('Tier 2: "theme" with invalid theme name returns error and lists valid themes', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('theme invalid_theme_xyz', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('Unknown theme');
    expect(res.output).toContain('matrix-green');
  });

  await harness.test('Tier 2: "projects" with non-matching filter returns filter warning in rawArgs', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('projects non_existent_tech_xyz', ctx);
    expect(res.type).toBe('projects');
    expect(res.rawArgs).toBeDefined();
    expect(res.rawArgs![0]).toBe('non_existent_tech_xyz');
  });

  await harness.test('Tier 2: "sound" with invalid argument safely toggles state with notification', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('sound invalid_arg', ctx);
    expect(res.type).toBe('warning');
    expect(res.output).toContain('Audio Sound FX is now:');
  });

  await harness.test('Tier 2: "crt" with invalid argument safely toggles state with notification', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('crt invalid_arg', ctx);
    expect(res.type).toBe('info');
    expect(res.output).toContain('CRT Monitor Scanlines:');
  });

  // 3. Filesystem Non-Existent Nodes & Errors
  await harness.test('Tier 2: "cd" to non-existent directory returns error and leaves cwd unchanged', async () => {
    let currentCwd = '/home/guest';
    const ctx = createMockContext({
      get cwd() { return currentCwd; },
      setCwd: (p) => { currentCwd = typeof p === 'function' ? p(currentCwd) : p; }
    });

    const res = await commandRegistry.execute('cd /nonexistent/folder/123', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('no such file or directory');
    expect(currentCwd).toBe('/home/guest');
  });

  await harness.test('Tier 2: "cd" into a file (not directory) returns not-a-directory error', async () => {
    let currentCwd = '/home/guest';
    const ctx = createMockContext({
      get cwd() { return currentCwd; },
      setCwd: (p) => { currentCwd = typeof p === 'function' ? p(currentCwd) : p; }
    });

    const res = await commandRegistry.execute('cd /etc/os-release', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('not a directory');
    expect(currentCwd).toBe('/home/guest');
  });

  await harness.test('Tier 2: "cat" on directory target returns is-a-directory error', async () => {
    const ctx = createMockContext({ cwd: '/home/guest' });
    const res = await commandRegistry.execute('cat projects', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('Is a directory');
  });

  await harness.test('Tier 2: "cat" on non-existent file returns no-such-file error', async () => {
    const ctx = createMockContext({ cwd: '/home/guest' });
    const res = await commandRegistry.execute('cat nonexistent_file.txt', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('No such file or directory');
  });

  await harness.test('Tier 2: "cat" without argument returns missing operand error', async () => {
    const ctx = createMockContext({ cwd: '/home/guest' });
    const res = await commandRegistry.execute('cat', ctx);
    expect(res.type).toBe('error');
    expect(res.output).toContain('missing file operand');
  });

  // 4. Path Traversal Boundary Handling
  await harness.test('Tier 2: Path traversal beyond root (/../../..) clamps at root (/)', () => {
    const resolved = virtualFS.resolvePath('/home/guest', '../../../../../..');
    expect(resolved).toBe('/');
  });

  await harness.test('Tier 2: Tilde traversal (~/../../..) clamps correctly', () => {
    const resolved = virtualFS.resolvePath('/home/guest', '~/../../..');
    expect(resolved).toBe('/');
  });

  await harness.test('Tier 2: Multiple consecutive slashes and dots resolve cleanly', () => {
    const resolved = virtualFS.resolvePath('/home/guest', '././projects/../projects/./');
    expect(resolved).toBe('/home/guest/projects');
  });

  // 5. Whitespace and Spacing Variations
  await harness.test('Tier 2: Multiple spaces between command and arguments parse correctly', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('echo     Multiple    Spaces    Tested   ', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toBe('Multiple Spaces Tested');
  });

  await harness.test('Tier 2: Case insensitivity on command name lookup', async () => {
    const ctx = createMockContext();
    const resUpper = await commandRegistry.execute('ABOUT', ctx);
    expect(resUpper.type).toBe('about');
    const resMixed = await commandRegistry.execute('PrOjEcTs', ctx);
    expect(resMixed.type).toBe('projects');
  });

  return harness.endSuite();
}
