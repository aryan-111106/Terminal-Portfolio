import { CommandContext, CommandDefinition, CommandResult } from '../types/terminal';
import { portfolioConfig } from '../config/portfolio.config';
import { THEMES } from '../config/themes';
import { virtualFS } from './fileSystem';
import { soundFX } from './soundFX';

export class CommandRegistry {
  private commands: Map<string, CommandDefinition> = new Map();
  private aliasMap: Map<string, string> = new Map();

  constructor() {
    this.registerDefaultCommands();
  }

  public register(cmd: CommandDefinition) {
    this.commands.set(cmd.name.toLowerCase(), cmd);
    if (cmd.aliases) {
      cmd.aliases.forEach(alias => {
        this.aliasMap.set(alias.toLowerCase(), cmd.name.toLowerCase());
      });
    }
  }

  public getCommand(name: string): CommandDefinition | undefined {
    const lower = name.toLowerCase();
    const resolvedName = this.aliasMap.get(lower) || lower;
    return this.commands.get(resolvedName);
  }

  public getAllCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  public async execute(rawInput: string, ctx: CommandContext): Promise<CommandResult> {
    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { output: '', type: 'text' };
    }

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const cmd = this.getCommand(cmdName);
    if (!cmd) {
      soundFX.playError();
      return {
        output: `zsh: command not found: ${cmdName}. Type 'help' or 'ls /bin' to see available commands.`,
        type: 'error',
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
        type: 'error',
        rawArgs: args
      };
    }
  }

  private registerDefaultCommands() {
    // ==========================================
    // HELP & SYSTEM
    // ==========================================
    this.register({
      name: 'help',
      aliases: ['?', 'man', 'commands'],
      category: 'System',
      description: 'Display list of all available shell commands and features',
      usage: 'help [command_name]',
      execute: (args) => {
        if (args.length > 0) {
          const target = this.getCommand(args[0]);
          if (target) {
            return {
              output: `COMMAND: ${target.name}
USAGE: ${target.usage}
CATEGORY: ${target.category}
ALIASES: ${target.aliases ? target.aliases.join(', ') : 'none'}

DESCRIPTION:
  ${target.description}`,
              type: 'info'
            };
          }
          return {
            output: `help: no manual entry for '${args[0]}'`,
            type: 'error'
          };
        }

        return {
          output: '',
          type: 'help'
        };
      }
    });

    this.register({
      name: 'clear',
      aliases: ['cls', 'reset'],
      category: 'System',
      description: 'Clear the terminal output screen (Shortcut: Ctrl+L)',
      usage: 'clear',
      execute: (_, ctx) => {
        ctx.clearHistory();
        return { output: '', type: 'clear' };
      }
    });

    this.register({
      name: 'history',
      aliases: ['hist'],
      category: 'System',
      description: 'Display list of executed commands',
      usage: 'history',
      execute: (_, ctx) => {
        if (!ctx.historyList || ctx.historyList.length === 0) {
          return {
            output: 'No commands in history yet.',
            type: 'text'
          };
        }
        const output = ctx.historyList.map((cmd, idx) => `  ${(idx + 1).toString().padStart(3)}  ${cmd}`).join('\n');
        return {
          output,
          type: 'text'
        };
      }
    });

    this.register({
      name: 'welcome',
      aliases: ['banner', 'hero', 'start'],
      category: 'System',
      description: 'Display initial welcome banner and ASCII avatar hero',
      usage: 'welcome',
      execute: () => ({
        output: '',
        type: 'welcome'
      })
    });

    this.register({
      name: 'whoami',
      aliases: ['user', 'me', 'client', 'visitor'],
      category: 'System',
      description: 'Show current username and system info',
      usage: 'whoami',
      execute: () => ({
        output: '',
        type: 'whoami'
      })
    });

    this.register({
      name: 'sysinfo',
      aliases: ['uname', 'system', 'specs', 'hardware'],
      category: 'System',
      description: 'Display system information like OS, browser, and screen size',
      usage: 'sysinfo',
      execute: () => ({
        output: '',
        type: 'sysinfo'
      })
    });

    this.register({
      name: 'date',
      category: 'System',
      description: 'Display current system time and date',
      usage: 'date',
      execute: () => ({
        output: new Date().toString(),
        type: 'text'
      })
    });

    this.register({
      name: 'uptime',
      category: 'System',
      description: 'Display system uptime elapsed since portfolio release',
      usage: 'uptime',
      execute: () => {
        // Release build timestamp
        const BUILD_TIMESTAMP = new Date('2026-08-25T08:00:00Z').getTime();
        const diffMs = Math.max(1000, Date.now() - BUILD_TIMESTAMP);
        const totalSec = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        let uptimeStr = '';
        if (days > 0) {
          uptimeStr = `${days} day${days > 1 ? 's' : ''}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        } else {
          uptimeStr = `${hours}h ${minutes}m`;
        }

        return {
          output: `${timeStr} up ${uptimeStr}, 1 user, load average: 0.12, 0.08, 0.03`,
          type: 'text'
        };
      }
    });

    this.register({
      name: 'echo',
      category: 'System',
      description: 'Print text or string arguments to the terminal',
      usage: 'echo [args...]',
      execute: (args) => ({
        output: args.join(' '),
        type: 'text'
      })
    });

    // ==========================================
    // NAVIGATION & FILESYSTEM
    // ==========================================
    this.register({
      name: 'pwd',
      category: 'Navigation',
      description: 'Print current working directory path',
      usage: 'pwd',
      execute: (_, ctx) => ({
        output: ctx.cwd,
        type: 'text'
      })
    });

    this.register({
      name: 'ls',
      aliases: ['dir', 'll', 'la'],
      category: 'Navigation',
      description: 'List directory contents with permissions, sizes, and file types',
      usage: 'ls [-a] [-l] [path]',
      execute: (args, ctx) => {
        let showHidden = false;
        let longFormat = false;
        const targetPaths: string[] = [];

        args.forEach(arg => {
          if (arg === '-a' || arg === '-all') showHidden = true;
          else if (arg === '-l') longFormat = true;
          else if (arg === '-la' || arg === '-al') {
            showHidden = true;
            longFormat = true;
          } else if (!arg.startsWith('-')) {
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
            type: 'error'
          };
        }

        if (longFormat) {
          const header = `total ${entries.length * 4}K\n`;
          const rows = entries.map(e => {
            const perms = e.node.permissions;
            const size = (e.node.type === 'file' ? e.node.size : 4096).toString().padStart(6);
            const mod = e.node.modified;
            const nameColor = e.isDir ? `${e.name}/` : e.isExecutable ? `${e.name}*` : e.name;
            return `${perms}  1 guest guest ${size} ${mod} ${nameColor}`;
          }).join('\n');

          return { output: header + rows, type: 'text' };
        }

        const formatted = entries.map(e => {
          if (e.isDir) return `${e.name}/`;
          if (e.isExecutable) return `${e.name}*`;
          return e.name;
        }).join('   ');

        return { output: formatted || '(empty directory)', type: 'text' };
      }
    });

    this.register({
      name: 'cd',
      category: 'Navigation',
      description: 'Change current working directory',
      usage: 'cd [directory | .. | ~]',
      execute: (args, ctx) => {
        const target = args[0] || '~';
        const resolved = virtualFS.resolvePath(ctx.cwd, target);
        const node = virtualFS.getNode(resolved);

        if (!node) {
          soundFX.playError();
          return {
            output: `cd: no such file or directory: ${target}`,
            type: 'error'
          };
        }
        if (node.type !== 'dir') {
          soundFX.playError();
          return {
            output: `cd: not a directory: ${target}`,
            type: 'error'
          };
        }

        ctx.setCwd(resolved);
        return { output: '', type: 'text' };
      }
    });

    this.register({
      name: 'cat',
      category: 'Navigation',
      description: 'Concatenate and display the contents of a file',
      usage: 'cat <filename>',
      execute: (args, ctx) => {
        if (!args[0]) {
          return {
            output: 'cat: missing file operand\nUsage: cat <filename>',
            type: 'error'
          };
        }
        const resolved = virtualFS.resolvePath(ctx.cwd, args[0]);
        const res = virtualFS.readFile(resolved);

        if (res.error) {
          soundFX.playError();
          return { output: res.error, type: 'error' };
        }

        // Check if viewing resume.pdf
        if (args[0].toLowerCase().includes('resume') || args[0].endsWith('.pdf')) {
          if (typeof document !== 'undefined') {
            try {
              const a = document.createElement('a');
              a.href = portfolioConfig.resumeUrl || '/resume.pdf';
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } catch {
              // Ignore popup restrictions
            }
          }
          return { output: '', type: 'resume' };
        }

        return { output: res.content, type: 'text' };
      }
    });

    this.register({
      name: 'tree',
      category: 'Navigation',
      description: 'List directory contents in a tree-like format',
      usage: 'tree [path]',
      execute: (args, ctx) => {
        const target = args[0] ? virtualFS.resolvePath(ctx.cwd, args[0]) : ctx.cwd;
        const lines = virtualFS.generateTree(target);
        return {
          output: lines.join('\n'),
          type: 'tree'
        };
      }
    });

    this.register({
      name: 'mkdir',
      category: 'Navigation',
      description: 'Create new directory in virtual filesystem',
      usage: 'mkdir <dirname>',
      execute: (args, ctx) => {
        if (!args[0]) {
          return { output: 'mkdir: missing operand', type: 'error' };
        }
        const target = virtualFS.resolvePath(ctx.cwd, args[0]);
        const success = virtualFS.createDirectory(target);
        if (!success) {
          soundFX.playError();
          return { output: `mkdir: cannot create directory '${args[0]}'`, type: 'error' };
        }
        return { output: `Created directory: ${args[0]}`, type: 'success' };
      }
    });

    this.register({
      name: 'touch',
      category: 'Navigation',
      description: 'Create an empty file in virtual filesystem',
      usage: 'touch <filename>',
      execute: (args, ctx) => {
        if (!args[0]) {
          return { output: 'touch: missing file operand', type: 'error' };
        }
        const target = virtualFS.resolvePath(ctx.cwd, args[0]);
        const success = virtualFS.createFile(target, '');
        if (!success) {
          soundFX.playError();
          return { output: `touch: cannot touch '${args[0]}'`, type: 'error' };
        }
        return { output: '', type: 'text' };
      }
    });

    this.register({
      name: 'rm',
      category: 'Navigation',
      description: 'Remove file or directory from virtual filesystem',
      usage: 'rm <filename>',
      execute: (args, ctx) => {
        if (!args[0]) {
          return { output: 'rm: missing operand', type: 'error' };
        }
        const target = virtualFS.resolvePath(ctx.cwd, args[0]);
        const success = virtualFS.removeNode(target);
        if (!success) {
          soundFX.playError();
          return { output: `rm: cannot remove '${args[0]}': No such file or directory`, type: 'error' };
        }
        return { output: `Removed '${args[0]}'`, type: 'text' };
      }
    });

    // ==========================================
    // PORTFOLIO COMMANDS
    // ==========================================
    this.register({
      name: 'about',
      aliases: ['bio', 'me'],
      category: 'Portfolio',
      description: 'Display biographical background, summary, and passions',
      usage: 'about',
      execute: () => ({
        output: '',
        type: 'about'
      })
    });

    this.register({
      name: 'projects',
      aliases: ['work', 'portfolio', 'proj'],
      category: 'Portfolio',
      description: 'Explore featured software projects, repositories, and demos',
      usage: 'projects [category_or_filter]',
      execute: (args) => ({
        output: '',
        type: 'projects',
        rawArgs: args
      })
    });

    this.register({
      name: 'skills',
      aliases: ['stack', 'tech', 'technologies'],
      category: 'Portfolio',
      description: 'Display technical skills, competencies, and proficiency bars',
      usage: 'skills',
      execute: () => ({
        output: '',
        type: 'skills'
      })
    });

    this.register({
      name: 'experience',
      aliases: ['workhistory', 'jobs', 'exp'],
      category: 'Portfolio',
      description: 'View career history, achievements, and tech stack milestones',
      usage: 'experience',
      execute: () => ({
        output: '',
        type: 'experience'
      })
    });

    this.register({
      name: 'education',
      aliases: ['edu', 'degree'],
      category: 'Portfolio',
      description: 'View academic education history and coursework',
      usage: 'education',
      execute: () => {
        const output = portfolioConfig.education.map(e => `🎓 ${e.degree}
   ${e.institution} | ${e.period} (${e.location})
${e.details ? e.details.map(d => `   • ${d}`).join('\n') : ''}`).join('\n\n');
        return { output, type: 'info' };
      }
    });

    this.register({
      name: 'certifications',
      aliases: ['certs', 'certification', 'awards', 'honors'],
      category: 'Portfolio',
      description: 'View industry certifications, courses, and honors',
      usage: 'certifications',
      execute: () => {
        const certList = (portfolioConfig.certifications || []).map(c => `📜 ${c.title}
   Issuer: ${c.issuer} | Year: ${c.year || '2025'}`).join('\n\n');

        const awardList = (portfolioConfig.awards || []).map(a => `🏆 ${a.title}
   Issuer: ${a.issuer || 'Award'} | ${a.year || ''}`).join('\n\n');

        return {
          output: `[ PROFESSIONAL CERTIFICATIONS & COURSES ]\n\n${certList}\n\n[ HONORS & AWARDS ]\n\n${awardList}`,
          type: 'info'
        };
      }
    });

    this.register({
      name: 'contact',
      aliases: ['socials', 'email', 'social', 'reach'],
      category: 'Portfolio',
      description: 'View contact details and social media channels',
      usage: 'contact',
      execute: () => ({
        output: '',
        type: 'contact'
      })
    });

    this.register({
      name: 'resume',
      aliases: ['cv', 'resume.pdf', './resume.pdf', 'cv.pdf', 'view-resume', 'get-resume'],
      category: 'Portfolio',
      description: 'Open or download curriculum vitae (PDF)',
      usage: 'resume',
      execute: () => {
        if (typeof document !== 'undefined') {
          try {
            const a = document.createElement('a');
            a.href = portfolioConfig.resumeUrl || '/resume.pdf';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } catch {
            // Popup blocker fallback
          }
        }
        return {
          output: '',
          type: 'resume'
        };
      }
    });

    // ==========================================
    // CUSTOMIZATION & PREFERENCES
    // ==========================================
    this.register({
      name: 'theme',
      aliases: ['themes', 'color', 'colors'],
      category: 'Customization',
      description: 'Change or list terminal color themes (matrix, dracula, nord, etc.)',
      usage: 'theme [theme_name]',
      execute: (args, ctx) => {
        const themeList = Object.keys(THEMES);
        if (!args[0]) {
          const list = themeList.map(t => {
            const isCurrent = t === ctx.theme ? ' (active)' : '';
            return `• ${t.padEnd(16)} - ${THEMES[t].name}${isCurrent}`;
          }).join('\n');
          return {
            output: `CURRENT THEME: ${THEMES[ctx.theme]?.name || ctx.theme}

AVAILABLE THEMES:
${list}

USAGE: theme <theme_name>  (e.g., 'theme dracula' or 'theme nord')`,
            type: 'info'
          };
        }

        const requested = args[0].toLowerCase();
        if (THEMES[requested]) {
          ctx.setTheme(requested);
          soundFX.playChime();
          return {
            output: `Theme changed to '${THEMES[requested].name}'. Settings persisted in local storage.`,
            type: 'success'
          };
        }

        soundFX.playError();
        return {
          output: `Unknown theme '${args[0]}'. Available: ${themeList.join(', ')}`,
          type: 'error'
        };
      }
    });

    this.register({
      name: 'sound',
      aliases: ['audio', 'sfx', 'mute'],
      category: 'Customization',
      description: 'Toggle mechanical keyboard typing sound effects and beeps',
      usage: 'sound [on | off | toggle]',
      execute: (args, ctx) => {
        const arg = args[0]?.toLowerCase();
        let newState = !ctx.soundEnabled;
        if (arg === 'on' || arg === 'enable') newState = true;
        else if (arg === 'off' || arg === 'disable' || arg === 'mute') newState = false;

        ctx.setSoundEnabled(newState);
        soundFX.setEnabled(newState);
        if (newState) soundFX.playChime();

        return {
          output: `Audio Sound FX is now: [${newState ? 'ENABLED 🔊' : 'MUTED 🔇'}]`,
          type: newState ? 'success' : 'warning'
        };
      }
    });

    this.register({
      name: 'crt',
      aliases: ['scanlines', 'retro'],
      category: 'Customization',
      description: 'Toggle retro CRT scanlines, flicker, and phosphor glow effects',
      usage: 'crt [on | off | toggle]',
      execute: (args, ctx) => {
        const arg = args[0]?.toLowerCase();
        let newState = !ctx.crtEnabled;
        if (arg === 'on' || arg === 'enable') newState = true;
        else if (arg === 'off' || arg === 'disable') newState = false;

        ctx.setCrtEnabled(newState);
        return {
          output: `CRT Monitor Scanlines: [${newState ? 'ENABLED 📺' : 'DISABLED'}]`,
          type: 'info'
        };
      }
    });

    // ==========================================
    // EASTER EGGS & INTERACTIVE MINIGAMES
    // ==========================================
    this.register({
      name: 'neofetch',
      aliases: ['fastfetch', 'fetch', 'logo'],
      category: 'Easter Eggs',
      description: 'Display system info and aesthetic ASCII portfolio logo',
      usage: 'neofetch',
      execute: () => ({
        output: '',
        type: 'neofetch'
      })
    });

    this.register({
      name: 'matrix',
      aliases: ['cmatrix', 'rain'],
      category: 'Easter Eggs',
      description: 'Enter the Matrix digital green rain falling animation',
      usage: 'matrix',
      execute: (_, ctx) => {
        ctx.setActiveEasterEgg('matrix');
        return {
          output: 'Entering the Matrix... (Press [Q] or [Esc] or click anywhere to exit)',
          type: 'success'
        };
      }
    });

    this.register({
      name: 'snake',
      aliases: ['game', 'arcade'],
      category: 'Easter Eggs',
      description: 'Play a retro arcade Snake game inside the terminal!',
      usage: 'snake',
      execute: (_, ctx) => {
        ctx.setActiveEasterEgg('snake');
        return {
          output: 'Launching Snake Arcade... (Use Arrow Keys or WASD to navigate, [Esc] to exit)',
          type: 'success'
        };
      }
    });

    this.register({
      name: 'cowsay',
      aliases: ['cow'],
      category: 'Easter Eggs',
      description: 'Generate an ASCII cow with a speech balloon',
      usage: 'cowsay [message]',
      execute: (args) => {
        const text = args.length > 0 ? args.join(' ') : portfolioConfig.easterEggs.cowsayDefault;
        return {
          output: text,
          type: 'cowsay'
        };
      }
    });

    this.register({
      name: 'sl',
      category: 'Easter Eggs',
      description: 'Steam locomotive train running across screen (for when you misspell ls)',
      usage: 'sl',
      execute: (_, ctx) => {
        ctx.setActiveEasterEgg('sl');
        return {
          output: '🚂 Choo choo! Steam Locomotive inbound...',
          type: 'info'
        };
      }
    });

    this.register({
      name: 'sudo',
      category: 'Easter Eggs',
      description: 'Execute a command as superuser',
      usage: 'sudo [command...]',
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
          type: 'error',
          rawArgs: args
        };
      }
    });

    this.register({
      name: 'vim',
      aliases: ['vi', 'nano', 'emacs'],
      category: 'Easter Eggs',
      description: 'Open a mock terminal text editor',
      usage: 'vim [filename]',
      execute: (args) => ({
        output: `[VIM] Opening ${args[0] || 'buffer'} in read-only mode...\nTip: Type ':q!' to exit, or just use 'cat' to view files!`,
        type: 'warning'
      })
    });

    this.register({
      name: 'quote',
      aliases: ['fortune', 'motd'],
      category: 'Easter Eggs',
      description: 'Print a wise developer quote or fortune cookie',
      usage: 'quote',
      execute: () => {
        const quotes = portfolioConfig.easterEggs.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return {
          output: `"${randomQuote}"`,
          type: 'info'
        };
      }
    });

    this.register({
      name: 'weather',
      aliases: ['wttr', 'forecast'],
      category: 'Easter Eggs',
      description: 'Display live local meteorological weather forecast for your location',
      usage: 'weather',
      execute: () => ({
        output: '',
        type: 'weather'
      })
    });

    this.register({
      name: 'shutdown',
      aliases: ['exit', 'poweroff', 'quit', 'halt'],
      category: 'System',
      description: 'Simulate terminal shutdown and disable input until power on',
      usage: 'shutdown',
      execute: (_, ctx) => {
        if (ctx.triggerShutdown) {
          ctx.triggerShutdown();
        }
        return {
          output: 'Initiating terminal shutdown sequence... [ OK ]',
          type: 'warning'
        };
      }
    });
  }
}

export const commandRegistry = new CommandRegistry();
