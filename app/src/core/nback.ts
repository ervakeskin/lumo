import type { Rng } from './rng'

// Memory Match: adaptif n-back. Saf mantık.
export const NB_SYMBOLS = 12
export const NB_MATCH_RATE = 0.3
export const NB_BLOCK = 12
export const NB_MAX_N = 3

/** Yeni uyaran: %30 olasılıkla n geri ile aynı (target), aksi halde farklı. */
export function nbNext(hist: number[], n: number, rng: Rng, rate = NB_MATCH_RATE): number {
  if (hist.length < n) return rng.int(0, NB_SYMBOLS - 1)
  const target = hist[hist.length - n]
  if (rng.next() < rate) return target
  let s: number
  do s = rng.int(0, NB_SYMBOLS - 1)
  while (s === target)
  return s
}
/** hist'in SON elemanı, n geri ile aynı mı? (n'den az geçmişte cevap beklenmez) */
export const nbIsMatch = (hist: number[], n: number) => hist.length > n && hist[hist.length - 1] === hist[hist.length - 1 - n]
/** Blok doğruluğuna göre n: ≥%85 → +1, <%60 → −1. */
export function nbNextN(n: number, acc: number): number {
  if (acc >= 0.85) return Math.min(NB_MAX_N, n + 1)
  if (acc < 0.6) return Math.max(1, n - 1)
  return n
}
