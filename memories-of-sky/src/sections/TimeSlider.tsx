import { useRef, useCallback, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SLIDER_RANGE, SLIDER_MIN } from '@/types';
import MeteorEffect from './MeteorEffect';

// 05:46 as slider fraction: ((5 + 46/60) - 4) / 20
const METERO_TARGET = (5 + 46 / 60 - SLIDER_MIN) / SLIDER_RANGE;
const METERO_THRESHOLD = 2 / 60 / SLIDER_RANGE; // ±2 minutes

export default function TimeSlider() {
  const { sliderValue, setSliderValue, timeString } = useApp();
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [isGolden, setIsGolden] = useState(false);
  const [showMeteor, setShowMeteor] = useState(false);
  const meteorTriggered = useRef(false);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const value = x / rect.width;
      setSliderValue(value);

      // Easter egg: trigger at 05:46 ±2min
      if (Math.abs(value - METERO_TARGET) < METERO_THRESHOLD && !meteorTriggered.current) {
        meteorTriggered.current = true;
        setIsGolden(true);
        setShowMeteor(true);
        setTimeout(() => setIsGolden(false), 3000);
      }
    },
    [setSliderValue]
  );

  const handleMeteorDone = useCallback(() => {
    setShowMeteor(false);
    meteorTriggered.current = false;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      isDragging.current = true;
      updateFromClientX(e.clientX);
    },
    [updateFromClientX]
  );

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      updateFromClientX(e.clientX);
    };
    const handleUp = () => {
      isDragging.current = false;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [updateFromClientX]);

  const pct = sliderValue * 100;

  return (
    <>
      <MeteorEffect active={showMeteor} onDone={handleMeteorDone} />

      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center select-none"
        style={{ width: 'min(600px, 80vw)' }}
      >
        {/* Time display */}
        <span
          className="font-mono mb-4 transition-colors duration-300"
          style={{
            fontSize: '0.85rem',
            color: isGolden ? '#FFD700' : 'rgba(255,255,255,0.7)',
            letterSpacing: '0.15em',
            textShadow: isGolden ? '0 0 12px rgba(255,215,0,0.5)' : 'none',
          }}
        >
          {timeString}
        </span>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full cursor-pointer"
        style={{ height: '36px' }}
        onPointerDown={handlePointerDown}
      >
        {/* Tick marks */}
        <div className="absolute top-[15px] left-0 w-full pointer-events-none">
          {[0, 0.4, 1].map((pos) => (
            <div
              key={pos}
              className="absolute top-0"
              style={{ left: `${pos * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="mx-auto"
                style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.3)' }}
              />
              <span
                className="font-mono block text-center mt-2"
                style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}
              >
                {pos === 0 ? '04:00' : pos === 0.4 ? '12:00' : '24:00'}
              </span>
            </div>
          ))}
          <div className="absolute top-0" style={{ left: '70%', transform: 'translateX(-50%)' }}>
            <div className="mx-auto" style={{ width: '1px', height: '4px', background: 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>

        {/* Rail */}
        <div
          className="absolute top-[15px] left-0 w-full pointer-events-none"
          style={{ height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '1px' }}
        />

        {/* Fill */}
        <div
          className="absolute top-[15px] left-0 pointer-events-none"
          style={{
            width: `${pct}%`,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.8))',
            borderRadius: '1px',
            transition: isDragging.current ? 'none' : 'width 0.05s linear',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${pct}%`,
            transform: `translate(-50%, -50%) scale(${isDragging.current ? 1.15 : 1})`,
            transition: 'transform 0.15s ease-out, left 0.05s linear',
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: '16px',
              height: '16px',
              background: '#ffffff',
              boxShadow: isDragging.current
                ? '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2)'
                : '0 0 8px rgba(255,255,255,0.3)',
              transition: 'box-shadow 0.3s ease',
            }}
          />
        </div>
      </div>
      </div>
    </>
  );
}
