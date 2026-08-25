import { commandRegistry } from '../src/services/commandRegistry';
import { virtualFS } from '../src/services/fileSystem';
import { CommandContext } from '../src/types/terminal';
import { harness, expect } from './test_harness';

function createStatefulTerminalSession() {
  let cwd = virtualFS.homePath;
  let historyList: string[] = [];
  let theme = 'matrix-green';
  let soundEnabled = true;
  let crtEnabled = true;
  let activeEasterEgg: string | null = null;
  let shutdownTriggered = false;

  const ctx: CommandContext = {
    get cwd() { return cwd; },
    setCwd: (newCwd) => {
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
  };

  const execute = async (raw: string) => {
    historyList.push(raw);
    return commandRegistry.execute(raw, ctx);
  };

  return { ctx, execute, getHistory: () => historyList, isShutdown: () => shutdownTriggered };
}

export async function runTier3CombinationsTests() {
  harness.startSuite('Tier 3 - Cross-Feature Combinations');

  // 1. Chained Workflow: Theme -> CD -> Autocomplete -> Cat -> History -> Clear
  await harness.test('Tier 3: Multi-step pipeline: Theme change -> Directory navigation -> File inspection -> History recall -> Screen clear', async () => {
    const session = createStatefulTerminalSession();

    // Step 1: Switch theme
    const resTheme = await session.execute('theme dracula');
    expect(resTheme.type).toBe('success');
    expect(session.ctx.theme).toBe('dracula');

    // Step 2: Navigate to projects directory
    const resCd = await session.execute('cd projects');
    expect(resCd.type).toBe('text');
    expect(session.ctx.cwd).toBe('/home/guest/projects');

    // Step 3: Autocomplete check for agrisathi
    const completions = virtualFS.getCompletions(session.ctx.cwd, 'agri');
    expect(completions).toContain('agrisathi.md');

    // Step 4: Cat the project file
    const resCat = await session.execute('cat agrisathi.md');
    expect(resCat.type).toBe('text');
    expect(resCat.output).toContain('AgriSathi');
    expect(resCat.output).toContain('GitHub:');

    // Step 5: Check session history
    const resHistory = await session.execute('history');
    expect(resHistory.type).toBe('text');
    expect(resHistory.output).toContain('1  theme dracula');
    expect(resHistory.output).toContain('2  cd projects');
    expect(resHistory.output).toContain('3  cat agrisathi.md');

    // Step 6: Clear screen
    const resClear = await session.execute('clear');
    expect(resClear.type).toBe('clear');
    expect(session.getHistory().length).toBe(0);
  });

  // 2. Virtual Filesystem Lifecycle
  await harness.test('Tier 3: Dynamic Filesystem Lifecycle: Create Dir -> Enter -> Create File -> List -> Read -> Exit -> Remove', async () => {
    const session = createStatefulTerminalSession();
    const testDirName = 'e2e_lifecycle_sandbox';
    const testFileName = 'build_notes.txt';

    // Step 1: Create directory
    const mkRes = await session.execute(`mkdir ${testDirName}`);
    expect(mkRes.type).toBe('success');

    // Step 2: CD into directory
    await session.execute(`cd ${testDirName}`);
    expect(session.ctx.cwd).toBe(`/home/guest/${testDirName}`);

    // Step 3: Touch file
    const touchRes = await session.execute(`touch ${testFileName}`);
    expect(touchRes.type).toBe('text');

    // Step 4: List directory with -la
    const lsRes = await session.execute('ls -la');
    expect(lsRes.output).toContain(testFileName);

    // Step 5: Cat file
    const catRes = await session.execute(`cat ${testFileName}`);
    expect(catRes.output).toBe('');

    // Step 6: CD back to parent
    await session.execute('cd ..');
    expect(session.ctx.cwd).toBe('/home/guest');

    // Step 7: Remove directory
    const rmRes = await session.execute(`rm ${testDirName}`);
    expect(rmRes.type).toBe('text');

    // Verify removed
    const lsAfter = await session.execute('ls');
    expect(lsAfter.output.includes(testDirName)).toBeFalsy();
  });

  // 3. Settings Synchronization & Customization Sequence
  await harness.test('Tier 3: Sequential audio, CRT, and theme mutations maintain state consistency', async () => {
    const session = createStatefulTerminalSession();

    // Toggle Audio off
    await session.execute('sound off');
    expect(session.ctx.soundEnabled).toBe(false);

    // Toggle CRT on
    await session.execute('crt on');
    expect(session.ctx.crtEnabled).toBe(true);

    // Switch theme to cyberpunk
    await session.execute('theme cyberpunk');
    expect(session.ctx.theme).toBe('cyberpunk');

    // Toggle CRT off
    await session.execute('crt off');
    expect(session.ctx.crtEnabled).toBe(false);

    // Toggle Audio on
    await session.execute('sound on');
    expect(session.ctx.soundEnabled).toBe(true);
  });

  // 4. Deep System Directory Exploration (/etc)
  await harness.test('Tier 3: Deep system exploration in /etc and path restoration to home (~)', async () => {
    const session = createStatefulTerminalSession();

    // Navigate to root
    await session.execute('cd /');
    expect(session.ctx.cwd).toBe('/');

    // Navigate to /etc
    await session.execute('cd etc');
    expect(session.ctx.cwd).toBe('/etc');

    // Autocomplete on os-release
    const comp = virtualFS.getCompletions('/etc', 'os');
    expect(comp).toContain('os-release');

    // Cat os-release
    const osRes = await session.execute('cat os-release');
    expect(osRes.output).toContain('Portfolio Linux');

    // Cat hostname
    const hostRes = await session.execute('cat hostname');
    expect(hostRes.output.length).toBeGreaterThan(3);

    // Return to home
    await session.execute('cd ~');
    expect(session.ctx.cwd).toBe('/home/guest');
  });

  return harness.endSuite();
}
