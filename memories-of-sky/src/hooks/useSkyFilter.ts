import { useMemo } from 'react'

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t))
}

function getSegmentT(t: number, start: number, end: number): number {
  return clamp01((t - start) / (end - start))
}

export interface SkyFilter {
  brightness: number
  sepia: number
  hueRotate: number
  saturate: number
  glowColor: string
}

export function useSkyFilter(timeFraction: number): SkyFilter {
  return useMemo(() => {
    const t = timeFraction

    if (t < 0.15) {
      const seg = getSegmentT(t, 0, 0.15)
      return {
        brightness: lerp(0.7, 1, seg),
        sepia: lerp(0.3, 0, seg),
        hueRotate: lerp(-30, -15, seg),
        saturate: 1,
        glowColor: `rgba(250, 208, 196, ${lerp(0.3, 0.1, seg)})`,
      }
    }
    if (t < 0.35) {
      const seg = getSegmentT(t, 0.15, 0.35)
      return {
        brightness: lerp(1, 1.1, seg),
        sepia: 0,
        hueRotate: lerp(-15, 0, seg),
        saturate: lerp(1, 1.06, seg),
        glowColor: `rgba(255, 255, 255, ${lerp(0.1, 0.05, seg)})`,
      }
    }
    if (t < 0.55) {
      const seg = getSegmentT(t, 0.35, 0.55)
      return {
        brightness: lerp(1.1, 1.04, seg),
        sepia: 0,
        hueRotate: 0,
        saturate: 1.06,
        glowColor: `rgba(255, 230, 150, ${lerp(0.05, 0.15, seg)})`,
      }
    }
    if (t < 0.75) {
      const seg = getSegmentT(t, 0.55, 0.75)
      return {
        brightness: lerp(0.9, 0.6, seg),
        sepia: lerp(0, 0.3, seg),
        hueRotate: lerp(-15, -25, seg),
        saturate: 1,
        glowColor: `rgba(255, 100, 50, ${lerp(0.15, 0.3, seg)})`,
      }
    }
    const seg = getSegmentT(t, 0.75, 1)
    return {
      brightness: lerp(0.4, 0.33, seg),
      sepia: 0,
      hueRotate: lerp(180, 190, seg),
      saturate: 1.5,
      glowColor: `rgba(100, 100, 255, ${lerp(0.2, 0.35, seg)})`,
    }
  }, [timeFraction])
}
