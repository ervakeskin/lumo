import type { Axis } from './store'

// Günlük antrenman seçimi: ilgi + zayıf yön + yenilik. Saf fonksiyon, unit test'li.
export interface Cand { id: string; category: string }
export interface WorkoutPick { id: string; reason: 'interest' | 'weak' | 'fresh' }
const DAY = 86_400_000

/** Oyun kategorisi → Fit Test ekseni (matematik problem çözmeye, dil ölçülmez). */
export const axisOf = (category: string): Axis | null =>
  category === 'math' ? 'problem' : ['memory', 'attention', 'speed', 'flexibility', 'problem'].includes(category) ? (category as Axis) : null

export function pickWorkout(opts: {
  games: Cand[]
  interests: Record<string, number | undefined>
  axes?: Record<Axis, number> | null
  plays: { gameId: string; at: number }[]
  excluded?: string[]
  count: number
  now?: number
}): WorkoutPick[] {
  const now = opts.now ?? Date.now()
  const scored = opts.games
    .filter((g) => !(opts.excluded ?? []).includes(g.id))
    .map((g) => {
      const interest = opts.interests[g.category] ?? 0.4
      const ax = axisOf(g.category)
      const weak = opts.axes && ax ? 1 - opts.axes[ax] / 100 : 0.5
      const recent = opts.plays.filter((p) => p.gameId === g.id && now - p.at < 3 * DAY).length
      const fresh = 1 - Math.min(1, recent / 3)
      const total = 0.4 * interest + 0.4 * weak + 0.2 * fresh
      const neverPlayed = opts.plays.every((p) => p.gameId !== g.id)
      // Etiket önceliği: belirgin zayıf yön → yüksek ilgi → hiç oynanmamış → varsayılan ilgi
      const reason: WorkoutPick['reason'] = opts.axes && weak >= 0.5 && weak >= interest ? 'weak' : interest >= 0.7 ? 'interest' : neverPlayed ? 'fresh' : 'interest'
      return { id: g.id, total, reason }
    })
  scored.sort((a, b) => b.total - a.total || a.id.localeCompare(b.id))
  return scored.slice(0, opts.count).map(({ id, reason }) => ({ id, reason }))
}

/** Süre tercihinden oyun sayısı (dk → adet). */
export const workoutCount = (minutes: number) => (minutes <= 5 ? 2 : minutes <= 10 ? 3 : 4)
