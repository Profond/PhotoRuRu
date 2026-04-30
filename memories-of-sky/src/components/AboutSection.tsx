import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '@/contexts/AppContext'
import { SEASON_COLORS } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const polaroidRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { season, t } = useApp()
  const color = SEASON_COLORS[season]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if (polaroidRef.current) {
        gsap.fromTo(
          polaroidRef.current,
          { opacity: 0, x: -60, rotation: -8 },
          {
            opacity: 1,
            x: 0,
            rotation: -3,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        )
        gsap.to(polaroidRef.current, {
          y: -80,
          rotation: 3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        )
        gsap.to(panelRef.current, {
          y: -40,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 min-h-[100dvh] flex items-center px-[5vw] py-24"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Polaroid */}
        <div ref={polaroidRef} className="flex justify-center opacity-0">
          <div className="polaroid inline-block" style={{ transform: 'rotate(-3deg)' }}>
            <div
              className="w-[280px] md:w-[340px] aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-sm overflow-hidden"
              style={{
                backgroundImage: 'url(/images/photographer.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <p className="mt-3 font-display-en italic text-[0.85rem] text-[#333] text-left">
              {t.aboutLocation}
            </p>
          </div>
        </div>

        {/* Glass panel */}
        <div
          ref={panelRef}
          className="glass-panel p-8 md:p-12 opacity-0"
          style={{
            background: `${color}12`,
            borderColor: `${color}30`,
          }}
        >
          <h2 className="font-display text-2xl md:text-3xl mb-2">
            {t.aboutTitleJp}
          </h2>
          <h3 className="font-display-en text-lg md:text-xl text-white/50 mb-8">
            {t.aboutTitleEn}
          </h3>

          <div className="space-y-6">
            <div>
              <p className="font-body text-sm md:text-base leading-relaxed text-white/80">
                {t.aboutText1}
              </p>
              {t.aboutText1En && (
                <p className="font-body text-xs md:text-sm leading-relaxed text-white/40 mt-2">
                  {t.aboutText1En}
                </p>
              )}
            </div>

            <div>
              <p className="font-body text-sm md:text-base leading-relaxed text-white/80">
                {t.aboutText2}
              </p>
              {t.aboutText2En && (
                <p className="font-body text-xs md:text-sm leading-relaxed text-white/40 mt-2">
                  {t.aboutText2En}
                </p>
              )}
            </div>
          </div>

          {/* Camera info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="font-mono-label text-[12px] text-white/30">
              Canon EOS R5 / RF 24-70mm f/2.8 / Film: Kodak Portra 400
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
