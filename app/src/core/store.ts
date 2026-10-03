import { useCallback } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryId } from '../games/registry'

export type Axis = 'memory' | 'attention' | 'speed' | 'flexibility' | 'problem'

export interface PlayRecord {
  gameId: string
  at: number
  score: number
  accuracy: number
  medianRt: number
  level: number
}
export interface FitResult {
  at: number
  axes: Record<Axis, number>
  lpi: number
  perGame: Record<string, { score: number; accuracy: number; medianRt: number; level: number }>
}
export interface Profile {
  done: boolean
  /** kategori başına 0-1 ilgi ağırlığı */
  interests: Partial<Record<CategoryId, number>>
  minutes: number
  timeOfDay: 'morning' | 'noon' | 'evening' | null
}

interface Store {
  lang: 'tr' | 'en'
  muted: boolean
  plays: PlayRecord[]
  best: Record<string, number>
  lastLevel: Record<string, number>
  profile: Profile
  fits: FitResult[]
  /** günlük antrenmanda "değiştir" ile dışlanan oyunlar: { 'Tue Sep 30 2026': ['speed-match'] } */
  swaps: Record<string, string[]>
  setLang: (l: 'tr' | 'en') => void
  setMuted: (m: boolean) => void
  setProfile: (p: Profile) => void
  addFit: (f: FitResult) => void
  swapOut: (day: string, gameId: string) => void
  addPlay: (p: PlayRecord) => { prevBest: number; isNewBest: boolean }
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      lang: 'tr',
      muted: false,
      plays: [],
      best: {},
      lastLevel: {},
      profile: { done: false, interests: {}, minutes: 10, timeOfDay: null },
      fits: [],
      swaps: {},
      setLang: (lang) => set({ lang }),
      setMuted: (muted) => set({ muted }),
      setProfile: (profile) => set({ profile }),
      addFit: (f) => set((s) => ({ fits: [...s.fits, f].slice(-20) })),
      swapOut: (day, gameId) => set((s) => ({ swaps: { [day]: [...(s.swaps[day] ?? []), gameId] } })),
      addPlay: (p) => {
        const prevBest = get().best[p.gameId] ?? 0
        const isNewBest = p.score > prevBest
        set((s) => ({
          plays: [...s.plays, p].slice(-500),
          best: isNewBest ? { ...s.best, [p.gameId]: p.score } : s.best,
          lastLevel: { ...s.lastLevel, [p.gameId]: p.level },
        }))
        return { prevBest, isNewBest }
      },
    }),
    { name: 'lumo_v4_state', version: 4 },
  ),
)

/** Kararlı (lang değişmedikçe aynı referans) çeviri fonksiyonu: effect bağımlılıklarında güvenle kullanılır. */
export const useT = () => {
  const lang = useStore((s) => s.lang)
  return useCallback(<T extends { tr: string; en: string }>(x: T) => x[lang], [lang])
}
export const useLang = () => useStore((s) => s.lang)
