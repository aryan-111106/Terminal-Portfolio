import { commandRegistry } from './src/services/commandRegistry.ts';
import { virtualFS } from './src/services/fileSystem.ts';
import { THEMES } from './src/config/themes.ts';
import { portfolioConfig } from './src/config/portfolio.config.ts';

console.log('Registered commands:', commandRegistry.getAllCommands().length);
console.log('VirtualFS home:', virtualFS.homePath);
console.log('Portfolio author:', portfolioConfig.name);
