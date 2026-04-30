import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '@/contexts/AppContext'
import { asset } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface GalleryItem {
  jpKey: string
  image: string
  width: string
  rotate: string
  marginTop: string
  marginLeft: string
  parallaxFactor: number
}

function getItems(t: ReturnType<typeof useApp>['t']): (GalleryItem & { label: string })[] {
  return [
    {
      jpKey: 'springBreeze',
      label: t.springBreeze,
      image: asset('/images/spring-breeze.jpg'),
      width: '280px',
      rotate: '-4deg',
      marginTop: '0px',
      marginLeft: '0px',
      parallaxFactor: 0.4,
    },
    {
      jpKey: 'summerHeat',
      label: t.summerHeat,
      image: asset('/images/summer-heat.jpg'),
      width: '340px',
      rotate: '3deg',
      marginTop: '40px',
      marginLeft: '-20px',
      parallaxFactor: 0.55,
    },
    {
      jpKey: 'autumnFarewell',
      label: t.autumnFarewell,
      image: asset('/images/autumn-farewell.jpg'),
      width: '280px',
      rotate: '-2deg',
      marginTop: '-20px',
      marginLeft: '30px',
      parallaxFactor: 0.7,
    },
    {
      jpKey: 'winterSilence',
      label: t.winterSilence,
      image: asset('/images/winter-silence.jpg'),
      width: '220px',
      rotate: '5deg',
      marginTop: '60px',
      marginLeft: '-10px',
      parallaxFactor: 0.85,
    },
  ]
}

function PolaroidCard({ item }: { item: GalleryItem & { label: string } }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) rotate(${item.rotate})`
    }

    const handleMouseLeave = () => {
      const card = cardRef.current
      if (!card) return
      card.style.transform = `perspective(600px) rotateY(0deg) rotateX(0deg) rotate(${item.rotate})`
    }

    const el = cardRef.current
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [item.rotate])

  return (
    <div
      ref={cardRef}
      className="polaroid inline-block cursor-pointer transition-transform duration-300"
      style={{
        width: item.width,
        maxWidth: '90vw',
        transform: `rotate(${item.rotate})`,
        marginTop: item.marginTop,
        marginLeft: item.marginLeft,
      }}
    >
      <div
        className="w-full aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 rounded-sm overflow-hidden"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="mt-3 flex justify-between items-end">
        <div>
          <p className="font-display text-sm text-[#333]">{item.label}</p>
        </div>
      </div>
    </div>
  )
}

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const { t } = useApp()
  const items = getItems(t)

  useEffect(() => {
    if (!cardsRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.polaroid')
      if (!cards) return

      gsap.fromTo(
        cards,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      cards.forEach((card, i) => {
        gsap.to(card, {
          y: -50 * items[i].parallaxFactor,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [items])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-[5vw] py-24"
    >
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl md:text-4xl mb-2">{t.galleryTitle}</h2>
        {t.galleryTitleEn && (
          <p className="font-display-en text-lg text-white/50">{t.galleryTitleEn}</p>
        )}
      </div>

      <div
        ref={cardsRef}
        className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl"
      >
        {items.map((item) => (
          <PolaroidCard key={item.jpKey} item={item} />
        ))}
      </div>
    </section>
  )
}
