import { VirtualDirectory, VirtualNode } from '../types/terminal';
import { portfolioConfig } from '../config/portfolio.config';

export class VirtualFileSystem {
  private root: VirtualDirectory;
  public homePath = '/home/guest';

  constructor() {
    this.root = this.initFileSystem();
  }

  private initFileSystem(): VirtualDirectory {
    const now = 'Aug 25 11:30';

    // Projects directory files
    const projectFiles: Record<string, VirtualNode> = {};
    portfolioConfig.projects.forEach((proj) => {
      const filename = `${proj.id}.md`;
      const content = `# ${proj.name}
Category: ${proj.category}
Tags: ${proj.tags.join(', ')}
${proj.githubUrl ? `GitHub: ${proj.githubUrl}` : ''}
${proj.liveUrl ? `Live Demo: ${proj.liveUrl}` : ''}

${proj.description}

${proj.longDescription || ''}
`;
      projectFiles[filename] = {
        name: filename,
        type: 'file',
        content: content.trim(),
        size: content.length,
        permissions: '-rw-r--r--',
        modified: now,
      };
    });

    // Experience directory files
    const experienceFiles: Record<string, VirtualNode> = {};
    portfolioConfig.experience.forEach((exp, idx) => {
      const filename = `${exp.company.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
      const content = `COMPANY: ${exp.company}
ROLE: ${exp.role}
PERIOD: ${exp.period}
LOCATION: ${exp.location}
TECH: ${exp.technologies.join(', ')}

HIGHLIGHTS:
${exp.description.map(d => `• ${d}`).join('\n')}
`;
      experienceFiles[filename] = {
        name: filename,
        type: 'file',
        content: content.trim(),
        size: content.length,
        permissions: '-rw-r--r--',
        modified: `Aug ${20 + idx} 10:00`,
      };
    });

    const rootDir: VirtualDirectory = {
      name: '/',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      modified: now,
      children: {
        'bin': {
          name: 'bin',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          modified: now,
          children: {
            'about': { name: 'about', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 14280, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'projects': { name: 'projects', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 18920, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'skills': { name: 'skills', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 12400, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'experience': { name: 'experience', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 16200, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'contact': { name: 'contact', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 9840, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'theme': { name: 'theme', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 8400, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'matrix': { name: 'matrix', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 24500, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'snake': { name: 'snake', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 32000, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'neofetch': { name: 'neofetch', type: 'file', content: '#!/bin/bash\n# Fast system info fetcher', size: 4500, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'cowsay': { name: 'cowsay', type: 'file', content: '#!/usr/bin/perl\n# Generates an ASCII cow with speech balloon', size: 5400, permissions: '-rwxr-xr-x', modified: now, isExecutable: true },
            'sl': { name: 'sl', type: 'file', content: 'ELF 64-bit LSB executable, x86-64', size: 11200, permissions: '-rwxr-xr-x', modified: now, isExecutable: true }
          }
        },
        'etc': {
          name: 'etc',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          modified: now,
          children: {
            'os-release': {
              name: 'os-release',
              type: 'file',
              content: `NAME="Portfolio Linux"\nPRETTY_NAME="Portfolio Linux 6.8.0-custom-arch"\nID=arch\nID_LIKE=archlinux\nVERSION_ID=2026.08\nBUILD_ID=rolling\nHOME_URL="https://github.com"`,
              size: 160,
              permissions: '-rw-r--r--',
              modified: now,
            },
            'hostname': {
              name: 'hostname',
              type: 'file',
              content: `${portfolioConfig.hostname}\n`,
              size: portfolioConfig.hostname.length + 1,
              permissions: '-rw-r--r--',
              modified: now,
            },
            'motd': {
              name: 'motd',
              type: 'file',
              content: portfolioConfig.easterEggs.motd,
              size: portfolioConfig.easterEggs.motd.length,
              permissions: '-rw-r--r--',
              modified: now,
            }
          }
        },
        'home': {
          name: 'home',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          modified: now,
          children: {
            'guest': {
              name: 'guest',
              type: 'dir',
              permissions: 'drwxr-xr-x',
              modified: now,
              children: {
                'about.txt': {
                  name: 'about.txt',
                  type: 'file',
                  content: `${portfolioConfig.name} — ${portfolioConfig.title}
Location: ${portfolioConfig.location}

${portfolioConfig.about.summary}

Passions:
${portfolioConfig.about.passions.map(p => `• ${p}`).join('\n')}

Current Focus:
${portfolioConfig.about.currentFocus}

Fun Fact: ${portfolioConfig.about.funFact}
`,
                  size: 420,
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                'skills.txt': {
                  name: 'skills.txt',
                  type: 'file',
                  content: portfolioConfig.skills.map(cat => 
                    `[ ${cat.category.toUpperCase()} ]\n` + 
                    cat.skills.map(s => `• ${s.name.padEnd(26)} [${'#'.repeat(Math.round(s.level / 10))}${' '.repeat(10 - Math.round(s.level / 10))}] ${s.level}%\n  ${s.description || ''}`).join('\n')
                  ).join('\n\n'),
                  size: 890,
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                'contact.txt': {
                  name: 'contact.txt',
                  type: 'file',
                  content: `EMAIL: ${portfolioConfig.email}
LOCATION: ${portfolioConfig.location}

SOCIAL PROFILES:
${portfolioConfig.socials.map(s => `• ${s.platform.padEnd(12)} -> ${s.url}`).join('\n')}
`,
                  size: 260,
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                'projects': {
                  name: 'projects',
                  type: 'dir',
                  permissions: 'drwxr-xr-x',
                  modified: now,
                  children: projectFiles,
                },
                'experience': {
                  name: 'experience',
                  type: 'dir',
                  permissions: 'drwxr-xr-x',
                  modified: now,
                  children: experienceFiles,
                },
                'education.txt': {
                  name: 'education.txt',
                  type: 'file',
                  content: portfolioConfig.education.map(e => 
                    `INSTITUTION: ${e.institution}\nDEGREE: ${e.degree}\nPERIOD: ${e.period}\nLOCATION: ${e.location}\n${e.details ? e.details.map(d => `• ${d}`).join('\n') : ''}`
                  ).join('\n\n'),
                  size: 380,
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                'certifications.txt': {
                  name: 'certifications.txt',
                  type: 'file',
                  content: (portfolioConfig.certifications || []).map(c => 
                    `• ${c.title} — ${c.issuer} (${c.year || '2025'})`
                  ).join('\n') + '\n\nAWARDS:\n' + (portfolioConfig.awards || []).map(a => `• ${a.title} (${a.issuer})`).join('\n'),
                  size: 450,
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                'resume.pdf': {
                  name: 'resume.pdf',
                  type: 'file',
                  content: `%PDF-1.4\n% [PDF Document - Run 'resume' or 'cat resume.pdf' to open resume in browser]`,
                  size: 142080,
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                '.bashrc': {
                  name: '.bashrc',
                  type: 'file',
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
                  permissions: '-rw-r--r--',
                  modified: now,
                },
                '.secret.txt': {
                  name: '.secret.txt',
                  type: 'file',
                  content: `🎉 You discovered a hidden file!
Try typing 'snake' to play a retro terminal arcade game or 'sl' to see a steam locomotive train!
Quote: "${portfolioConfig.easterEggs.quotes[Math.floor(Math.random() * portfolioConfig.easterEggs.quotes.length)]}"`,
                  size: 180,
                  permissions: '-rw-------',
                  modified: now,
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
  public resolvePath(cwd: string, targetPath?: string): string {
    if (!targetPath || targetPath === '.') {
      return cwd;
    }

    let fullPath = targetPath;
    if (targetPath.startsWith('~')) {
      fullPath = targetPath.replace('~', this.homePath);
    } else if (!targetPath.startsWith('/')) {
      fullPath = cwd === '/' ? `/${targetPath}` : `${cwd}/${targetPath}`;
    }

    // Split and resolve relative parts
    const parts = fullPath.split('/').filter(Boolean);
    const resolvedParts: string[] = [];

    for (const part of parts) {
      if (part === '.') {
        continue;
      } else if (part === '..') {
        if (resolvedParts.length > 0) {
          resolvedParts.pop();
        }
      } else {
        resolvedParts.push(part);
      }
    }

    return '/' + resolvedParts.join('/');
  }

  /**
   * Get VirtualNode for given path
   */
  public getNode(path: string): VirtualNode | null {
    if (path === '/' || path === '') {
      return this.root;
    }

    const parts = path.split('/').filter(Boolean);
    let current: VirtualNode = this.root;

    for (const part of parts) {
      if (current.type !== 'dir') {
        return null;
      }
      const next: VirtualNode | undefined = current.children[part];
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
  public listDirectory(
    path: string, 
    showHidden = false
  ): { name: string; node: VirtualNode; isDir: boolean; isExecutable: boolean }[] | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'dir') {
      return null;
    }

    const entries: { name: string; node: VirtualNode; isDir: boolean; isExecutable: boolean }[] = [];
    
    if (showHidden) {
      entries.push({ name: '.', node, isDir: true, isExecutable: false });
      const parentPath = this.resolvePath(path, '..');
      const parentNode = this.getNode(parentPath) || node;
      entries.push({ name: '..', node: parentNode, isDir: true, isExecutable: false });
    }

    const keys = Object.keys(node.children).sort();
    for (const key of keys) {
      if (!showHidden && key.startsWith('.')) {
        continue;
      }
      const child = node.children[key];
      entries.push({
        name: key,
        node: child,
        isDir: child.type === 'dir',
        isExecutable: child.type === 'file' && !!child.isExecutable
      });
    }

    return entries;
  }

  /**
   * Read file content
   */
  public readFile(path: string): { content: string; error?: string } {
    const node = this.getNode(path);
    if (!node) {
      return { content: '', error: `cat: ${path}: No such file or directory` };
    }
    if (node.type === 'dir') {
      return { content: '', error: `cat: ${path}: Is a directory` };
    }
    return { content: node.content };
  }

  /**
   * Create a virtual file (e.g. touch or echo > file)
   */
  public createFile(path: string, content = ''): boolean {
    const parentPath = this.resolvePath(path, '..');
    const filename = path.split('/').filter(Boolean).pop();
    if (!filename) return false;

    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== 'dir') return false;

    const now = 'Aug 25 12:00';
    parent.children[filename] = {
      name: filename,
      type: 'file',
      content,
      size: content.length,
      permissions: '-rw-r--r--',
      modified: now,
    };
    return true;
  }

  /**
   * Create a virtual directory (mkdir)
   */
  public createDirectory(path: string): boolean {
    const parentPath = this.resolvePath(path, '..');
    const dirName = path.split('/').filter(Boolean).pop();
    if (!dirName) return false;

    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== 'dir') return false;

    const now = 'Aug 25 12:00';
    parent.children[dirName] = {
      name: dirName,
      type: 'dir',
      permissions: 'drwxr-xr-x',
      modified: now,
      children: {}
    };
    return true;
  }

  /**
   * Remove a file or directory
   */
  public removeNode(path: string): boolean {
    const parentPath = this.resolvePath(path, '..');
    const targetName = path.split('/').filter(Boolean).pop();
    if (!targetName) return false;

    const parent = this.getNode(parentPath);
    if (!parent || parent.type !== 'dir') return false;

    if (parent.children[targetName]) {
      delete parent.children[targetName];
      return true;
    }
    return false;
  }

  /**
   * Generates ASCII tree view
   */
  public generateTree(startPath: string, maxDepth = 3): string[] {
    const lines: string[] = [];
    const rootNode = this.getNode(startPath);
    if (!rootNode || rootNode.type !== 'dir') {
      return [`${startPath} [error opening dir]`];
    }

    lines.push(startPath === this.homePath ? '~' : startPath);

    const buildTree = (dir: VirtualDirectory, prefix: string, currentDepth: number) => {
      if (currentDepth > maxDepth) return;
      const keys = Object.keys(dir.children).filter(k => !k.startsWith('.')).sort();
      
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const pointer = isLast ? '└── ' : '├── ';
        const child = dir.children[key];
        
        if (child.type === 'dir') {
          lines.push(`${prefix}${pointer}${key}/`);
          buildTree(child, `${prefix}${isLast ? '    ' : '│   '}`, currentDepth + 1);
        } else {
          lines.push(`${prefix}${pointer}${key}`);
        }
      });
    };

    buildTree(rootNode, '', 1);
    return lines;
  }

  /**
   * Get suggestions for tab autocompletion
   */
  public getCompletions(currentCwd: string, partialInput: string): string[] {
    const lastWord = partialInput.split(/\s+/).pop() || '';
    
    // If empty or no slash, check current directory children
    if (!lastWord.includes('/')) {
      const dir = this.getNode(currentCwd);
      if (dir && dir.type === 'dir') {
        return Object.keys(dir.children)
          .filter(k => k.toLowerCase().startsWith(lastWord.toLowerCase()))
          .map(k => dir.children[k].type === 'dir' ? `${k}/` : k);
      }
      return [];
    }

    // Resolving partial path
    const lastSlashIdx = lastWord.lastIndexOf('/');
    const dirPart = lastWord.substring(0, lastSlashIdx + 1);
    const filePart = lastWord.substring(lastSlashIdx + 1);

    const targetDir = this.resolvePath(currentCwd, dirPart);
    const dir = this.getNode(targetDir);
    if (dir && dir.type === 'dir') {
      return Object.keys(dir.children)
        .filter(k => k.toLowerCase().startsWith(filePart.toLowerCase()))
        .map(k => `${dirPart}${k}${dir.children[k].type === 'dir' ? '/' : ''}`);
    }

    return [];
  }
}

export const virtualFS = new VirtualFileSystem();
