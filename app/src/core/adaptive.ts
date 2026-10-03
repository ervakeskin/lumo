// Saf adaptif zorluk fonksiyonları (rehber §8.4). UI'dan bağımsız, unit test'li.

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// ---- Memory Matrix ----
export const MM_MIN_K = 3
export const MM_MAX_GRID = 7

/** Round sonucuna göre yeni K (parlayan kare sayısı). */
export function mmNextK(k: number, errors: number): number {
  if (errors === 0) return k + 1
  if (errors === 1) return k
  return Math.max(MM_MIN_K, k - 1)
}
/** Her 3 K artışında grid +1 (3x3 → 7x7). */
export function mmGridSize(k: number): number {
  return clamp(3 + Math.floor((k - MM_MIN_K) / 3), 3, MM_MAX_GRID)
}
export const mmFlashMs = (round: number) => Math.max(600, 1200 - round * 15)

// ---- Lost in Migration ----
export const limTrialMs = (streak: number) => Math.max(700, 2000 - streak * 40)
/** Doğruluk %90 üstündeyse incongruent oranı %65'e çıkar. */
export const limIncongruentRatio = (recentAccuracy: number) => (recentAccuracy > 0.9 ? 0.65 : 0.5)

// ---- Speed Match ----
/** Karar süresi: cömert başlar (2,6 sn), oynadıkça kart sayısına göre azalır; seri yapan oyuncuda ek hızlanma. Taban 650 ms. */
export const smIntervalMs = (trialIndex: number, streak: number) => Math.max(650, 2600 - trialIndex * 35 - streak * 15)
export const SM_MATCH_RATIO_RANGE: [number, number] = [0.35, 0.45]
/** Match oranını %35-45 bandında tutmak için bir sonraki denemenin match olup olmayacağı. */
export function smShouldMatch(matchesSoFar: number, trialsSoFar: number, roll: number): boolean {
  if (trialsSoFar < 4) return roll < 0.4
  const ratio = matchesSoFar / trialsSoFar
  if (ratio < SM_MATCH_RATIO_RANGE[0]) return true
  if (ratio > SM_MATCH_RATIO_RANGE[1]) return false
  return roll < 0.4
}

// ---- Raindrops ----
export const rdFallSec = (round: number) => Math.max(3, 8 - round * 0.2)
export const rdSimultaneous = (round: number) => (round >= 20 ? 3 : round >= 9 ? 2 : 1)
export type RdTier = 'easy' | 'mid' | 'hard'
export const rdTier = (round: number): RdTier => (round <= 5 ? 'easy' : round <= 15 ? 'mid' : 'hard')

// ---- Metrikler ----
export const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
export function median(xs: number[]) {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
/** Flanker etkisi = ortalama incongruent RT − ortalama congruent RT (ms). */
export const flankerEffect = (congruentRts: number[], incongruentRts: number[]) =>
  Math.round(mean(incongruentRts) - mean(congruentRts))

// ---- Speed Match: seviye sistemi ----
// Her denemede bir kural sorulur: "RENK mi aynı?" ya da "ŞEKİL mi aynı?" (görev değiştirme).
// L1: kural her 6 denemede bir değişir · L2: her 3 denemede · L3: her denemede rastgele.
export const SM_MAX_LEVEL = 3
export const SM_BLOCK = 10
export type SmDim = 'color' | 'shape'
export const smSwitchEvery = (level: number) => (level <= 1 ? 6 : level === 2 ? 3 : 1)
/** Yakın çeldirici: sorulmayan özellik önceki kartla aynı kalır (yanıltıcı benzerlik). */
export const smNearMissRatio = (level: number) => (level === 1 ? 0.3 : 0.65)
/** Kural değişen denemede karar için ek süre (ms). */
export const SM_SWITCH_GRACE_MS = 300
/** 10 denemelik blok sonunda seviye: ≥%85 yüksel, <%60 düş. */
export function smNextLevel(level: number, blockAccuracy: number): number {
  if (blockAccuracy >= 0.85) return Math.min(SM_MAX_LEVEL, level + 1)
  if (blockAccuracy < 0.6) return Math.max(1, level - 1)
  return level
}
/** Sıradaki denemenin kuralı. sinceSwitch: mevcut kuralla oynanan deneme sayısı. */
export function smNextAsk(current: SmDim, sinceSwitch: number, level: number, roll: number): SmDim {
  if (level >= 3) return roll < 0.5 ? 'color' : 'shape'
  if (sinceSwitch >= smSwitchEvery(level)) return current === 'color' ? 'shape' : 'color'
  return current
}
