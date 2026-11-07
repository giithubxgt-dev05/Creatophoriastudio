import React, { useEffect, useRef } from 'react';

export const AuroraCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animId: number;

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.2, y: 0.3, r: 0.35, color: 'rgba(0,229,168,', speed: 0.0004, offset: 0 },
      { x: 0.7, y: 0.2, r: 0.4, color: 'rgba(83,243,255,', speed: 0.0003, offset: 1 },
      { x: 0.5, y: 0.7, r: 0.3, color: 'rgba(123,97,255,', speed: 0.0005, offset: 2 },
      { x: 0.85, y: 0.5, r: 0.25, color: 'rgba(0,229,168,', speed: 0.0006, offset: 0.5 }
    ];

    let t = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      orbs.forEach(orb => {
        const px = (orb.x + Math.sin(t * orb.speed + orb.offset) * 0.12) * width;
        const py = (orb.y + Math.cos(t * orb.speed + orb.offset) * 0.08) * height;
        const r = orb.r * Math.min(width, height);
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
        grad.addColorStop(0, orb.color + '0.14)');
        grad.addColorStop(0.5, orb.color + '0.05)');
        grad.addColorStop(1, orb.color + '0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
