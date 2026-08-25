import fs from 'node:fs';
import path from 'node:path';
import { portfolioConfig } from '../src/config/portfolio.config';
import { harness, expect } from './test_harness';

export async function runTier1BuildAndAssetsTests(projectRoot: string) {
  harness.startSuite('Tier 1 - Build & Assets (R1 & R4)');

  // 1. R1 Build Output Checks
  await harness.test('R1: Production dist/ directory exists and is populated', () => {
    const distPath = path.resolve(projectRoot, 'dist');
    expect(fs.existsSync(distPath)).toBeTruthy();
    expect(fs.statSync(distPath).isDirectory()).toBeTruthy();
  });

  await harness.test('R1: dist/index.html is generated with essential SPA tags', () => {
    const indexPath = path.resolve(projectRoot, 'dist', 'index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('<div id="root"></div>');
    expect(content).toContain('<title>');
    expect(content).toContain('viewport');
    expect(content).toContain('assets/');
  });

  await harness.test('R1: Production CSS bundle generated with valid minified size', () => {
    const assetsPath = path.resolve(projectRoot, 'dist', 'assets');
    expect(fs.existsSync(assetsPath)).toBeTruthy();
    const files = fs.readdirSync(assetsPath);
    const cssFile = files.find(f => f.endsWith('.css'));
    expect(cssFile).toBeDefined();
    const cssPath = path.resolve(assetsPath, cssFile!);
    const stats = fs.statSync(cssPath);
    expect(stats.size).toBeGreaterThan(15000); // Greater than 15KB
  });

  await harness.test('R1: Production JavaScript bundle generated with valid bundle size', () => {
    const assetsPath = path.resolve(projectRoot, 'dist', 'assets');
    const files = fs.readdirSync(assetsPath);
    const jsFile = files.find(f => f.endsWith('.js') && !f.includes('probe'));
    expect(jsFile).toBeDefined();
    const jsPath = path.resolve(assetsPath, jsFile!);
    const stats = fs.statSync(jsPath);
    expect(stats.size).toBeGreaterThan(150000); // Greater than 150KB
  });

  await harness.test('R1: TypeScript config has strict typechecking enabled', () => {
    const tsconfigPath = path.resolve(projectRoot, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBeTruthy();
    const content = fs.readFileSync(tsconfigPath, 'utf-8');
    expect(content).toContain('"strict": true');
    expect(content).toContain('"noUnusedLocals": true');
  });

  // 2. R4 Asset & Hyperlink Integrity Checks
  await harness.test('R4: public/resume.pdf exists and contains valid PDF magic header', () => {
    const resumePath = path.resolve(projectRoot, 'public', 'resume.pdf');
    expect(fs.existsSync(resumePath)).toBeTruthy();
    const stats = fs.statSync(resumePath);
    expect(stats.size).toBeGreaterThan(50);
    const buffer = fs.readFileSync(resumePath);
    const magicHeader = buffer.toString('utf-8', 0, 5);
    expect(magicHeader).toBe('%PDF-');
  });

  await harness.test('R4: dist/resume.pdf exists in compiled production build', () => {
    const distResumePath = path.resolve(projectRoot, 'dist', 'resume.pdf');
    expect(fs.existsSync(distResumePath)).toBeTruthy();
    const buffer = fs.readFileSync(distResumePath);
    const magicHeader = buffer.toString('utf-8', 0, 5);
    expect(magicHeader).toBe('%PDF-');
  });

  await harness.test('R4: All 8 project repository URLs are well-formed HTTPS GitHub URLs', () => {
    const projects = portfolioConfig.projects;
    expect(projects.length).toBeGreaterThanOrEqual(8);
    for (const proj of projects) {
      if (proj.githubUrl) {
        expect(proj.githubUrl.startsWith('https://github.com/aryan-111106/')).toBeTruthy();
        expect(proj.githubUrl.length).toBeGreaterThan(32);
      }
    }
  });

  await harness.test('R4: All social profiles and contact endpoints are valid', () => {
    expect(portfolioConfig.email).toMatch(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const socials = portfolioConfig.socials;
    expect(socials.length).toBeGreaterThanOrEqual(3);
    for (const soc of socials) {
      if (soc.platform === 'Email') {
        expect(soc.url.startsWith('mailto:')).toBeTruthy();
      } else {
        expect(soc.url.startsWith('https://')).toBeTruthy();
      }
    }
  });

  await harness.test('R4: Live demo URLs (where provided) are well-formed', () => {
    const projectsWithLive = portfolioConfig.projects.filter(p => p.liveUrl);
    for (const proj of projectsWithLive) {
      expect(proj.liveUrl!.startsWith('https://') || proj.liveUrl!.startsWith('http://')).toBeTruthy();
    }
  });

  return harness.endSuite();
}
