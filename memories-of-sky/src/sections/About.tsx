import { useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { asset } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        polaroidRef.current,
        { opacity: 0, x: -60, rotation: -8 },
        {
          opacity: 1, x: 0, rotation: -3,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      gsap.to(polaroidRef.current, {
        y: -80, rotation: 3, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1, x: 0,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      gsap.to(panelRef.current, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] z-10 flex items-center px-[5vw] py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full max-w-7xl mx-auto">
        {/* Polaroid */}
        <div className="flex justify-center">
          <div ref={polaroidRef} className="polaroid opacity-0" style={{ transform: 'rotate(-3deg)' }}>
            <div className="overflow-hidden" style={{ width: '280px', height: '350px' }}>
              <img
                src={asset("/images/photographer-portrait.jpg")}
                alt="Portrait"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-center mt-4" style={{ fontSize: '0.85rem', color: '#333' }}>
              {t.polaroidLabel}
            </p>
          </div>
        </div>

        {/* Glass panel */}
        <div ref={panelRef} className="glass-panel glass-panel-spring p-6 lg:p-8 opacity-0">
          <h2
            className="font-display text-white mb-6"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, letterSpacing: '0.1em' }}
          >
            {t.aboutTitle}
          </h2>

          <div className="space-y-4 mb-8">
            <p
              className="font-body text-white/80"
              style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', lineHeight: 1.9, letterSpacing: '0.05em' }}
            >
              {t.aboutP1}
            </p>
          </div>

          <div
            className="font-mono text-white/40 pt-4 border-t border-white/10"
            style={{ fontSize: '12px', letterSpacing: '0.02em' }}
          >
            {t.cameraInfo}
          </div>
        </div>
      </div>
    </section>
  );
}
