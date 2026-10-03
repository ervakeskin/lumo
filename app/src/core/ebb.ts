import type { Rng } from './rng'
import type { Dir4 } from './flanker'

// Ebb and Flow: görev geçişi. Yeşil yaprak → BAKTIĞI yön, turuncu yaprak → HAREKET yönü.
export type Leaf = 'green' | 'orange'
export interface EbbTrial { color: Leaf; face: Dir4; move: Dir4; answer: Dir4; congruent: boolean }
export const ebbDirs = (level: number): Dir4[] => (level <= 1 ? ['left', 'right'] : ['left', 'right', 'up', 'down'])
/** Uyumsuz (bakış ≠ hareket) deneme oranı: L1 %50 · L2 %70 · L3 %85 */
export const ebbConflict = (level: number) => (level <= 1 ? 0.5 : level === 2 ? 0.7 : 0.85)
export const ebbLimitMs = (n: number, streak: number) => Math.max(1200, 3000 - n * 30 - streak * 20)

export function genEbb(level: number, rng: Rng): EbbTrial {
  const dirs = ebbDirs(level)
  const color: Leaf = rng.next() < 0.5 ? 'green' : 'orange'
  const face = rng.pick(dirs)
  const conflict = rng.next() < ebbConflict(level)
  const move = conflict ? rng.pick(dirs.filter((d) => d !== face)) : face
  return { color, face, move, answer: color === 'green' ? face : move, congruent: !conflict }
}
