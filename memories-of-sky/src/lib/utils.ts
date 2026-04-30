import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function asset(path: string): string {
  return (import.meta.env.BASE_URL + path).replace(/\/+/g, '/')
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const SEASON_COLORS: Record<Season, string> = {
  spring: '#FAD0C4',
  summer: '#FFD700',
  autumn: '#D35400',
  winter: '#BDC3C7',
}

export const SEASON_LABELS: Record<Season, { jp: string; zh: string; en: string }> = {
  spring: { jp: 'はる', zh: '春', en: 'Spring' },
  summer: { jp: 'なつ', zh: '夏', en: 'Summer' },
  autumn: { jp: 'あき', zh: '秋', en: 'Autumn' },
  winter: { jp: 'ふゆ', zh: '冬', en: 'Winter' },
}

export function getTimeLabel(fraction: number): string {
  const totalMinutes = Math.round(fraction * 20 * 60 + 4 * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
