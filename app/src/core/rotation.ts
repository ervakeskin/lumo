import type { Rng } from './rng'

// Spatial Speed: zihinsel rotasyon. Şekiller ızgara hücrelerinden oluşan poliominolar.
export type Cells = [number, number][]

const GRID = 5
const NB: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]

export function randomShape(k: number, rng: Rng): Cells {
  const set = new Set<string>(['2,2'])
  const cells: Cells = [[2, 2]]
  while (cells.length < k) {
    const [r, c] = rng.pick(cells)
    const [dr, dc] = rng.pick(NB)
    const nr = r + dr, nc = c + dc
    if (nr < 0 || nc < 0 || nr >= GRID || nc >= GRID || set.has(`${nr},${nc}`)) continue
    set.add(`${nr},${nc}`)
    cells.push([nr, nc])
  }
  return cells
}
export const rot90 = (c: Cells): Cells => c.map(([r, cc]) => [cc, -r])
export const mirror = (c: Cells): Cells => c.map(([r, cc]) => [r, -cc])
export const rotN = (c: Cells, n: number): Cells => {
  let out = c
  for (let i = 0; i < n; i++) out = rot90(out)
  return out
}
/** Ötelemeden bağımsız kanonik anahtar. */
export function key(c: Cells): string {
  const minR = Math.min(...c.map((p) => p[0])), minC = Math.min(...c.map((p) => p[1]))
  return c.map(([r, cc]) => `${r - minR},${cc - minC}`).sort().join(';')
}
export const sameUnderRotation = (a: Cells, b: Cells) => [0, 1, 2, 3].some((k) => key(rotN(a, k)) === key(b))
/** Aynalanınca döndürmeyle elde edilemeyen (kiral) şekil: aynalı versiyon gerçekten "farklı". */
export const isChiral = (c: Cells) => !sameUnderRotation(c, mirror(c))

export interface RotTrial { left: Cells; right: Cells; same: boolean; angle: number }
export function genRotTrial(k: number, rng: Rng): RotTrial {
  let base = randomShape(k, rng)
  for (let g = 0; !isChiral(base) && g < 200; g++) base = randomShape(k, rng)
  const angle = rng.int(1, 3)
  const same = rng.next() < 0.5
  const right = rotN(same ? base : mirror(base), angle)
  return { left: base, right, same, angle: angle * 90 }
}
/** Hücre sayısı: L1 5 · L2 6 · L3 7. */
export const rotCells = (level: number) => 4 + Math.min(3, Math.max(1, level))
export const rotLimitMs = (n: number, streak: number) => Math.max(2200, 7000 - n * 90 - streak * 40)
