import type { Rng } from './rng'

// Tidal Treasures: tanıma hafızası. Her turda daha önce seçilmemiş nesneyi seç.
export interface TItem { id: number; shape: number; hue: number }
export const TIDAL_SHAPES = 12
export const tidalCount = (round: number) => Math.min(14, 4 + round)
export const tidalLevel = (round: number) => (round < 3 ? 1 : round < 7 ? 2 : 3)

/** L1: 12 farklı şekil, rastgele renk · L2: 3 şekil × 60° renk adımı · L3: 2 şekil × 28° adım (birbirine çok benzer nesneler). */
export function tidalSet(n: number, level: number, rng: Rng): TItem[] {
  const shapePool = level <= 1 ? TIDAL_SHAPES : level === 2 ? 3 : 2
  const step = level <= 1 ? 0 : level === 2 ? 60 : 28
  const used = new Set<string>()
  const items: TItem[] = []
  for (let guard = 0; items.length < n && guard < 1000; guard++) {
    const shape = rng.int(0, shapePool - 1)
    const hue = step === 0 ? rng.int(0, 359) : rng.int(0, Math.floor(360 / step) - 1) * step
    const key = `${shape}:${hue}`
    if (used.has(key)) continue
    used.add(key)
    items.push({ id: items.length, shape, hue })
  }
  return items
}
