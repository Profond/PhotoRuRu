import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '@/contexts/AppContext'
import { SEASON_COLORS, type Season } from '@/lib/utils'
import type { Translations } from '@/lib/translations'

gsap.registerPlugin(ScrollTrigger)

interface SeasonStory {
  season: Season
  kanji: string
  titleKey: 'springTitle' | 'summerTitle' | 'autumnTitle' | 'winterTitle'
  titleEnKey: 'springTitleEn' | 'summerTitleEn' | 'autumnTitleEn' | 'winterTitleEn'
  poemJpKey: 'springPoemJp' | 'summerPoemJp' | 'autumnPoemJp' | 'winterPoemJp'
  poemEnKey: 'springPoemEn' | 'summerPoemEn' | 'autumnPoemEn' | 'winterPoemEn'
}

const stories: SeasonStory[] = [
  {
    season: 'spring',
    kanji: '春',
    titleKey: 'springTitle',
    titleEnKey: 'springTitleEn',
    poemJpKey: 'springPoemJp',
    poemEnKey: 'springPoemEn',
  },
  {
    season: 'summer',
    kanji: '夏',
    titleKey: 'summerTitle',
    titleEnKey: 'summerTitleEn',
    poemJpKey: 'summerPoemJp',
    poemEnKey: 'summerPoemEn',
  },
  {
    season: 'autumn',
    kanji: '秋',
    titleKey: 'autumnTitle',
    titleEnKey: 'autumnTitleEn',
    poemJpKey: 'autumnPoemJp',
    poemEnKey: 'autumnPoemEn',
  },
  {
    season: 'winter',
    kanji: '冬',
    titleKey: 'winterTitle',
    titleEnKey: 'winterTitleEn',
    poemJpKey: 'winterPoemJp',
    poemEnKey: 'winterPoemEn',
  },
]

function SeasonBlock({ story, t }: { story: SeasonStory; t: Translations }) {
  const blockRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const { setSeason } = useApp()
  const color = SEASON_COLORS[story.season]

  const title = t[story.titleKey]
  const titleEn = t[story.titleEnKey]
  const poemJp = t[story.poemJpKey]
  const poemEn = t[story.poemEnKey]

  useEffect(() => {
    if (!blockRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: blockRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setSeason(story.season),
        onEnterBack: () => setSeason(story.season),
      })

      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { opacity: 0, y: 100 },
          {
            opacity: 0.06,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: blockRef.current,
              start: 'top 80%',
            },
          }
        )
      }

      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: blockRef.current,
              start: 'top 70%',
            },
          }
        )
      }
    }, blockRef)

    return () => ctx.revert()
  }, [story.season, setSeason])

  return (
    <div
      ref={blockRef}
      className="relative min-h-[100dvh] flex items-center justify-center px-[5vw] py-24"
    >
      {/* Giant kanji watermark */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-0"
      >
        <span
          className="font-display"
          style={{
            fontSize: 'clamp(15rem, 40vw, 35rem)',
            fontWeight: 200,
            color: color,
          }}
        >
          {story.kanji}
        </span>
      </div>

      {/* Content panel */}
      <div
        ref={panelRef}
        className="glass-panel p-8 md:p-12 max-w-2xl w-full opacity-0"
        style={{
          background: `${color}12`,
          borderLeft: `3px solid ${color}`,
          borderColor: `${color}30`,
          borderLeftColor: color,
        }}
      >
        <h3 className="font-display text-2xl md:text-3xl mb-1">
          {title}
        </h3>
        {titleEn && (
          <p className="font-display-en text-base md:text-lg text-white/50 mb-8">
            {titleEn}
          </p>
        )}

        <div className="space-y-6">
          <div>
            {poemJp.map((line, i) => (
              <p key={i} className="font-body text-sm md:text-base leading-loose text-white/80">
                {line}
              </p>
            ))}
          </div>
          {poemEn.length > 0 && (
            <div>
              {poemEn.map((line, i) => (
                <p key={i} className="font-display-en italic text-xs md:text-sm leading-loose text-white/40">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SeasonsSection() {
  const { t } = useApp()

  return (
    <section id="seasons" className="relative z-10">
      <div className="text-center py-16">
        <h2 className="font-display text-3xl md:text-4xl mb-2">{t.seasonsTitle}</h2>
        {t.seasonsTitleEn && (
          <p className="font-display-en text-lg text-white/50">{t.seasonsTitleEn}</p>
        )}
      </div>
      {stories.map((story) => (
        <SeasonBlock key={story.season} story={story} t={t} />
      ))}
    </section>
  )
}
