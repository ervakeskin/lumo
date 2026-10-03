import type { Rng } from './rng'

// Pattern Logic: 3x3 matris akıl yürütme (Raven tarzı). Saf mantık.
export interface MCell { shape: number; color: number; count: number }
export type Attr = 'shape' | 'color' | 'count'
/** L1: yalnızca şekil değişir · L2: şekil+renk · L3: şekil+renk+sayı. */
export const matrixAttrs = (level: number): Attr[] => (level <= 1 ? ['shape'] : level === 2 ? ['shape', 'color'] : ['shape', 'color', 'count'])

export interface MatrixPuzzle { grid: MCell[][]; options: MCell[]; answerIndex: number }
const cellKey = (c: MCell) => `${c.shape}/${c.color}/${c.count}`
export const cellsEqual = (a: MCell, b: MCell) => cellKey(a) === cellKey(b)

/** Her varyan özellik için (a, b): değer(i, j) = (base + a·i + b·j) mod 3. a,b ∈ {1,2} → her satır ve sütun 3 değeri de içerir. */
export function genMatrix(level: number, rng: Rng): MatrixPuzzle {
  const attrs = matrixAttrs(level)
  const coef: Record<Attr, [number, number, number]> = { shape: [0, 0, 0], color: [rng.int(0, 2), 0, 0], count: [rng.int(0, 2), 0, 0] }
  const combos: [number, number][] = rng.shuffle([[1, 1], [1, 2], [2, 1], [2, 2]] as [number, number][])
  attrs.forEach((a, k) => { coef[a] = [rng.int(0, 2), combos[k][0], combos[k][1]] })
  const constants: Record<Attr, number> = { shape: rng.int(0, 2), color: rng.int(0, 2), count: rng.int(0, 2) }
  const val = (a: Attr, i: number, j: number) => (attrs.includes(a) ? (coef[a][0] + coef[a][1] * i + coef[a][2] * j) % 3 : constants[a])
  const cell = (i: number, j: number): MCell => ({ shape: val('shape', i, j), color: val('color', i, j), count: val('count', i, j) + 1 })
  const grid = [0, 1, 2].map((i) => [0, 1, 2].map((j) => cell(i, j)))
  const answer = grid[2][2]
  // Çeldirici: doğru cevabın tek özelliğini değiştir (değişebilen tüm özellikler + sabit olanlar dahil)
  const pool: MCell[] = []
  for (const a of ['shape', 'color', 'count'] as Attr[])
    for (const d of [1, 2]) {
      const c = { ...answer }
      c[a] = a === 'count' ? ((c.count - 1 + d) % 3) + 1 : (c[a] + d) % 3
      pool.push(c)
    }
  const distractors = rng.shuffle(pool).filter((c, i, arr) => arr.findIndex((x) => cellsEqual(x, c)) === i).slice(0, 3)
  const options = rng.shuffle([answer, ...distractors])
  return { grid, options, answerIndex: options.findIndex((c) => cellsEqual(c, answer)) }
}
