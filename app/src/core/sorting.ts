import type { Rng } from './rng'

// Disillusion: kural değişimi (Wisconsin kart ayıklama benzeri). Saf mantık.
export type SortRule = 'color' | 'shape' | 'count'
export interface SCard { color: number; shape: number; count: number }
export const sortRules = (level: number): SortRule[] => (level <= 1 ? ['color', 'shape'] : ['color', 'shape', 'count'])

/** 4 referans kart: her özellikte 4 farklı değer var, dolayısıyla her kuralda tam bir referans eşleşir. */
export function makeRefs(rng: Rng): SCard[] {
  const p = rng.shuffle([0, 1, 2, 3]), q = rng.shuffle([0, 1, 2, 3])
  return [0, 1, 2, 3].map((i) => ({ color: i, shape: p[i], count: q[i] + 1 }))
}
/** Uyaran: üç kuralın her biri FARKLI bir referansı işaret eder (belirsizlik yok). */
export function makeStimulus(refs: SCard[], rng: Rng): SCard {
  const [a, b, c] = rng.shuffle([0, 1, 2, 3])
  return { color: refs[a].color, shape: refs[b].shape, count: refs[c].count }
}
export const answerFor = (refs: SCard[], stim: SCard, rule: SortRule) => refs.findIndex((r) => r[rule] === stim[rule])

/** Kural değişimi: L1 her 5, L2 her 3 denemede; L3 her denemede rastgele. */
export function sortNextRule(cur: SortRule, since: number, level: number, rng: Rng): SortRule {
  const rules = sortRules(level)
  if (level >= 3) return rng.pick(rules)
  const every = level <= 1 ? 5 : 3
  if (since < every) return cur
  return rng.pick(rules.filter((r) => r !== cur))
}
