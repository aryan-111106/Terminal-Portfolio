export interface TerminalTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textMuted: string;
    border: string;
    promptUser: string;
    promptHost: string;
    promptPath: string;
    promptChar: string;
    accent: string;
    accentSecondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    command: string;
    link: string;
    tagBg: string;
    tagText: string;
    selectionBg: string;
    cursor: string;
  };
  glow?: string;
  headerBg: string;
  statusBarBg: string;
}

export const THEMES: Record<string, TerminalTheme> = {
  'matrix-green': {
    id: 'matrix-green',
    name: 'Matrix Green (CRT)',
    description: 'Classic phosphor green terminal with digital rain aesthetic',
    colors: {
      bg: '#050a05',
      bgSecondary: '#0b160b',
      text: '#22c55e',
      textMuted: '#15803d',
      border: '#166534',
      promptUser: '#4ade80',
      promptHost: '#22c55e',
      promptPath: '#86efac',
      promptChar: '#22c55e',
      accent: '#22c55e',
      accentSecondary: '#16a34a',
      success: '#4ade80',
      error: '#ef4444',
      warning: '#eab308',
      info: '#38bdf8',
      command: '#86efac',
      link: '#4ade80',
      tagBg: '#052e16',
      tagText: '#4ade80',
      selectionBg: '#14532d',
      cursor: '#22c55e',
    },
    glow: '0 0 10px rgba(34, 197, 94, 0.45)',
    headerBg: '#081208',
    statusBarBg: '#050f05',
  },
  'dracula': {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark theme with vibrant magenta, purple, and cyan highlights',
    colors: {
      bg: '#282a36',
      bgSecondary: '#343746',
      text: '#f8f8f2',
      textMuted: '#6272a4',
      border: '#44475a',
      promptUser: '#50fa7b',
      promptHost: '#bd93f9',
      promptPath: '#8be9fd',
      promptChar: '#ff79c6',
      accent: '#ff79c6',
      accentSecondary: '#bd93f9',
      success: '#50fa7b',
      error: '#ff5555',
      warning: '#f1fa8c',
      info: '#8be9fd',
      command: '#f1fa8c',
      link: '#8be9fd',
      tagBg: '#44475a',
      tagText: '#ff79c6',
      selectionBg: '#44475a',
      cursor: '#f8f8f2',
    },
    glow: '0 0 10px rgba(189, 147, 249, 0.35)',
    headerBg: '#21222c',
    statusBarBg: '#191a21',
  },
  'catppuccin': {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    description: 'Soothing pastel palette with deep slate background',
    colors: {
      bg: '#1e1e2e',
      bgSecondary: '#25253a',
      text: '#cdd6f4',
      textMuted: '#6c7086',
      border: '#313244',
      promptUser: '#a6e3a1',
      promptHost: '#cba6f7',
      promptPath: '#89b4fa',
      promptChar: '#f38ba8',
      accent: '#cba6f7',
      accentSecondary: '#f5c2e7',
      success: '#a6e3a1',
      error: '#f38ba8',
      warning: '#f9e2af',
      info: '#89dceb',
      command: '#fab387',
      link: '#89b4fa',
      tagBg: '#313244',
      tagText: '#cba6f7',
      selectionBg: '#45475a',
      cursor: '#f5e0dc',
    },
    glow: '0 0 10px rgba(203, 166, 247, 0.3)',
    headerBg: '#181825',
    statusBarBg: '#11111b',
  },
  'nord': {
    id: 'nord',
    name: 'Nord Frost',
    description: 'Arctic, north-bluish clean and elegant color scheme',
    colors: {
      bg: '#2e3440',
      bgSecondary: '#3b4252',
      text: '#eceff4',
      textMuted: '#7b88a1',
      border: '#434c5e',
      promptUser: '#a3be8c',
      promptHost: '#88c0d0',
      promptPath: '#81a1c1',
      promptChar: '#b48ead',
      accent: '#88c0d0',
      accentSecondary: '#81a1c1',
      success: '#a3be8c',
      error: '#bf616a',
      warning: '#ebcb8b',
      info: '#8fbcbb',
      command: '#88c0d0',
      link: '#88c0d0',
      tagBg: '#434c5e',
      tagText: '#eceff4',
      selectionBg: '#4c566a',
      cursor: '#d8dee9',
    },
    glow: '0 0 10px rgba(136, 192, 208, 0.3)',
    headerBg: '#242933',
    statusBarBg: '#1c2028',
  },
  'gruvbox': {
    id: 'gruvbox',
    name: 'Gruvbox Dark',
    description: 'Warm retro groove with earthy amber, copper, and olive tones',
    colors: {
      bg: '#1d2021',
      bgSecondary: '#282828',
      text: '#ebdbb2',
      textMuted: '#928374',
      border: '#3c3836',
      promptUser: '#b8bb26',
      promptHost: '#fabd2f',
      promptPath: '#83a598',
      promptChar: '#fe8019',
      accent: '#fe8019',
      accentSecondary: '#fabd2f',
      success: '#b8bb26',
      error: '#fb4934',
      warning: '#fabd2f',
      info: '#8ec07c',
      command: '#fabd2f',
      link: '#83a598',
      tagBg: '#3c3836',
      tagText: '#fe8019',
      selectionBg: '#504945',
      cursor: '#ebdbb2',
    },
    glow: '0 0 10px rgba(254, 128, 25, 0.25)',
    headerBg: '#181a1b',
    statusBarBg: '#141617',
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    description: 'High-voltage neon yellow, cyan, and hot pink',
    colors: {
      bg: '#0a0a12',
      bgSecondary: '#141424',
      text: '#fcee0a',
      textMuted: '#71719a',
      border: '#2c2c4d',
      promptUser: '#00ff9f',
      promptHost: '#00f0ff',
      promptPath: '#ff0055',
      promptChar: '#fcee0a',
      accent: '#00f0ff',
      accentSecondary: '#ff0055',
      success: '#00ff9f',
      error: '#ff0055',
      warning: '#fcee0a',
      info: '#00f0ff',
      command: '#00ff9f',
      link: '#00f0ff',
      tagBg: '#220033',
      tagText: '#ff0055',
      selectionBg: '#ff0055',
      cursor: '#fcee0a',
    },
    glow: '0 0 12px rgba(0, 240, 255, 0.4)',
    headerBg: '#06060c',
    statusBarBg: '#030306',
  },
  'ubuntu': {
    id: 'ubuntu',
    name: 'Ubuntu Bash',
    description: 'Canonical deep aubergine with classic bash prompt colors',
    colors: {
      bg: '#300a24',
      bgSecondary: '#3d0d2e',
      text: '#ffffff',
      textMuted: '#aea79f',
      border: '#5c1647',
      promptUser: '#8ae234',
      promptHost: '#ffffff',
      promptPath: '#729fcf',
      promptChar: '#ffffff',
      accent: '#e95420',
      accentSecondary: '#77216f',
      success: '#8ae234',
      error: '#ef2929',
      warning: '#fce94f',
      info: '#729fcf',
      command: '#fce94f',
      link: '#e95420',
      tagBg: '#5c1647',
      tagText: '#ffffff',
      selectionBg: '#5c1647',
      cursor: '#ffffff',
    },
    glow: '0 0 8px rgba(233, 84, 32, 0.3)',
    headerBg: '#24071b',
    statusBarBg: '#1b0514',
  }
};

export const DEFAULT_THEME_ID = 'ubuntu';
