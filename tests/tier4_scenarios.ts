import { commandRegistry } from '../src/services/commandRegistry';
import { virtualFS } from '../src/services/fileSystem';
import { visitorService } from '../src/services/visitorService';
import { portfolioConfig } from '../src/config/portfolio.config';
import { CommandContext } from '../src/types/terminal';
import { harness, expect } from './test_harness';

function createScenarioSession() {
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

export async function runTier4ScenariosTests() {
  harness.startSuite('Tier 4 - Real-World Application Scenarios');

  // Scenario 1: Recruiter Exploration
  await harness.test('Scenario 1: Recruiter Exploration (welcome -> about -> skills -> projects -> experience -> education -> certifications -> resume -> contact)', async () => {
    const s = createScenarioSession();

    const welcome = await s.execute('welcome');
    expect(welcome.type).toBe('welcome');

    const about = await s.execute('about');
    expect(about.type).toBe('about');

    const skills = await s.execute('skills');
    expect(skills.type).toBe('skills');

    const projects = await s.execute('projects');
    expect(projects.type).toBe('projects');

    const exp = await s.execute('experience');
    expect(exp.type).toBe('experience');

    const edu = await s.execute('education');
    expect(edu.type).toBe('info');
    expect(edu.output).toContain('Haldia Institute of Technology');

    const certs = await s.execute('certifications');
    expect(certs.type).toBe('info');
    expect(certs.output).toContain('Oracle Cloud Infrastructure');

    const resume = await s.execute('resume');
    expect(resume.type).toBe('success');
    expect(resume.output).toContain('resume.pdf');

    const contact = await s.execute('contact');
    expect(contact.type).toBe('contact');
  });

  // Scenario 2: Terminal Power User
  await harness.test('Scenario 2: Terminal Power User (pwd -> ls -la -> cd projects -> cat agrisathi.md -> tree -> history -> clear)', async () => {
    const s = createScenarioSession();

    const pwd1 = await s.execute('pwd');
    expect(pwd1.output).toBe('/home/guest');

    const ls = await s.execute('ls -la');
    expect(ls.output).toContain('.bashrc');
    expect(ls.output).toContain('projects/');

    await s.execute('cd projects');
    expect(s.ctx.cwd).toBe('/home/guest/projects');

    const catProj = await s.execute('cat agrisathi.md');
    expect(catProj.output).toContain('AgriSathi');

    const tree = await s.execute('tree');
    expect(tree.type).toBe('tree');

    const history = await s.execute('history');
    expect(history.output).toContain('cd projects');

    const clear = await s.execute('clear');
    expect(clear.type).toBe('clear');
    expect(s.getHistory().length).toBe(0);
  });

  // Scenario 3: Customization Enthusiast
  await harness.test('Scenario 3: Customization Enthusiast (cycles 7 themes -> toggles sound & CRT -> neofetch -> matrix)', async () => {
    const s = createScenarioSession();

    const themesList = [
      'matrix-green',
      'dracula',
      'catppuccin',
      'nord',
      'gruvbox',
      'cyberpunk',
      'ubuntu'
    ];

    for (const t of themesList) {
      const res = await s.execute(`theme ${t}`);
      expect(res.type).toBe('success');
      expect(s.ctx.theme).toBe(t);
    }

    await s.execute('crt toggle');
    expect(s.ctx.crtEnabled).toBe(false);

    await s.execute('sound toggle');
    expect(s.ctx.soundEnabled).toBe(false);

    const neofetch = await s.execute('neofetch');
    expect(neofetch.type).toBe('neofetch');

    const matrix = await s.execute('matrix');
    expect(matrix.type).toBe('success');
    expect(s.ctx.activeEasterEgg).toBe('matrix');
  });

  // Scenario 4: Easter Egg Gamer
  await harness.test('Scenario 4: Easter Egg Gamer (snake -> cowsay -> sl -> matrix -> sudo -> vim -> quote)', async () => {
    const s = createScenarioSession();

    const snake = await s.execute('snake');
    expect(snake.type).toBe('success');
    expect(s.ctx.activeEasterEgg).toBe('snake');

    const cowsay = await s.execute('cowsay Vibe coding is amazing');
    expect(cowsay.type).toBe('cowsay');

    const sl = await s.execute('sl');
    expect(sl.type).toBe('info');
    expect(s.ctx.activeEasterEgg).toBe('sl');

    const matrix = await s.execute('matrix');
    expect(matrix.type).toBe('success');
    expect(s.ctx.activeEasterEgg).toBe('matrix');

    const sudo = await s.execute('sudo make me a sandwich');
    expect(sudo.type).toBe('error');
    expect(sudo.output.length).toBeGreaterThan(10);

    const vim = await s.execute('vim secret.txt');
    expect(vim.type).toBe('warning');
    expect(vim.output).toContain('read-only');

    const quote = await s.execute('quote');
    expect(quote.type).toBe('info');
    expect(quote.output.length).toBeGreaterThan(10);
  });

  // Scenario 5: System Telemetry Inspector
  await harness.test('Scenario 5: System Telemetry Inspector (whoami -> sysinfo -> weather -> uptime -> date -> shutdown)', async () => {
    const s = createScenarioSession();

    const whoami = await s.execute('whoami');
    expect(whoami.type).toBe('whoami');

    const sysinfo = await s.execute('sysinfo');
    expect(sysinfo.type).toBe('sysinfo');

    const weather = await s.execute('weather');
    expect(weather.type).toBe('weather');

    const uptime = await s.execute('uptime');
    expect(uptime.type).toBe('text');
    expect(uptime.output).toContain('load average');

    const date = await s.execute('date');
    expect(date.type).toBe('text');

    const shutdown = await s.execute('shutdown');
    expect(shutdown.type).toBe('warning');
    expect(s.isShutdown()).toBe(true);

    // Verify visitor service telemetry contracts
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
