import React, { useEffect, useRef } from 'react';

interface ThemeBackgroundProps {
  themeId: string;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ themeId }) => {
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
      ctx.clearRect(0, 0, width, height);
    };
    window.addEventListener('resize', handleResize);

    // Initial clear
    ctx.clearRect(0, 0, width, height);

    // ==========================================
    // MATRIX GREEN: Background Digital Rain
    // ==========================================
    const matrixChars = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: { y: number; speed: number; char: string }[] = Array.from({ length: columns }, () => ({
      y: Math.random() * -80,
      speed: Math.random() * 0.3 + 0.4,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
    }));

    // ==========================================
    // DRACULA & NORD: Cosmic Stars / Frost Particles
    // ==========================================
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // ==========================================
    // CYBERPUNK: Synthwave Horizon Offset
    // ==========================================
    let gridOffset = 0;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS tick to prevent flickering

    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      if (themeId === 'matrix-green') {
        // Soft trail blend without clearRect to prevent flickering
        ctx.fillStyle = 'rgba(2, 5, 2, 0.09)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px "Fira Code", monospace`;
        for (let i = 0; i < drops.length; i += 2) {
          const drop = drops[i];
          if (!drop) continue;

          if (Math.random() > 0.85) {
            drop.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }

          const x = i * fontSize;
          const y = Math.floor(drop.y) * fontSize;

          // Glowing leading head
          ctx.fillStyle = 'rgba(134, 239, 172, 0.6)';
          ctx.fillText(drop.char, x, y);

          // Body trail
          ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
          const prevChar = matrixChars[(drop.char.charCodeAt(0) + 5) % matrixChars.length];
          ctx.fillText(prevChar, x, y - fontSize);

          if (y > height && Math.random() > 0.98) {
            drop.y = Math.random() * -30;
            drop.speed = Math.random() * 0.3 + 0.4;
          }
          drop.y += drop.speed;
        }
      } else {
        // Clear frame cleanly for non-trail themes
        ctx.clearRect(0, 0, width, height);

        if (themeId === 'dracula') {
          // Nebula gradient & floating stardust
          const grad = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.5, width * 0.8);
          grad.addColorStop(0, 'rgba(189, 147, 249, 0.08)');
          grad.addColorStop(0.5, 'rgba(255, 121, 198, 0.04)');
          grad.addColorStop(1, 'rgba(40, 42, 54, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += p.alphaSpeed;
            if (p.alpha > 0.8 || p.alpha < 0.2) p.alphaSpeed *= -1;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(189, 147, 249, ${p.alpha * 0.6})`;
            ctx.fill();
          });
        } else if (themeId === 'nord') {
          // Arctic Frost Aurora & Geometry
          const aurora = ctx.createLinearGradient(0, 0, width, height);
          aurora.addColorStop(0, 'rgba(136, 192, 208, 0.08)');
          aurora.addColorStop(0.5, 'rgba(129, 161, 193, 0.04)');
          aurora.addColorStop(1, 'rgba(46, 52, 64, 0)');
          ctx.fillStyle = aurora;
          ctx.fillRect(0, 0, width, height);

          // Constellation lines
          ctx.strokeStyle = 'rgba(136, 192, 208, 0.08)';
          ctx.lineWidth = 1;
          for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.x += p1.vx * 0.5;
            p1.y += p1.vy * 0.5;
            if (p1.x < 0) p1.x = width;
            if (p1.x > width) p1.x = 0;
            if (p1.y < 0) p1.y = height;
            if (p1.y > height) p1.y = 0;

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.radius * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(236, 239, 244, 0.4)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        } else if (themeId === 'cyberpunk') {
          // Perspective Synthwave Grid
          gridOffset = (gridOffset + 0.6) % 30;
          const horizon = height * 0.65;

          const sunGrad = ctx.createRadialGradient(width * 0.5, horizon, 20, width * 0.5, horizon, width * 0.4);
          sunGrad.addColorStop(0, 'rgba(255, 0, 85, 0.22)');
          sunGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.06)');
          sunGrad.addColorStop(1, 'rgba(10, 10, 18, 0)');
          ctx.fillStyle = sunGrad;
          ctx.fillRect(0, 0, width, height);

          // Grid lines radiating to horizon
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
          ctx.lineWidth = 1;
          const vanishX = width / 2;

          for (let x = -width; x <= width * 2; x += 90) {
            ctx.beginPath();
            ctx.moveTo(vanishX, horizon);
            ctx.lineTo(x, height);
            ctx.stroke();
          }

          // Horizontal lines moving forward
          for (let y = horizon; y <= height; y += 15) {
            const depth = (y - horizon) / (height - horizon);
            const movingY = horizon + Math.pow(depth, 1.8) * (height - horizon);
            ctx.strokeStyle = `rgba(255, 0, 85, ${depth * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(0, movingY);
            ctx.lineTo(width, movingY);
            ctx.stroke();
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeId]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden transition-all duration-700 z-0">
      {/* Dynamic Background Gradients & Mesh for each Theme */}
      {themeId === 'matrix-green' && (
        <div 
          className="absolute inset-0 bg-[#020502]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.08) 0%, rgba(0, 0, 0, 0.95) 75%),
              linear-gradient(to right, rgba(34, 197, 94, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(34, 197, 94, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          }}
        />
      )}

      {themeId === 'dracula' && (
        <div 
          className="absolute inset-0 bg-[#1e1f29]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(189, 147, 249, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255, 121, 198, 0.12) 0%, transparent 50%),
              linear-gradient(135deg, rgba(68, 71, 90, 0.15) 25%, transparent 25%),
              linear-gradient(225deg, rgba(68, 71, 90, 0.15) 25%, transparent 25%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 60px 60px, 60px 60px',
          }}
        />
      )}

      {themeId === 'catppuccin' && (
        <div 
          className="absolute inset-0 bg-[#181825]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 75% 20%, rgba(203, 166, 247, 0.12) 0%, transparent 45%),
              radial-gradient(circle at 25% 80%, rgba(137, 180, 250, 0.12) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(245, 194, 231, 0.08) 0%, transparent 60%)
            `,
          }}
        />
      )}

      {themeId === 'nord' && (
        <div 
          className="absolute inset-0 bg-[#242933]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 10%, rgba(136, 192, 208, 0.15) 0%, transparent 60%),
              linear-gradient(to right, rgba(67, 76, 94, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(67, 76, 94, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          }}
        />
      )}

      {themeId === 'gruvbox' && (
        <div 
          className="absolute inset-0 bg-[#141617]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 40%, rgba(254, 128, 25, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 80% 80%, rgba(184, 187, 38, 0.08) 0%, transparent 50%),
              linear-gradient(to right, rgba(60, 56, 54, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(60, 56, 54, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px',
          }}
        />
      )}

      {themeId === 'cyberpunk' && (
        <div 
          className="absolute inset-0 bg-[#05050a]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 30%, rgba(0, 240, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 0, 85, 0.18) 0%, transparent 60%),
              linear-gradient(to right, rgba(0, 240, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 0, 85, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 50px 50px, 50px 50px',
          }}
        />
      )}

      {themeId === 'ubuntu' && (
        <div 
          className="absolute inset-0 bg-[#1b0514]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 80% 20%, rgba(233, 84, 32, 0.22) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(119, 33, 111, 0.35) 0%, transparent 60%),
              linear-gradient(135deg, rgba(92, 22, 71, 0.2) 25%, transparent 25%),
              linear-gradient(225deg, rgba(92, 22, 71, 0.2) 25%, transparent 25%)
            `,
            backgroundSize: '100% 100%, 100% 100%, 64px 64px, 64px 64px',
          }}
        />
      )}

      {/* Animated Canvas for Particles & Visual Dynamics */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90 pointer-events-none" />

      {/* Subtle Vignette Shading */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 160px rgba(0, 0, 0, 0.85)'
        }}
      />
    </div>
  );
};
