import { commandRegistry } from '../src/services/commandRegistry';
import { virtualFS } from '../src/services/fileSystem';
import { portfolioConfig } from '../src/config/portfolio.config';
import { CommandContext } from '../src/types/terminal';
import { harness, expect } from './test_harness';

function createMockContext(cwdOrOverrides?: string | Partial<CommandContext>, overrides?: Partial<CommandContext>): CommandContext {
  const actualOverrides = (typeof cwdOrOverrides === 'object' && cwdOrOverrides !== null ? cwdOrOverrides : overrides) || {};
  let cwd = typeof cwdOrOverrides === 'string' ? cwdOrOverrides : (actualOverrides.cwd || virtualFS.homePath);
  let historyList: string[] = actualOverrides.historyList ? [...actualOverrides.historyList] : ['welcome'];
  let theme = actualOverrides.theme || 'matrix-green';
  let soundEnabled = actualOverrides.soundEnabled !== undefined ? actualOverrides.soundEnabled : true;
  let crtEnabled = actualOverrides.crtEnabled !== undefined ? actualOverrides.crtEnabled : true;
  let activeEasterEgg: string | null = actualOverrides.activeEasterEgg !== undefined ? actualOverrides.activeEasterEgg : null;
  let shutdownTriggered = false;

  const base: CommandContext = {
    get cwd() { return cwd; },
    setCwd: (newCwd: string | ((p: string) => string)) => {
      cwd = typeof newCwd === 'function' ? newCwd(cwd) : newCwd;
    },
    clearHistory: () => {
      historyList = [];
    },
    get historyList() { return historyList; },
    set historyList(newList: string[]) {
      historyList = newList;
    },
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

  if (actualOverrides.triggerShutdown) {
    base.triggerShutdown = actualOverrides.triggerShutdown;
  }
  if (actualOverrides.clearHistory) {
    base.clearHistory = actualOverrides.clearHistory;
  }

  return base;
}

export async function runTier1CommandsTests() {
  harness.startSuite('Tier 1 - Shell Commands & Navigation (R2)');

  // 1. Portfolio Commands
  await harness.test('R2: command "about" renders bio summary and profile', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('about', ctx);
    expect(res.type).toBe('about');
  });

  await harness.test('R2: command "about" aliases ("bio", "me")', async () => {
    const ctx = createMockContext();
    const resBio = await commandRegistry.execute('bio', ctx);
    expect(resBio.type).toBe('about');
    const resMe = await commandRegistry.execute('me', ctx);
    expect(resMe.type).toBe('about');
  });

  await harness.test('R2: command "projects" returns all projects', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('projects', ctx);
    expect(res.type).toBe('projects');
  });

  await harness.test('R2: command "projects" filter flag ("projects ai", "projects python")', async () => {
    const ctx = createMockContext();
    const resAI = await commandRegistry.execute('projects ai', ctx);
    expect(resAI.type).toBe('projects');
    expect(resAI.rawArgs).toBeDefined();
    expect(resAI.rawArgs![0]).toBe('ai');
  });

  await harness.test('R2: command "projects" aliases ("work", "portfolio", "proj")', async () => {
    const ctx = createMockContext();
    for (const alias of ['work', 'portfolio', 'proj']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('projects');
    }
  });

  await harness.test('R2: command "skills" returns technical competencies', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('skills', ctx);
    expect(res.type).toBe('skills');
  });

  await harness.test('R2: command "skills" aliases ("stack", "tech", "technologies")', async () => {
    const ctx = createMockContext();
    for (const alias of ['stack', 'tech', 'technologies']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('skills');
    }
  });

  await harness.test('R2: command "experience" returns career history', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('experience', ctx);
    expect(res.type).toBe('experience');
  });

  await harness.test('R2: command "experience" aliases ("workhistory", "jobs", "exp")', async () => {
    const ctx = createMockContext();
    for (const alias of ['workhistory', 'jobs', 'exp']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('experience');
    }
  });

  await harness.test('R2: command "education" returns academic credentials', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('education', ctx);
    expect(res.type).toBe('info');
    expect(res.output).toContain('Haldia Institute of Technology');
  });

  await harness.test('R2: command "education" aliases ("edu", "degree")', async () => {
    const ctx = createMockContext();
    for (const alias of ['edu', 'degree']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('info');
      expect(res.output).toContain('Haldia Institute of Technology');
    }
  });

  await harness.test('R2: command "certifications" returns certifications & awards', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('certifications', ctx);
    expect(res.type).toBe('info');
    expect(res.output).toContain('Oracle Cloud Infrastructure');
  });

  await harness.test('R2: command "certifications" aliases ("certs", "certification", "awards", "honors")', async () => {
    const ctx = createMockContext();
    for (const alias of ['certs', 'certification', 'awards', 'honors']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('info');
      expect(res.output).toContain('Oracle Cloud Infrastructure');
    }
  });

  await harness.test('R2: command "contact" returns contact details and social handles', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('contact', ctx);
    expect(res.type).toBe('contact');
  });

  await harness.test('R2: command "contact" aliases ("socials", "email", "social", "reach")', async () => {
    const ctx = createMockContext();
    for (const alias of ['socials', 'email', 'social', 'reach']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('contact');
    }
  });

  await harness.test('R2: command "resume" triggers resume open and returns success', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('resume', ctx);
    expect(res.type).toBe('success');
    expect(res.output).toContain('resume.pdf');
  });

  await harness.test('R2: command "resume" alias ("cv")', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('cv', ctx);
    expect(res.type).toBe('success');
    expect(res.output).toContain('resume.pdf');
  });

  // 2. System & Telemetry Commands
  await harness.test('R2: command "whoami" returns visitor identity & user agent', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('whoami', ctx);
    expect(res.type).toBe('whoami');
  });

  await harness.test('R2: command "whoami" aliases ("user", "client", "visitor")', async () => {
    const ctx = createMockContext();
    for (const alias of ['user', 'client', 'visitor']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('whoami');
    }
  });

  await harness.test('R2: command "sysinfo" returns system specs & hardware telemetry', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('sysinfo', ctx);
    expect(res.type).toBe('sysinfo');
  });

  await harness.test('R2: command "sysinfo" aliases ("uname", "system", "specs", "hardware")', async () => {
    const ctx = createMockContext();
    for (const alias of ['uname', 'system', 'specs', 'hardware']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('sysinfo');
    }
  });

  await harness.test('R2: command "weather" returns live/fallback weather metrics', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('weather', ctx);
    expect(res.type).toBe('weather');
  });

  await harness.test('R2: command "weather" aliases ("wttr", "forecast")', async () => {
    const ctx = createMockContext();
    for (const alias of ['wttr', 'forecast']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('weather');
    }
  });

  await harness.test('R2: command "date" returns valid formatted date string', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('date', ctx);
    expect(res.type).toBe('text');
    expect(res.output.length).toBeGreaterThan(10);
  });

  await harness.test('R2: command "uptime" returns session uptime and load average', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('uptime', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toContain('up');
    expect(res.output).toContain('load average');
  });

  await harness.test('R2: command "shutdown" dispatches shutdown trigger', async () => {
    let triggered = false;
    const ctx = createMockContext({
      triggerShutdown: () => { triggered = true; }
    });
    const res = await commandRegistry.execute('shutdown', ctx);
    expect(res.type).toBe('warning');
    expect(triggered).toBe(true);
  });

  await harness.test('R2: command "shutdown" aliases ("exit", "poweroff", "quit", "halt")', async () => {
    for (const alias of ['exit', 'poweroff', 'quit', 'halt']) {
      let triggered = false;
      const ctx = createMockContext({
        triggerShutdown: () => { triggered = true; }
      });
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('warning');
      expect(triggered).toBe(true);
    }
  });

  await harness.test('R2: command "help" lists all categorized commands', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('help', ctx);
    expect(res.type).toBe('help');
  });

  await harness.test('R2: command "help <cmd>" returns manual entry for specific command', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('help cd', ctx);
    expect(res.type).toBe('info');
    expect(res.output).toContain('COMMAND: cd');
    expect(res.output).toContain('USAGE:');
  });

  await harness.test('R2: command "help" aliases ("?", "man", "commands")', async () => {
    const ctx = createMockContext();
    for (const alias of ['?', 'man', 'commands']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('help');
    }
  });

  await harness.test('R2: command "clear" dispatches history flush', async () => {
    let cleared = false;
    const ctx = createMockContext({
      clearHistory: () => { cleared = true; }
    });
    const res = await commandRegistry.execute('clear', ctx);
    expect(res.type).toBe('clear');
    expect(cleared).toBe(true);
  });

  await harness.test('R2: command "clear" aliases ("cls", "reset")', async () => {
    for (const alias of ['cls', 'reset']) {
      let cleared = false;
      const ctx = createMockContext({
        clearHistory: () => { cleared = true; }
      });
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('clear');
      expect(cleared).toBe(true);
    }
  });

  await harness.test('R2: command "welcome" returns hero welcome banner', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('welcome', ctx);
    expect(res.type).toBe('welcome');
  });

  await harness.test('R2: command "welcome" aliases ("banner", "hero", "start")', async () => {
    const ctx = createMockContext();
    for (const alias of ['banner', 'hero', 'start']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('welcome');
    }
  });

  // 3. Virtual Filesystem Navigation & Operations
  await harness.test('R2: command "pwd" returns current working directory', async () => {
    const ctx = createMockContext('/home/guest/projects');
    const res = await commandRegistry.execute('pwd', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toBe('/home/guest/projects');
  });

  await harness.test('R2: command "ls" lists directory entries', async () => {
    const ctx = createMockContext('/home/guest');
    const res = await commandRegistry.execute('ls', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toContain('about.txt');
    expect(res.output).toContain('projects/');
  });

  await harness.test('R2: command "ls -a" includes hidden files (.bashrc, .secret.txt)', async () => {
    const ctx = createMockContext('/home/guest');
    const res = await commandRegistry.execute('ls -a', ctx);
    expect(res.output).toContain('.bashrc');
    expect(res.output).toContain('.secret.txt');
  });

  await harness.test('R2: command "ls -l" displays permissions, size and modified date', async () => {
    const ctx = createMockContext('/home/guest');
    const res = await commandRegistry.execute('ls -l', ctx);
    expect(res.output).toContain('guest guest');
    expect(res.output).toContain('-rw-r--r--');
  });

  await harness.test('R2: command "ls" aliases ("dir", "ll", "la")', async () => {
    const ctx = createMockContext('/home/guest');
    const resDir = await commandRegistry.execute('dir', ctx);
    expect(resDir.output).toContain('about.txt');
    const resLL = await commandRegistry.execute('ll', ctx);
    expect(resLL.output).toContain('about.txt');
    const resLA = await commandRegistry.execute('la', ctx);
    expect(resLA.output).toContain('about.txt');
  });

  await harness.test('R2: command "cd" updates cwd and supports relative and absolute paths', async () => {
    const ctx = createMockContext('/home/guest');

    await commandRegistry.execute('cd projects', ctx);
    expect(ctx.cwd).toBe('/home/guest/projects');

    await commandRegistry.execute('cd ..', ctx);
    expect(ctx.cwd).toBe('/home/guest');

    await commandRegistry.execute('cd /etc', ctx);
    expect(ctx.cwd).toBe('/etc');

    await commandRegistry.execute('cd ~', ctx);
    expect(ctx.cwd).toBe('/home/guest');

    await commandRegistry.execute('cd', ctx);
    expect(ctx.cwd).toBe('/home/guest');
  });

  await harness.test('R2: command "cat" reads virtual file contents', async () => {
    const ctx = createMockContext('/home/guest');
    const res = await commandRegistry.execute('cat about.txt', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toContain(portfolioConfig.name);
  });

  await harness.test('R2: command "cat resume.pdf" triggers browser open and prints header', async () => {
    const ctx = createMockContext('/home/guest');
    const res = await commandRegistry.execute('cat resume.pdf', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toContain('PDF Document');
  });

  await harness.test('R2: command "tree" generates ASCII hierarchical branch tree', async () => {
    const ctx = createMockContext('/home/guest');
    const res = await commandRegistry.execute('tree', ctx);
    expect(res.type).toBe('tree');
    expect(res.output).toContain('├──');
  });

  await harness.test('R2: filesystem file creation and removal ("mkdir", "touch", "rm")', async () => {
    const ctx = createMockContext('/home/guest');
    
    // mkdir
    const mkRes = await commandRegistry.execute('mkdir test_unit_dir', ctx);
    expect(mkRes.type).toBe('success');
    expect(virtualFS.getNode('/home/guest/test_unit_dir')).toBeDefined();

    // touch
    const touchRes = await commandRegistry.execute('touch test_unit_dir/sample.txt', ctx);
    expect(touchRes.type).toBe('text');
    expect(virtualFS.getNode('/home/guest/test_unit_dir/sample.txt')).toBeDefined();

    // cat created file
    const catRes = await commandRegistry.execute('cat test_unit_dir/sample.txt', ctx);
    expect(catRes.output).toBe('');

    // rm file
    await commandRegistry.execute('rm test_unit_dir/sample.txt', ctx);
    expect(virtualFS.getNode('/home/guest/test_unit_dir/sample.txt')).toBeNull();

    // rm dir
    await commandRegistry.execute('rm test_unit_dir', ctx);
    expect(virtualFS.getNode('/home/guest/test_unit_dir')).toBeNull();
  });

  // 4. Easter Eggs & Mini-Games
  await harness.test('R2: command "neofetch" returns distribution logo and system specifications', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('neofetch', ctx);
    expect(res.type).toBe('neofetch');
  });

  await harness.test('R2: command "neofetch" aliases ("fastfetch", "fetch", "logo")', async () => {
    const ctx = createMockContext();
    for (const alias of ['fastfetch', 'fetch', 'logo']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('neofetch');
    }
  });

  await harness.test('R2: command "cowsay" formats speech bubble and cow', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('cowsay Hello Vibe Coder', ctx);
    expect(res.type).toBe('cowsay');
    expect(res.output).toBe('Hello Vibe Coder');
  });

  await harness.test('R2: command "cowsay" alias ("cow")', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('cow Mooo', ctx);
    expect(res.type).toBe('cowsay');
  });

  await harness.test('R2: command "matrix" activates matrix rain easter egg', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('matrix', ctx);
    expect(res.type).toBe('success');
    expect(ctx.activeEasterEgg).toBe('matrix');
  });

  await harness.test('R2: command "matrix" aliases ("cmatrix", "rain")', async () => {
    for (const alias of ['cmatrix', 'rain']) {
      const ctx = createMockContext();
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('success');
      expect(ctx.activeEasterEgg).toBe('matrix');
    }
  });

  await harness.test('R2: command "snake" activates snake game arcade', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('snake', ctx);
    expect(res.type).toBe('success');
    expect(ctx.activeEasterEgg).toBe('snake');
  });

  await harness.test('R2: command "snake" aliases ("game", "arcade")', async () => {
    for (const alias of ['game', 'arcade']) {
      const ctx = createMockContext();
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('success');
      expect(ctx.activeEasterEgg).toBe('snake');
    }
  });

  await harness.test('R2: command "sl" activates steam locomotive train animation', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('sl', ctx);
    expect(res.type).toBe('info');
    expect(ctx.activeEasterEgg).toBe('sl');
  });

  await harness.test('R2: command "sudo" returns permission denied quip', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('sudo rm -rf /', ctx);
    expect(res.type).toBe('error');
    expect(res.output.length).toBeGreaterThan(10);
  });

  await harness.test('R2: command "vim" returns read-only warning', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('vim index.html', ctx);
    expect(res.type).toBe('warning');
    expect(res.output).toContain('read-only');
  });

  await harness.test('R2: command "vim" aliases ("vi", "nano", "emacs")', async () => {
    const ctx = createMockContext();
    for (const alias of ['vi', 'nano', 'emacs']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('warning');
      expect(res.output).toContain('read-only');
    }
  });

  await harness.test('R2: command "quote" returns inspirational quote', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('quote', ctx);
    expect(res.type).toBe('info');
    expect(res.output.length).toBeGreaterThan(10);
  });

  await harness.test('R2: command "quote" aliases ("fortune", "motd")', async () => {
    const ctx = createMockContext();
    for (const alias of ['fortune', 'motd']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('info');
    }
  });

  // 5. Shell Utilities: theme, sound, crt, echo, history
  await harness.test('R2: command "theme" lists available themes or switches theme', async () => {
    const ctx = createMockContext();

    const listRes = await commandRegistry.execute('theme', ctx);
    expect(listRes.type).toBe('info');
    expect(listRes.output).toContain('dracula');

    const setRes = await commandRegistry.execute('theme dracula', ctx);
    expect(setRes.type).toBe('success');
    expect(ctx.theme).toBe('dracula');
  });

  await harness.test('R2: command "theme" aliases ("themes", "color", "colors")', async () => {
    const ctx = createMockContext();
    for (const alias of ['themes', 'color', 'colors']) {
      const res = await commandRegistry.execute(alias, ctx);
      expect(res.type).toBe('info');
    }
  });

  await harness.test('R2: command "sound" toggles Web Audio FX state', async () => {
    const ctx = createMockContext();

    await commandRegistry.execute('sound off', ctx);
    expect(ctx.soundEnabled).toBe(false);

    await commandRegistry.execute('sound on', ctx);
    expect(ctx.soundEnabled).toBe(true);

    await commandRegistry.execute('sound toggle', ctx);
    expect(ctx.soundEnabled).toBe(false);
  });

  await harness.test('R2: command "sound" aliases ("audio", "sfx", "mute")', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('audio toggle', ctx);
    expect(res.type).toBe('warning');
    expect(ctx.soundEnabled).toBe(false);
  });

  await harness.test('R2: command "crt" toggles retro CRT filter state', async () => {
    const ctx = createMockContext();

    await commandRegistry.execute('crt off', ctx);
    expect(ctx.crtEnabled).toBe(false);

    await commandRegistry.execute('crt on', ctx);
    expect(ctx.crtEnabled).toBe(true);

    await commandRegistry.execute('crt toggle', ctx);
    expect(ctx.crtEnabled).toBe(false);
  });

  await harness.test('R2: command "crt" aliases ("scanlines", "retro")', async () => {
    const ctx = createMockContext();
    for (const alias of ['scanlines', 'retro']) {
      const res = await commandRegistry.execute(`${alias} status`, ctx);
      expect(res.type).toBe('info');
    }
  });

  await harness.test('R2: command "echo" echoes arguments back', async () => {
    const ctx = createMockContext();
    const res = await commandRegistry.execute('echo Aryan Prasad Linux Portfolio', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toBe('Aryan Prasad Linux Portfolio');
  });

  await harness.test('R2: command "history" returns session commands list', async () => {
    const ctx = createMockContext({
      historyList: ['welcome', 'about', 'projects', 'skills']
    });
    const res = await commandRegistry.execute('history', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toContain('welcome');
    expect(res.output).toContain('about');
    expect(res.output).toContain('projects');
  });

  await harness.test('R2: command "history" alias ("hist")', async () => {
    const ctx = createMockContext({
      historyList: ['welcome', 'help']
    });
    const res = await commandRegistry.execute('hist', ctx);
    expect(res.type).toBe('text');
    expect(res.output).toContain('welcome');
  });

  return harness.endSuite();
}
