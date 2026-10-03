import type { Rng } from './rng'

// Splitting Seeds: yığını göz kararıyla iki eşit parçaya böl. Saf mantık.
export interface Seed { x: number; y: number }
export const seedCount = (round: number) => Math.min(70, 20 + round * 4)
/** İzin verilen sayı farkı (sol−sağ): L1 ≤4 · L2 ≤3 · L3 ≤2. */
export const seedTol = (level: number) => (level <= 1 ? 4 : level === 2 ? 3 : 2)

const gauss = (rng: Rng) => (rng.next() + rng.next() + rng.next() + rng.next() - 2) / 2 // ≈ N(0, ~0.33)

/** cluster: 2-3 yığın · scatter: düzgün dağılım. x değerleri benzersiz (bölme noktası belirsiz kalmasın). */
export function genSeeds(n: number, mode: 'cluster' | 'scatter', rng: Rng): Seed[] {
  const centers = mode === 'cluster' ? Array.from({ length: rng.int(2, 3) }, () => rng.next() * 0.7 + 0.15) : []
  const xs: number[] = []
  for (let i = 0; i < n; i++) {
    let x = mode === 'scatter' ? rng.next() : rng.pick(centers) + gauss(rng) * 0.22
    x = Math.min(0.96, Math.max(0.04, x))
    xs.push(x)
  }
  xs.sort((a, b) => a - b)
  for (let i = 1; i < xs.length; i++) if (xs[i] <= xs[i - 1]) xs[i] = xs[i - 1] + 1e-4
  return rng.shuffle(xs).map((x) => ({ x, y: 0.08 + rng.next() * 0.84 }))
}
export function splitDiff(seeds: Seed[], divider: number): number {
  const left = seeds.filter((s) => s.x < divider).length
  return Math.abs(left - (seeds.length - left))
}
export function idealDivider(seeds: Seed[]): number {
  const xs = seeds.map((s) => s.x).sort((a, b) => a - b)
  const m = Math.floor(xs.length / 2)
  return xs.length % 2 === 0 ? (xs[m - 1] + xs[m]) / 2 : xs[m] + 1e-5
}
