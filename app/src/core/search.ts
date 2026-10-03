import type { Rng } from './rng'

// Star Search: görsel arama. L1/L2 "pop-out" (tek özellik), L3 "conjunction" (özellik birleşimi).
export interface SItem { shape: number; color: number; rot: number }
export const SEARCH_SHAPES = 3
export const SEARCH_COLORS = 7
export const searchCount = (level: number) => (level <= 1 ? 12 : level === 2 ? 20 : 30)

export function genSearch(level: number, rng: Rng): { items: SItem[]; targetIndex: number } {
  const n = searchCount(level)
  const rot = () => rng.int(0, 3) * 15
  const cols = rng.shuffle(Array.from({ length: SEARCH_COLORS }, (_, i) => i))
  const items: SItem[] = []
  let target: SItem
  if (level <= 1) {
    // Renk farkı
    target = { shape: 0, color: cols[1], rot: 0 }
    for (let i = 0; i < n - 1; i++) items.push({ shape: 0, color: cols[0], rot: rot() })
  } else if (level === 2) {
    // Şekil farkı
    target = { shape: 1, color: cols[0], rot: 0 }
    for (let i = 0; i < n - 1; i++) items.push({ shape: 0, color: cols[0], rot: rot() })
  } else {
    // Birleşim: distraktörler (A,X) ve (B,Y); hedef (A,Y)
    target = { shape: 0, color: cols[1], rot: 0 }
    for (let i = 0; i < n - 1; i++) items.push(i % 2 === 0 ? { shape: 0, color: cols[0], rot: rot() } : { shape: 1, color: cols[1], rot: rot() })
  }
  const targetIndex = rng.int(0, n - 1)
  items.splice(targetIndex, 0, target)
  return { items, targetIndex }
}
