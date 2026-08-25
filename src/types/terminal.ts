export type OutputType = 
  | 'text' 
  | 'error' 
  | 'success' 
  | 'info' 
  | 'warning' 
  | 'welcome'
  | 'whoami'
  | 'sysinfo'
  | 'weather'
  | 'neofetch' 
  | 'projects' 
  | 'skills' 
  | 'experience' 
  | 'about' 
  | 'contact' 
  | 'resume'
  | 'help' 
  | 'tree' 
  | 'matrix' 
  | 'snake' 
  | 'cowsay' 
  | 'sl'
  | 'clear'
  | 'custom';

export interface CommandHistoryItem {
  id: string;
  command: string;
  cwd: string;
  timestamp: string;
  output?: string | React.ReactNode;
  type?: OutputType;
  rawArgs?: string[];
}

export interface VirtualFile {
  name: string;
  type: 'file';
  content: string;
  size: number;
  permissions: string;
  modified: string;
  isExecutable?: boolean;
}

export interface VirtualDirectory {
  name: string;
  type: 'dir';
  permissions: string;
  modified: string;
  children: Record<string, VirtualNode>;
}

export type VirtualNode = VirtualFile | VirtualDirectory;

export interface CommandContext {
  cwd: string;
  setCwd: (path: string) => void;
  clearHistory: () => void;
  historyList?: string[];
  theme: string;
  setTheme: (theme: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  activeEasterEgg: string | null;
  setActiveEasterEgg: (egg: string | null) => void;
  triggerShutdown?: () => void;
}

export interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  category: 'System' | 'Portfolio' | 'Navigation' | 'Customization' | 'Easter Eggs';
  execute: (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;
}

export interface CommandResult {
  output?: string | React.ReactNode;
  type?: OutputType;
  rawArgs?: string[];
}
