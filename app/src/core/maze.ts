import type { Rng } from './rng'

// Penguin Pursuit: prosedürel labirent (DFS) + rakip için en kısa yol. Saf mantık.
export type MDir = 'up' | 'down' | 'left' | 'right'
export type Cell = [number, number]
export interface Maze { w: number; h: number; open: Record<MDir, boolean>[][] }
const D: Record<MDir, Cell> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] }
const OPP: Record<MDir, MDir> = { up: 'down', down: 'up', left: 'right', right: 'left' }
export const MDIRS = Object.keys(D) as MDir[]

export function genMaze(w: number, h: number, rng: Rng): Maze {
  const open = Array.from({ length: h }, () => Array.from({ length: w }, () => ({ up: false, down: false, left: false, right: false })))
  const seen = Array.from({ length: h }, () => Array<boolean>(w).fill(false))
  const stack: Cell[] = [[0, 0]]
  seen[0][0] = true
  while (stack.length) {
    const [r, c] = stack[stack.length - 1]
    const nexts = rng.shuffle(MDIRS).filter((d) => {
      const nr = r + D[d][0], nc = c + D[d][1]
      return nr >= 0 && nc >= 0 && nr < h && nc < w && !seen[nr][nc]
    })
    if (!nexts.length) { stack.pop(); continue }
    const d = nexts[0]
    const nr = r + D[d][0], nc = c + D[d][1]
    open[r][c][d] = true
    open[nr][nc][OPP[d]] = true
    seen[nr][nc] = true
    stack.push([nr, nc])
  }
  return { w, h, open }
}
export const step = (m: Maze, [r, c]: Cell, d: MDir): Cell | null => (m.open[r][c][d] ? [r + D[d][0], c + D[d][1]] : null)

/** from'dan tüm hücrelere adım mesafesi ve ebeveyn (yol çıkarmak için). */
export function bfs(m: Maze, from: Cell) {
  const dist = Array.from({ length: m.h }, () => Array<number>(m.w).fill(-1))
  const parent: (Cell | null)[][] = Array.from({ length: m.h }, () => Array<Cell | null>(m.w).fill(null))
  dist[from[0]][from[1]] = 0
  const q: Cell[] = [from]
  for (let i = 0; i < q.length; i++) {
    const cur = q[i]
    for (const d of MDIRS) {
      const nx = step(m, cur, d)
      if (nx && dist[nx[0]][nx[1]] < 0) { dist[nx[0]][nx[1]] = dist[cur[0]][cur[1]] + 1; parent[nx[0]][nx[1]] = cur; q.push(nx) }
    }
  }
  return { dist, parent }
}
/** from → to en kısa yol (from hariç, to dahil). */
export function pathTo(m: Maze, from: Cell, to: Cell): Cell[] {
  const { parent } = bfs(m, from)
  const out: Cell[] = []
  let cur: Cell | null = to
  while (cur && !(cur[0] === from[0] && cur[1] === from[1])) { out.push(cur); cur = parent[cur[0]][cur[1]] }
  return out.reverse()
}
/** Adil balık konumu: oyuncu rakipten en fazla `slack` adım geride olsun, fakat kısa mesafe olmasın. */
export function pickFish(m: Maze, player: Cell, rival: Cell, rng: Rng, minDist: number, slack: number): Cell {
  const dp = bfs(m, player).dist, dr = bfs(m, rival).dist
  const cands: Cell[] = []
  for (let r = 0; r < m.h; r++) for (let c = 0; c < m.w; c++) if (dp[r][c] >= minDist && dp[r][c] <= dr[r][c] + slack) cands.push([r, c])
  return cands.length ? rng.pick(cands) : [Math.floor(m.h / 2), Math.floor(m.w / 2)]
}
export const mazeSize = (level: number) => (level <= 1 ? 7 : level === 2 ? 9 : 11)
export const rivalMs = (level: number, round: number) => Math.max(260, (level <= 1 ? 520 : level === 2 ? 440 : 380) - round * 8)
