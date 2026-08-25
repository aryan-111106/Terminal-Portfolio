import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  onClose: () => void;
  accentColor?: string;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ onClose, accentColor = '#22c55e' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Matrix characters: Katakana + Latin + Digits + Math
    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF$+-*/=%<>';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const draw = () => {
      // Semi-transparent black rectangle for the trail effect
      ctx.fillStyle = 'rgba(0, 5, 2, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character is glowing white/bright
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = accentColor;
        } else {
          ctx.fillStyle = accentColor;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);

        // Reset drop to top with random delay after reaching bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
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
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, accentColor]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black cursor-pointer flex flex-col justify-between items-center"
      title="Click or press Esc/Q to exit"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
      <div className="relative z-50 mt-6 px-4 py-2 bg-black/80 border border-green-500/40 text-green-400 text-xs md:text-sm rounded backdrop-blur font-mono animate-pulse shadow-lg">
        [ MATRIX SIMULATION ACTIVE ] — Press <kbd className="bg-green-950 px-1 py-0.5 rounded border border-green-600 text-white">ESC</kbd> or <kbd className="bg-green-950 px-1 py-0.5 rounded border border-green-600 text-white">Q</kbd> or click to exit
      </div>

      <div className="relative z-50 mb-6 text-green-500/60 text-xs font-mono">
        "Follow the white rabbit..."
      </div>
    </div>
  );
};
