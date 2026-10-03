import type { Rng } from './rng'
import type { RdTier } from './adaptive'

/** Kademeli işlem üretimi (rehber §8.4): easy tek basamak +/−, mid iki basamak +/− ve tek basamak ×, hard iki basamak ×/÷. */
export function genExpr(tier: RdTier, rng: Rng): { expr: string; ans: number } {
  const pick = (a: number, b: number) => rng.int(a, b)
  if (tier === 'easy') {
    if (rng.next() < 0.5) {
      const a = pick(1, 9), b = pick(1, 9)
      return { expr: `${a} + ${b}`, ans: a + b }
    }
    const a = pick(3, 12), b = pick(1, Math.min(9, a - 1))
    return { expr: `${a} − ${b}`, ans: a - b }
  }
  if (tier === 'mid') {
    const r = rng.next()
    if (r < 0.35) {
      const a = pick(11, 60), b = pick(2, 9)
      return { expr: `${a} + ${b}`, ans: a + b }
    }
    if (r < 0.6) {
      const a = pick(20, 80), b = pick(2, 19)
      return { expr: `${a} − ${b}`, ans: a - b }
    }
    const a = pick(2, 9), b = pick(2, 9)
    return { expr: `${a} × ${b}`, ans: a * b }
  }
  if (rng.next() < 0.6) {
    const a = pick(11, 25), b = pick(3, 9)
    return { expr: `${a} × ${b}`, ans: a * b }
  }
  const b = pick(3, 9), q = pick(6, 19)
  return { expr: `${b * q} ÷ ${b}`, ans: q }
}
