import type { Rng } from './rng'

// Pinball Recall: deterministik 2B fizik. Tampon konumlarını hatırla, topun hangi yuvaya düşeceğini tahmin et.
export const W = 1
export const H = 1.25
export const BALL_R = 0.022
export interface Bumper { x: number; y: number; r: number }
export interface SimResult { slot: number; path: [number, number][] }

const G = 1.1
const DT = 1 / 240
const REST_WALL = 0.82
const REST_BUMPER = 0.9

export function simulate(bumpers: Bumper[], x0: number, vx0: number, slots: number): SimResult {
  let x = x0, y = BALL_R, vx = vx0, vy = 0
  const path: [number, number][] = [[x, y]]
  for (let i = 0; i < 240 * 30; i++) {
    vy += G * DT
    x += vx * DT
    y += vy * DT
    if (x < BALL_R) { x = BALL_R; vx = Math.abs(vx) * REST_WALL }
    if (x > W - BALL_R) { x = W - BALL_R; vx = -Math.abs(vx) * REST_WALL }
    for (const b of bumpers) {
      const dx = x - b.x, dy = y - b.y
      const dist = Math.hypot(dx, dy)
      const min = b.r + BALL_R
      if (dist < min && dist > 1e-9) {
        const nx = dx / dist, ny = dy / dist
        x = b.x + nx * min
        y = b.y + ny * min
        const vn = vx * nx + vy * ny
        if (vn < 0) { vx -= (1 + REST_BUMPER) * vn * nx; vy -= (1 + REST_BUMPER) * vn * ny }
      }
    }
    if (i % 6 === 0) path.push([x, y])
    if (y >= H) break
  }
  path.push([x, Math.min(y, H)])
  return { slot: Math.min(slots - 1, Math.max(0, Math.floor(x * slots))), path }
}

export const pinballSlots = (level: number) => (level <= 1 ? 3 : level === 2 ? 4 : 5)
export const pinballBumperCount = (round: number) => Math.min(6, 2 + Math.floor(round / 2))
export const pinballShowMs = (level: number) => (level <= 1 ? 4000 : level === 2 ? 3200 : 2600)

/** Tamponları birbirinden ≥0.2 uzakta, tabloda (y ∈ [0.3, 1.0]) rastgele yerleştir. */
export function genBumpers(n: number, rng: Rng): Bumper[] {
  const out: Bumper[] = []
  for (let g = 0; out.length < n && g < 400; g++) {
    const b = { x: 0.12 + rng.next() * 0.76, y: 0.3 + rng.next() * 0.7, r: 0.055 }
    if (out.every((o) => Math.hypot(o.x - b.x, o.y - b.y) >= 0.2)) out.push(b)
  }
  return out
}
