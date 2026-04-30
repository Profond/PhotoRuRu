import { useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SEASONS } from '@/types';
import type { Season } from '@/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Seasons() {
  const { t, setSeason } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const seasonRefs = useRef<(HTMLDivElement | null)[]>([]);

  const seasonNames: Record<string, string> = {
    spring: t.springName,
    summer: t.summerName,
    autumn: t.autumnName,
    winter: t.winterName,
  };

  const seasonContent: Record<Season, { title: string; poem: string[] }> = {
    spring: { title: t.springStoryTitle, poem: [t.sp1, t.sp2, t.sp3, t.sp4] },
    summer: { title: t.summerStoryTitle, poem: [t.sup1, t.sup2, t.sup3, t.sup4] },
    autumn: { title: t.autumnStoryTitle, poem: [t.ap1, t.ap2, t.ap3, t.ap4] },
    winter: { title: t.winterStoryTitle, poem: [t.wp1, t.wp2, t.wp3, t.wp4] },
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      seasonRefs.current.forEach((el, i) => {
        if (!el) return;
        const seasonId = SEASONS[i].id;

        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setSeason(seasonId),
          onEnterBack: () => setSeason(seasonId),
        });

        const watermark = el.querySelector('.season-watermark');
        if (watermark) {
          gsap.fromTo(watermark,
            { opacity: 0, y: 100 },
            {
              opacity: 0.06, y: 0, duration: 1.2, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
            }
          );
        }

        const panel = el.querySelector('.season-panel');
        if (panel) {
          gsap.fromTo(panel,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 1, ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 70%', toggleActions: 'play none none none' },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setSeason, t]);

  return (
    <section ref={sectionRef} className="relative z-10">
      <div className="text-center px-[5vw] py-24 lg:py-32">
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          {t.seasonsTitle}
        </h2>
      </div>

      {SEASONS.map((season, i) => {
        const content = seasonContent[season.id];
        const glassClass = `glass-panel-${season.id}`;
        return (
          <div
            key={season.id}
            ref={(el) => { seasonRefs.current[i] = el; }}
            className="relative min-h-[100dvh] flex items-center justify-center px-[5vw]"
          >
            <div
              className="season-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-0"
              style={{ zIndex: 0 }}
            >
              <span
                className="font-display text-white"
                style={{ fontSize: 'clamp(15rem, 40vw, 35rem)', fontWeight: 600, letterSpacing: '0.1em' }}
              >
                {season.kanji}
              </span>
            </div>

            <div
              className={`season-panel glass-panel ${glassClass} relative max-w-2xl w-full p-8 lg:p-12 opacity-0`}
              style={{ borderLeft: `3px solid ${season.color}` }}
            >
              <h3
                className="font-display text-white mb-1"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 300, letterSpacing: '0.1em' }}
              >
                {content.title}
              </h3>
              <p
                className="font-display text-white/40 italic mb-8"
                style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', fontWeight: 300 }}
              >
                {seasonNames[season.id]}
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  {content.poem.map((line, j) => (
                    <p
                      key={j}
                      className="font-display text-white/90"
                      style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 300, lineHeight: 2.2, letterSpacing: '0.08em' }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
