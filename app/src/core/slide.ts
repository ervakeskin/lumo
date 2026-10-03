import type { Rng } from './rng'

// Pirate Passage: kayan gemi (buz) bulmacası. Gemi bir yönde kayar, kayaya/duvara çarpana kadar durmaz.
export type Dir = 'left' | 'right' | 'up' | 'down'
export type Pos = [number, number]
export const DELTA: Record<Dir, Pos> = { left: [0, -1], right: [0, 1], up: [-1, 0], down: [1, 0] }
export interface Puzzle { size: number; rocks: boolean[][]; start: Pos; goal: Pos; optimal: number }

const inside = (n: number, [r, c]: Pos) => r >= 0 && c >= 0 && r < n && c < n

/** Kayarken geçilen hücreler (başlangıç hariç). */
export function slidePath(rocks: boolean[][], n: number, pos: Pos, dir: Dir): Pos[] {
  const [dr, dc] = DELTA[dir]
  const path: Pos[] = []
  let cur: Pos = pos
  for (;;) {
    const next: Pos = [cur[0] + dr, cur[1] + dc]
    if (!inside(n, next) || rocks[next[0]][next[1]]) break
    path.push(next)
    cur = next
  }
  return path
}
const same = (a: Pos, b: Pos) => a[0] === b[0] && a[1] === b[1]
export const passesGoal = (path: Pos[], goal: Pos) => path.some((p) => same(p, goal))

/** En az hamle (hazine kayarken geçilince alınır); çözümsüzse −1. */
export function solve(rocks: boolean[][], n: number, start: Pos, goal: Pos): number {
  const seen = new Set<string>([start.join(',')])
  let frontier: Pos[] = [start]
  for (let moves = 1; frontier.length; moves++) {
    const nextF: Pos[] = []
    for (const p of frontier)
      for (const d of Object.keys(DELTA) as Dir[]) {
        const path = slidePath(rocks, n, p, d)
        if (!path.length) continue
        if (passesGoal(path, goal)) return moves
        const stop = path[path.length - 1]
        const k = stop.join(',')
        if (!seen.has(k)) { seen.add(k); nextF.push(stop) }
      }
    frontier = nextF
  }
  return -1
}

const SPEC = (level: number) => ({ size: level <= 1 ? 5 : level === 2 ? 6 : 7, min: level <= 1 ? 2 : level === 2 ? 3 : 4, max: level <= 1 ? 4 : level === 2 ? 6 : 8, slack: level <= 1 ? 3 : level === 2 ? 2 : 1 })
export const moveLimit = (p: Puzzle, level: number) => p.optimal + SPEC(level).slack

export function genPuzzle(level: number, rng: Rng): Puzzle {
  const { size, min, max } = SPEC(level)
  let fallback: Puzzle | null = null
  for (let t = 0; t < 400; t++) {
    const rocks = Array.from({ length: size }, () => Array.from({ length: size }, () => rng.next() < 0.22))
    const free: Pos[] = []
    rocks.forEach((row, r) => row.forEach((x, c) => { if (!x) free.push([r, c]) }))
    if (free.length < 4) continue
    const start = rng.pick(free)
    const goal = rng.pick(free.filter((p) => !same(p, start)))
    const optimal = solve(rocks, size, start, goal)
    if (optimal < 1) continue
    const puz = { size, rocks, start, goal, optimal }
    if (optimal >= min && optimal <= max) return puz
    fallback = puz
  }
  return fallback ?? genPuzzle(level, rng)
}
