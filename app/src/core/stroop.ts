import type { Rng } from './rng'

// Color Match: Stroop + kural değişimi. Saf mantık, unit test'li.
export const INKS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'] as const
export type Ink = (typeof INKS)[number]
export const INK_HEX: Record<Ink, string> = { red: '#FF6B6B', blue: '#4C9AFF', green: '#2FD08F', yellow: '#FFC145', purple: '#B79BFF', orange: '#FF8A3D', pink: '#FF8FC7' }
export const INK_NAME: Record<Ink, { tr: string; en: string }> = {
  red: { tr: 'KIRMIZI', en: 'RED' }, blue: { tr: 'MAVİ', en: 'BLUE' }, green: { tr: 'YEŞİL', en: 'GREEN' },
  yellow: { tr: 'SARI', en: 'YELLOW' }, purple: { tr: 'MOR', en: 'PURPLE' },
  orange: { tr: 'TURUNCU', en: 'ORANGE' }, pink: { tr: 'PEMBE', en: 'PINK' },
}
/** meaning: üstteki KELİMENİN anlamı = alttaki YAZI RENGİ mi? · ink: iki yazının RENGİ aynı mı? */
export type Rule = 'meaning' | 'ink'
export interface Word { word: Ink; ink: Ink }
export interface ColorTrial { top: Word; bottom: Word; rule: Rule; isMatch: boolean }

const other = (xs: readonly Ink[], not: Ink, rng: Rng) => rng.pick(xs.filter((x) => x !== not))

/** Kural değişimi: L1 her 6, L2 her 3 denemede; L3 her denemede rastgele. */
export function cmNextRule(current: Rule, sinceSwitch: number, level: number, roll: number): Rule {
  if (level >= 3) return roll < 0.5 ? 'meaning' : 'ink'
  const every = level <= 1 ? 6 : 3
  return sinceSwitch >= every ? (current === 'meaning' ? 'ink' : 'meaning') : current
}
/** Karar süresi: cömert başlar, kart sayısı ve seriyle azalır. Taban 1100 ms. */
export const cmLimitMs = (trialIndex: number, streak: number) => Math.max(1100, 3200 - trialIndex * 40 - streak * 20)

/** Stroop çatışması: kelimenin yazıldığı renk kendi anlamından çoğunlukla FARKLI. */
export function cmMakeTrial(rule: Rule, isMatch: boolean, rng: Rng): ColorTrial {
  const conflict = () => rng.next() < 0.85
  const mk = (ink: Ink): Word => ({ ink, word: conflict() ? other(INKS, ink, rng) : ink })
  if (rule === 'meaning') {
    const topWord = rng.pick(INKS)
    const bottomInk = isMatch ? topWord : other(INKS, topWord, rng)
    const topInk = conflict() ? other(INKS, topWord, rng) : topWord
    return { top: { word: topWord, ink: topInk }, bottom: mk(bottomInk), rule, isMatch }
  }
  const topInk = rng.pick(INKS)
  const bottomInk = isMatch ? topInk : other(INKS, topInk, rng)
  return { top: mk(topInk), bottom: mk(bottomInk), rule, isMatch }
}
export const cmIsMatch = (t: Pick<ColorTrial, 'top' | 'bottom' | 'rule'>) =>
  t.rule === 'meaning' ? t.top.word === t.bottom.ink : t.top.ink === t.bottom.ink
