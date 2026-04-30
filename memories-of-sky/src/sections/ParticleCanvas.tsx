import { useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import type { Season } from '@/types';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  phase: number;
  pulseSpeed: number;
  color: string;
  amplitude: number;
  frequency: number;
}

function createParticles(season: Season, width: number, height: number): Particle[] {
  const particles: Particle[] = [];

  switch (season) {
    case 'spring': {
      // 80 cherry blossom petals
      const count = 80;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 3 + Math.random() * 6,
          speedX: 0.3 + Math.random() * 0.7,
          speedY: 0.5 + Math.random() * 0.8,
          opacity: 0.4 + Math.random() * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.03,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0,
          color: '#FAD0C4',
          amplitude: 20 + Math.random() * 40,
          frequency: 0.001 + Math.random() * 0.002,
        });
      }
      break;
    }
    case 'summer': {
      // 50 fireflies
      const count = 50;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 1.5 + Math.random() * 3,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: 0.3 + Math.random() * 0.7,
          rotation: 0,
          rotationSpeed: 0,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 2 + Math.random() * 2,
          color: '#FFD700',
          amplitude: 0,
          frequency: 0,
        });
      }
      break;
    }
    case 'autumn': {
      // 70 maple leaves
      const colors = ['#D35400', '#E74C3C', '#F39C12', '#C0392B'];
      const count = 70;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 6 + Math.random() * 10,
          speedX: 0.5 + Math.random() * 1,
          speedY: 1 + Math.random() * 1.5,
          opacity: 0.5 + Math.random() * 0.4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
          amplitude: 30 + Math.random() * 60,
          frequency: 0.0005 + Math.random() * 0.001,
        });
      }
      break;
    }
    case 'winter': {
      // 100 snowflakes
      const count = 100;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 2 + Math.random() * 4,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: 0.8 + Math.random() * 1.2,
          opacity: 0.3 + Math.random() * 0.5,
          rotation: 0,
          rotationSpeed: 0,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0,
          color: 'rgba(255,255,255,0.8)',
          amplitude: 10 + Math.random() * 20,
          frequency: 0.001 + Math.random() * 0.002,
        });
      }
      break;
    }
  }

  return particles;
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, season: Season, time: number) {
  ctx.save();
  ctx.globalAlpha = p.opacity;

  switch (season) {
    case 'spring': {
      // Elliptical petal
      const rx = p.size * 0.6;
      const ry = p.size;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'summer': {
      // Glowing radial gradient
      const pulse = Math.sin(time * 0.001 * p.pulseSpeed + p.phase) * 0.5 + 0.5;
      ctx.globalAlpha = p.opacity * (0.3 + pulse * 0.7);
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'autumn': {
      // Maple leaf shape (5-point)
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const s = p.size;
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.3, -s * 0.3, s, -s * 0.5);
      ctx.quadraticCurveTo(s * 0.5, 0, s * 0.8, s * 0.5);
      ctx.quadraticCurveTo(s * 0.3, s * 0.3, 0, s);
      ctx.quadraticCurveTo(-s * 0.3, s * 0.3, -s * 0.8, s * 0.5);
      ctx.quadraticCurveTo(-s * 0.5, 0, -s, -s * 0.5);
      ctx.quadraticCurveTo(-s * 0.3, -s * 0.3, 0, -s);
      ctx.fill();
      break;
    }
    case 'winter': {
      // Snow with soft glow
      ctx.shadowBlur = p.size * 2;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      break;
    }
  }

  ctx.restore();
}

function updateParticle(p: Particle, season: Season, width: number, height: number, time: number) {
  switch (season) {
    case 'spring': {
      p.x += p.speedX + Math.sin(time * p.frequency + p.phase) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      break;
    }
    case 'summer': {
      p.x += p.speedX + (Math.random() - 0.5) * 0.3;
      p.y += p.speedY + (Math.random() - 0.5) * 0.2;
      if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      }
      break;
    }
    case 'autumn': {
      p.x += p.speedX + Math.sin(time * p.frequency + p.phase) * 1.5;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      if (p.y > height + 30) {
        p.y = -30;
        p.x = Math.random() * width;
      }
      if (p.x > width + 30) p.x = -30;
      if (p.x < -30) p.x = width + 30;
      break;
    }
    case 'winter': {
      p.x += p.speedX + Math.sin(time * p.frequency + p.phase) * 0.3;
      p.y += p.speedY;
      if (p.y > height + 10) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      if (p.x > width + 10) p.x = -10;
      if (p.x < -10) p.x = width + 10;
      break;
    }
  }
}

export default function ParticleCanvas() {
  const { currentSeason } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const seasonRef = useRef<Season>(currentSeason.id);
  const animRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = createParticles(currentSeason.id, width, height);
    seasonRef.current = currentSeason.id;
  }, [currentSeason.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check season change
      if (seasonRef.current !== currentSeason.id) {
        initParticles(canvas.width, canvas.height);
      }

      const particles = particlesRef.current;
      for (const p of particles) {
        updateParticle(p, currentSeason.id, canvas.width, canvas.height, time);
        drawParticle(ctx, p, currentSeason.id, time);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [currentSeason.id, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
}
