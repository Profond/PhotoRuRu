import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useSkyFilter } from '@/hooks/useSkyFilter'
import { asset } from '@/lib/utils'

const VIDEO_MAP: Record<string, string> = {
  spring: asset('/videos/spring.mp4'),
  summer: asset('/videos/summer.mp4'),
  autumn: asset('/videos/autumn.mp4'),
  winter: asset('/videos/winter.mp4'),
}

export default function VideoBackground() {
  const { season, timeFraction } = useApp()
  const skyFilter = useSkyFilter(timeFraction)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentSeason, setCurrentSeason] = useState(season)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (season === currentSeason) return
    setOpacity(0)
    const timer = setTimeout(() => {
      setCurrentSeason(season)
      if (videoRef.current) {
        videoRef.current.load()
        videoRef.current.play().catch(() => {})
      }
      setOpacity(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [season, currentSeason])

  const filterStyle = [
    `brightness(${skyFilter.brightness})`,
    skyFilter.sepia > 0 ? `sepia(${skyFilter.sepia})` : '',
    `hue-rotate(${skyFilter.hueRotate}deg)`,
    `saturate(${skyFilter.saturate})`,
  ].filter(Boolean).join(' ')

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity,
          filter: filterStyle,
          transition: 'opacity 500ms ease',
        }}
        src={VIDEO_MAP[currentSeason]}
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${skyFilter.glowColor}, transparent 70%)`,
          transition: 'background 1s ease',
        }}
      />
    </div>
  )
}
