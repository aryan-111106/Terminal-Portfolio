import { useState, useEffect } from 'react';
import { THEMES, DEFAULT_THEME_ID, TerminalTheme } from '../config/themes';
import { soundFX } from '../services/soundFX';

export function useTheme() {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('term_theme');
      if (saved && THEMES[saved]) return saved;
    }
    return DEFAULT_THEME_ID;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('term_sound');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const [crtEnabled, setCrtEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('term_crt');
      if (saved !== null) return saved === 'true';
    }
    return true; // Enabled by default for authentic retro feel
  });

  const currentTheme: TerminalTheme = THEMES[themeId] || THEMES[DEFAULT_THEME_ID];

  const setTheme = (id: string) => {
    if (THEMES[id]) {
      setThemeId(id);
      localStorage.setItem('term_theme', id);
    }
  };

  const setSoundEnabled = (val: boolean | ((prev: boolean) => boolean)) => {
    setSoundEnabledState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('term_sound', String(next));
      soundFX.setEnabled(next);
      return next;
    });
  };

  const setCrtEnabled = (val: boolean | ((prev: boolean) => boolean)) => {
    setCrtEnabledState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('term_crt', String(next));
      return next;
    });
  };

  useEffect(() => {
    soundFX.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Apply CSS custom properties to root
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    root.style.setProperty('--term-bg', colors.bg);
    root.style.setProperty('--term-bg-sec', colors.bgSecondary);
    root.style.setProperty('--term-text', colors.text);
    root.style.setProperty('--term-muted', colors.textMuted);
    root.style.setProperty('--term-border', colors.border);
    root.style.setProperty('--term-accent', colors.accent);
    root.style.setProperty('--term-accent-sec', colors.accentSecondary);
    root.style.setProperty('--term-prompt-user', colors.promptUser);
    root.style.setProperty('--term-prompt-host', colors.promptHost);
    root.style.setProperty('--term-prompt-path', colors.promptPath);
    root.style.setProperty('--term-prompt-char', colors.promptChar);
    root.style.setProperty('--term-success', colors.success);
    root.style.setProperty('--term-error', colors.error);
    root.style.setProperty('--term-warning', colors.warning);
    root.style.setProperty('--term-info', colors.info);
    root.style.setProperty('--term-command', colors.command);
    root.style.setProperty('--term-link', colors.link);
    root.style.setProperty('--term-tag-bg', colors.tagBg);
    root.style.setProperty('--term-tag-text', colors.tagText);
    root.style.setProperty('--term-cursor', colors.cursor);
  }, [currentTheme]);

  return {
    theme: currentTheme,
    themeId,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    crtEnabled,
    setCrtEnabled,
    allThemes: THEMES
  };
}
