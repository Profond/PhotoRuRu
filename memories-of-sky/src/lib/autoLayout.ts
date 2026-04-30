export interface PhotoLayout {
  size: number;
  rotate: number;
  mt: number;
  ml: number;
  scrub: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function seededRandom(index: number, salt: number): number {
  const hash = ((index * 2654435761 + salt * 40503) >>> 0) % 1000;
  return hash / 1000;
}

const BUILTIN_LAYOUTS: PhotoLayout[] = [
  { size: 280, rotate: -4, mt: 0, ml: 0, scrub: 0.4 },
  { size: 340, rotate: 3, mt: 48, ml: 16, scrub: 0.55 },
  { size: 280, rotate: -2, mt: 16, ml: 32, scrub: 0.7 },
  { size: 220, rotate: 5, mt: 64, ml: 8, scrub: 0.85 },
];

export function generateLayout(count: number): PhotoLayout[] {
  if (count <= 4) {
    return BUILTIN_LAYOUTS.slice(0, count);
  }

  const layouts: PhotoLayout[] = [...BUILTIN_LAYOUTS];
  for (let i = 4; i < count; i++) {
    const t = i / (count - 1);
    layouts.push({
      size: Math.round(lerp(220, 340, seededRandom(i, 0))),
      rotate: Math.round(lerp(-6, 6, seededRandom(i, 1)) * 10) / 10,
      mt: Math.round(lerp(0, 64, seededRandom(i, 2))),
      ml: Math.round(lerp(0, 32, seededRandom(i, 3))),
      scrub: Math.round(lerp(0.35, 0.9, t) * 100) / 100,
    });
  }
  return layouts;
}
