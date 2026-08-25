import React, { useEffect, useRef } from 'react';
import { TerminalTheme } from '../../config/themes';

interface MatrixRainProps {
  onClose: () => void;
  theme: TerminalTheme;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onClose, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Matrix characters: Katakana + Latin + Digits + Math symbols
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF$+-*/=%<>@#&*{}[]';
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);

    // Track each column's drop position and speed
    interface Drop {
      y: number;
      speed: number;
      char: string;
      length: number;
    }

    let drops: Drop[] = [];

    const initMatrix = () => {
      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => ({
        y: Math.floor(Math.random() * -60),
        speed: Math.random() * 0.4 + 0.6,
        char: chars.charAt(Math.floor(Math.random() * chars.length)),
        length: Math.floor(Math.random() * 20 + 10),
      }));

      // Initial solid background fill
      ctx.fillStyle = theme.colors.bg || '#000000';
      ctx.fillRect(0, 0, width, height);
    };

    initMatrix();

    // Convert hex theme color to rgba helper
    const hexToRgba = (hex: string, alpha: number) => {
      const cleanHex = hex.replace('#', '');
      let r = 34, g = 197, b = 94;
      if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
      } else if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const accent = theme.colors.accent || '#22c55e';
    const accentSecondary = theme.colors.accentSecondary || theme.colors.promptPath || '#86efac';
    const bg = theme.colors.bg || '#050a05';

    let lastTime = 0;
    const fpsInterval = 1000 / 30; // Smooth 30 FPS tick to prevent jitter/flicker

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // Controlled fade out trail using background color with low opacity
      ctx.fillStyle = hexToRgba(bg, 0.1);
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        // Occasionally mutate character for authentic matrix shimmer
        if (Math.random() > 0.88) {
          drop.char = chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const x = i * fontSize;
        const y = Math.floor(drop.y) * fontSize;

        // Render head glyph in glowing white or light tint
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = accent;
        ctx.fillText(drop.char, x, y);

        // Render previous glyphs in theme accent color
        ctx.fillStyle = accent;
        ctx.shadowBlur = 0;
        const prevChar = chars.charAt((drop.char.charCodeAt(0) + 7) % chars.length);
        ctx.fillText(prevChar, x, y - fontSize);

        // Render faint trail glyph
        ctx.fillStyle = hexToRgba(accentSecondary, 0.6);
        const trailChar = chars.charAt((drop.char.charCodeAt(0) + 13) % chars.length);
        ctx.fillText(trailChar, x, y - fontSize * 2);

        // Reset drop to top with random length
        if (y > height && Math.random() > 0.975) {
          drop.y = Math.floor(Math.random() * -20);
          drop.speed = Math.random() * 0.4 + 0.6;
        }

        drop.y += drop.speed;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q' || (e.ctrlKey && e.key === 'c')) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, theme]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 cursor-pointer flex flex-col justify-between items-center select-none"
      style={{ backgroundColor: theme.colors.bg }}
      title="Click or press Esc/Q to exit"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      {/* Top Status Header */}
      <div 
        className="relative z-50 mt-6 px-4 py-2 bg-black/85 border rounded backdrop-blur font-mono text-xs md:text-sm shadow-2xl transition-all"
        style={{
          borderColor: theme.colors.border,
          color: theme.colors.text,
          boxShadow: `0 0 20px ${theme.colors.accent}40`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.colors.accent }} />
          <span>[ MATRIX SIMULATION • {theme.name.toUpperCase()} ]</span>
          <span className="text-gray-400 hidden sm:inline">— Press <kbd className="px-1.5 py-0.5 rounded border text-white font-bold" style={{ backgroundColor: theme.colors.tagBg, borderColor: theme.colors.border }}>ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded border text-white font-bold" style={{ backgroundColor: theme.colors.tagBg, borderColor: theme.colors.border }}>Q</kbd> to exit</span>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div 
        className="relative z-50 mb-6 text-xs font-mono px-3 py-1 rounded bg-black/70 backdrop-blur"
        style={{ color: theme.colors.textMuted }}
      >
        "Wake up, Neo... The Matrix has you." (Click anywhere to exit)
      </div>
    </div>
  );
};
