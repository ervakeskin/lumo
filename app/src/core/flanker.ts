import type { Rng } from './rng'

// Lost in Migration: flanker görevi. Saf mantık — UI'dan bağımsız, unit test'li.
export type Dir4 = 'left' | 'right' | 'up' | 'down'
export type FlankKind = 'congruent' | 'incongruent' | 'neutral'
export type Theme = 'bird' | 'fish' | 'plane' | 'butterfly' | 'whale' | 'bee' | 'rocket' | 'turtle'
/** Bir flanker hücresi: yön ya da yönsüz (nötr) nesne. */
export type Cell = Dir4 | 'none'

export const THEMES: Theme[] = ['bird', 'fish', 'plane', 'butterfly', 'whale', 'bee', 'rocket', 'turtle']
/** Seviye arttıkça tür havuzu büyür: L1 4 · L2 6 · L3 hepsi. */
export const limThemePool = (level: number): Theme[] => THEMES.slice(0, level <= 1 ? 4 : level === 2 ? 6 : THEMES.length)
export const LIM_MAX_LEVEL = 3

/** L1: iki yön · L2/L3: dört yön. */
export const limDirections = (level: number): Dir4[] => (level <= 1 ? ['left', 'right'] : ['left', 'right', 'up', 'down'])
/** L1: artı biçimli 5'li sürü · L2/L3: 3x3'lük 9'lu sürü. Merkez = lider. */
export const limFormationSize = (level: number) => (level <= 1 ? 5 : 9)
/** Nötr (yönsüz) deneme oranı: taban çizgisi için L2+ ta devrede. */
export const limNeutralRatio = (level: number) => (level <= 1 ? 0 : 0.15)
/** L3: lider parlamaz, sadece hafif renk farkı taşır ve süre %15 kısalır. */
export const limLeaderGlow = (level: number) => level < 3
export const limTimeScale = (level: number) => (level >= 3 ? 0.85 : 1)
/** Lider teması her denemede rastgele; art arda aynı tema gelmez (görsel çeşitlilik). */
export function limPickTheme(prev: Theme | null, rng: Rng, level = LIM_MAX_LEVEL): Theme {
  const all = limThemePool(level)
  const pool = prev ? all.filter((t) => t !== prev) : all
  return rng.pick(pool)
}
/** Karışık sürü ihtimali: L1 yok · L2 %50 · L3 her deneme. */
export const limMixedChance = (level: number) => (level <= 1 ? 0 : level === 2 ? 0.5 : 1)
/**
 * Flanker temaları. Karışık değilse hepsi liderle aynı tür; karışıkta her çeldirici bağımsız
 * rastgele tür (lider türü dahil) — tür farkı, yön çeldiricisinin üstüne ek algısal parazit.
 */
export function limFlankThemes(lead: Theme, level: number, n: number, rng: Rng): Theme[] {
  if (rng.next() >= limMixedChance(level)) return Array<Theme>(n).fill(lead)
  return Array.from({ length: n }, () => rng.pick(limThemePool(level)))
}

export const OPPOSITE: Record<Dir4, Dir4> = { left: 'right', right: 'left', up: 'down', down: 'up' }

export const limPickKind = (level: number, incongruentRatio: number, roll: number): FlankKind => {
  const neutral = limNeutralRatio(level)
  if (roll < neutral) return 'neutral'
  // kalan aralığı incongruent oranına göre böl
  const r = (roll - neutral) / (1 - neutral)
  return r < incongruentRatio ? 'incongruent' : 'congruent'
}

/**
 * Lider dışındaki hücreler. Uyumsuzda her çeldirici lidere göre FARKLI bir yön alır
 * (L1'de tek seçenek zıt yön; L2+ta 3 seçenekten rastgele).
 */
export function limFlankers(lead: Dir4, kind: FlankKind, level: number, rng: Rng): Cell[] {
  const n = limFormationSize(level) - 1
  if (kind === 'neutral') return Array<Cell>(n).fill('none')
  if (kind === 'congruent') return Array<Cell>(n).fill(lead)
  const others = limDirections(level).filter((d) => d !== lead)
  return Array.from({ length: n }, () => rng.pick(others))
}
