import { clamp, mean } from './adaptive'
import type { Axis, FitResult } from './store'

// Fit Test puanlaması. ÖNEMLİ: bu demo bir kalibrasyondur; normlanmış/klinik bir ölçüm değildir.
export const AXES: Axis[] = ['memory', 'attention', 'speed', 'flexibility', 'problem']
/** Sadece geliştirme modunda ?fitsec=8 ile kısaltılabilir (test için); üretimde her zaman 75 sn. */
export const FIT_SECONDS = (import.meta.env.DEV && Number(new URLSearchParams(globalThis.location?.search ?? '').get('fitsec'))) || 75
/** Her beceri ekseni tam olarak bir oyunla ölçülür. */
export const FIT_GAMES: { gameId: string; axis: Axis }[] = [
  { gameId: 'memory-matrix', axis: 'memory' },
  { gameId: 'lost-in-migration', axis: 'attention' },
  { gameId: 'speed-match', axis: 'speed' },
  { gameId: 'color-match', axis: 'flexibility' },
  { gameId: 'chalkboard-challenge', axis: 'problem' },
]

interface Spec { rtLo: number; rtHi: number; lvLo: number; lvHi: number }
const SPEC: Record<string, Spec> = {
  'memory-matrix': { rtLo: 300, rtHi: 1500, lvLo: 3, lvHi: 9 },
  'lost-in-migration': { rtLo: 350, rtHi: 1400, lvLo: 1, lvHi: 3 },
  'speed-match': { rtLo: 400, rtHi: 1800, lvLo: 1, lvHi: 3 },
  'color-match': { rtLo: 600, rtHi: 2200, lvLo: 1, lvHi: 3 },
  'chalkboard-challenge': { rtLo: 1200, rtHi: 5000, lvLo: 1, lvHi: 3 },
}

export interface Perf { accuracy: number; medianRt: number; level: number }

/** 0-100: %45 doğruluk (yarı-şans tabanı çıkarılmış) + %35 hız + %20 ulaşılan seviye (doğrulukla çarpılır). */
export function axisScore(gameId: string, p: Perf): number {
  const s = SPEC[gameId]
  if (!s) return 0
  const acc = clamp((p.accuracy - 0.5) / 0.5, 0, 1)
  const speed = p.medianRt > 0 ? clamp((s.rtHi - p.medianRt) / (s.rtHi - s.rtLo), 0, 1) : 0
  const lvl = clamp((p.level - s.lvLo) / (s.lvHi - s.lvLo), 0, 1)
  // Seviye puanı doğrulukla ağırlıklanır: yanlış cevapla ulaşılan/miras seviye puan getirmez
  return Math.round(100 * (0.45 * acc + 0.35 * speed + 0.2 * lvl * acc))
}
/** Lumo Endeksi 0-1000: eksen ortalamasının 10 katı. */
export const lpi = (axes: Record<Axis, number>) => Math.round(mean(AXES.map((a) => axes[a])) * 10)

export function buildFit(perGame: FitResult['perGame'], at = Date.now()): FitResult {
  const axes = {} as Record<Axis, number>
  for (const { gameId, axis } of FIT_GAMES) axes[axis] = perGame[gameId] ? axisScore(gameId, perGame[gameId]) : 0
  return { at, axes, lpi: lpi(axes), perGame }
}
export const strongest = (axes: Record<Axis, number>) => [...AXES].sort((a, b) => axes[b] - axes[a])[0]
export const weakest = (axes: Record<Axis, number>) => [...AXES].sort((a, b) => axes[a] - axes[b])[0]
/** Son Fit Test'ten bu yana geçen gün. */
export const daysSince = (at: number, now = Date.now()) => Math.floor((now - at) / 86_400_000)
export const RETEST_DAYS = 30
