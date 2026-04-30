import { useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const { t } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const polaroidsRef = useRef<(HTMLDivElement | null)[]>([]);

  const photos = [
    { id: 'spring', image: '/images/spring-sakura.jpg', size: 280, rotate: -4, mt: 0, ml: 0, scrub: 0.4 },
    { id: 'summer', image: '/images/summer-clouds.jpg', size: 340, rotate: 3, mt: 48, ml: 16, scrub: 0.55 },
    { id: 'autumn', image: '/images/autumn-railway.jpg', size: 280, rotate: -2, mt: 16, ml: 32, scrub: 0.7 },
    { id: 'winter', image: '/images/winter-snow.jpg', size: 220, rotate: 5, mt: 64, ml: 8, scrub: 0.85 },
  ];

  const photoLabels: Record<string, string> = {
    spring: t.springPhoto,
    summer: t.summerPhoto,
    autumn: t.autumnPhoto,
    winter: t.winterPhoto,
  };

  const handleMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    const el = polaroidsRef.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -y * 16;
    const rotateY = x * 16;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${photos[index].rotate}deg)`;
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const el = polaroidsRef.current[index];
    if (!el) return;
    el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) rotate(${photos[index].rotate}deg)`;
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        polaroidsRef.current.filter(Boolean),
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.15, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      polaroidsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: -(20 + i * 10), ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: photos[i].scrub },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 px-[5vw] py-24 lg:py-32">
      <div className="text-center mb-16">
        <h2
          className="font-display text-white"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '0.1em' }}
        >
          {t.galleryTitle}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center items-start gap-8 max-w-6xl mx-auto">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            ref={(el) => { polaroidsRef.current[i] = el; }}
            className="polaroid opacity-0"
            style={{
              marginTop: `${photo.mt}px`,
              marginLeft: `${photo.ml}px`,
              transform: `rotate(${photo.rotate}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
          >
            <div className="overflow-hidden" style={{ width: `${photo.size}px`, height: `${photo.size * 1.15}px` }}>
              <img src={photo.image} alt={photoLabels[photo.id]} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#333' }}>
              {photoLabels[photo.id]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
