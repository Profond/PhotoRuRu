import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useApp } from '@/contexts/AppContext'
import { SEASON_COLORS } from '@/lib/utils'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const { season, t } = useApp()

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !scrollHintRef.current) return

    const tl = gsap.timeline()

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.3 }
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' },
      '-=1'
    )
    .fromTo(
      scrollHintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      '-=0.5'
    )

    const line = scrollHintRef.current.querySelector('.scroll-line')
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        { scaleY: 1, duration: 1.5, ease: 'power1.inOut', yoyo: true, repeat: -1 }
      )
    }
  }, [])

  const color = SEASON_COLORS[season]

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-[100dvh] flex items-center pl-[10vw]"
    >
      <div className="flex items-center gap-8 md:gap-16">
        {/* Vertical title */}
        <div
          ref={titleRef}
          className="writing-vertical font-display opacity-0"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 200,
            letterSpacing: '0.25em',
            textShadow: `0 0 40px ${color}40, 0 0 80px ${color}20`,
            height: 'clamp(200px, 50vh, 400px)',
          }}
        >
          {t.heroTitle}
        </div>

        {/* English title and subtitle */}
        <div ref={subtitleRef} className="opacity-0">
          <h1
            className="font-display-en"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 200,
              lineHeight: 1.2,
            }}
          >
            Memories
            <br />
            <span className="text-white/60">of the Sky</span>
          </h1>
          <div className="mt-6 space-y-2">
            <p className="font-display-en text-white/50 text-sm md:text-base italic">
              {t.heroSubJp}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
      >
        <span className="font-mono-label text-[10px] text-white/40 tracking-[0.3em] writing-vertical">
          SCROLL
        </span>
        <div className="w-px h-12 bg-white/30 overflow-hidden">
          <div className="scroll-line w-full h-full bg-white/60 origin-top" />
        </div>
      </div>
    </section>
  )
}
