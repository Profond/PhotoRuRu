import { useRef, useEffect } from 'react';

interface MeteorEffectProps {
  active: boolean;
  onDone: () => void;
}

export default function MeteorEffect({ active, onDone }: MeteorEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = canvas.width * 0.2;
    const startY = canvas.height * 0.15;
    const endX = canvas.width * 0.7;
    const endY = canvas.height * 0.45;
    const duration = 2000;
    const startTime = performance.now();
    let raf = 0;

    function animate(now: number) {
      if (!ctx || !canvas) return;
      const progress = Math.min(1, (now - startTime) / duration);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;

      // Tail — 200px linear gradient
      const tailLen = 200 * (1 - progress * 0.4);
      const angle = Math.atan2(endY - startY, endX - startX);
      const tailX = x - Math.cos(angle) * tailLen;
      const tailY = y - Math.sin(angle) * tailLen;

      const tailGrad = ctx.createLinearGradient(tailX, tailY, x, y);
      tailGrad.addColorStop(0, 'rgba(100, 150, 255, 0)');
      tailGrad.addColorStop(0.6, 'rgba(150, 200, 255, 0.3)');
      tailGrad.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Head — radial gradient white → blue
      const headGrad = ctx.createRadialGradient(x, y, 0, x, y, 14);
      headGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      headGrad.addColorStop(0.35, 'rgba(150, 200, 255, 0.6)');
      headGrad.addColorStop(1, 'rgba(80, 130, 255, 0)');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        // Fade out canvas after flight
        let fadeStart = performance.now();
        function fade(now: number) {
          if (!ctx || !canvas) return;
          const t = Math.min(1, (now - fadeStart) / 500);
          ctx.globalAlpha = 1 - t;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (t < 1) {
            raf = requestAnimationFrame(fade);
          } else {
            ctx.globalAlpha = 1;
            onDone();
          }
        }
        raf = requestAnimationFrame(fade);
      }
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, onDone]);

  if (!active) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[60] pointer-events-none"
      />
      {/* Vertical text: 君の名は。 */}
      <div className="fixed inset-0 z-[55] flex items-center justify-center pointer-events-none">
        <div
          className="font-display text-6xl md:text-8xl"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            color: '#FFD700',
            textShadow:
              '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3), 0 0 100px rgba(255,215,0,0.15)',
            animation: 'meteorTextFade 5s ease forwards',
          }}
        >
          君の名は。
        </div>
      </div>

      <style>{`
        @keyframes meteorTextFade {
          0%   { opacity: 0; transform: translateY(24px) scale(0.95); }
          15%  { opacity: 1; transform: translateY(0) scale(1); }
          70%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
