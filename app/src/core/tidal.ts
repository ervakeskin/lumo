import type { Rng } from './rng'

// Tidal Treasures: sürekli tanıma hafızası. Dalgalar tek tek hazine getirir; daha önce bulduysan "gördüm", yoksa "yeni".
// Saf mantık, unit test'li.
export interface TItem { id: number; shape: number; hue: number }
export const TIDAL_SHAPES = 12
export const TIDAL_OLD_RATE = 0.4
export const tidalKey = (it: Pick<TItem, 'shape' | 'hue'>) => `${it.shape}:${it.hue}`

/** L1: tamamen farklı hazineler · L2: yeni hazinelerin yarısı eskilere benzer (aynı şekil, renk farklı) · L3: çok benzer. */
export const tidalLevel = (n: number) => (n < 10 ? 1 : n < 24 ? 2 : 3)
/** Karar süresi: cömert başlar, taban 1800 ms. */
export const tidalLimitMs = (n: number) => Math.max(1800, 3600 - n * 45)
const lureChance = (level: number) => (level <= 1 ? 0 : level === 2 ? 0.5 : 0.75)
const lureStep = (level: number) => (level <= 2 ? 90 : 30)

/**
 * Sıradaki hazine. Eskiler (en az 2 hazine bulunduktan sonra) %40 olasılıkla gelir ve aynı nesnedir;
 * yeniler hiç görülmemiş şekil+renk çiftidir (seviye yükseldikçe eskilere "benzetilir" → tuzak).
 */
export function tidalNext(seen: TItem[], n: number, rng: Rng): { item: TItem; isOld: boolean } {
  if (seen.length >= 2 && rng.next() < TIDAL_OLD_RATE) return { item: rng.pick(seen), isOld: true }
  const level = tidalLevel(n)
  const used = new Set(seen.map(tidalKey))
  const fresh = (shape: number, hue: number): TItem | null => (used.has(tidalKey({ shape, hue })) ? null : { id: seen.length, shape, hue })
  let item: TItem | null = null
  if (seen.length > 0 && rng.next() < lureChance(level)) {
    const base = rng.pick(seen)
    const dir = rng.next() < 0.5 ? 1 : -1
    const step = lureStep(level)
    item = fresh(base.shape, (base.hue + dir * step + 360) % 360) ?? fresh(base.shape, (base.hue - dir * step + 360) % 360)
  }
  for (let guard = 0; !item && guard < 400; guard++) item = fresh(rng.int(0, TIDAL_SHAPES - 1), rng.int(0, 11) * 30)
  // Havuz tükendiyse (çok uzun oyun) eski bir nesne ver
  return item ? { item, isOld: false } : { item: rng.pick(seen), isOld: true }
}
