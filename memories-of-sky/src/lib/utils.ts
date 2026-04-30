import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export const SEASON_COLORS: Record<Season, string> = {
  spring: '#FAD0C4',
  summer: '#FFD700',
  autumn: '#D35400',
  winter: '#BDC3C7',
}

export const SEASON_LABELS: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
}

export function getTimeLabel(fraction: number): string {
  const totalMinutes = Math.round(fraction * 20 * 60 + 4 * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
