// Seed'li PRNG (mulberry32): aynı seed = aynı içerik → Duel ve testler için şart.
export type Rng = {
  next(): number
  int(lo: number, hi: number): number
  pick<T>(xs: readonly T[]): T
  shuffle<T>(xs: T[]): T[]
}
export function makeRng(seed: number): Rng {
  let s = seed >>> 0
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (xs) => xs[Math.floor(next() * xs.length)],
    shuffle: (xs) => {
      const a = [...xs]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    },
  }
}
export const newSeed = () => (Math.random() * 2 ** 32) >>> 0
