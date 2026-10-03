import type { Rng } from './rng'

// Chalkboard Challenge: iki ifadeyi karşılaştır. Saf mantık, unit test'li.
export type Cmp = 'left' | 'equal' | 'right'
export interface Expr { text: string; value: number }
export interface CmpTrial { left: Expr; right: Expr; answer: Cmp }

/** Hedef değere ulaşan, seviyeye uygun bir ifade üretir. L1 tek basamak +/−, L2 iki basamak/çarpma, L3 üç terimli. */
export function makeExpr(value: number, level: number, rng: Rng): Expr {
  const v = Math.max(2, value)
  if (level >= 3) {
    // a × b ± c
    for (let i = 0; i < 12; i++) {
      const a = rng.int(2, 9), b = rng.int(2, 9)
      const c = a * b - v
      if (c > 0 && c <= 30) return { text: `${a} × ${b} − ${c}`, value: v }
      if (c < 0 && -c <= 30) return { text: `${a} × ${b} + ${-c}`, value: v }
    }
  }
  if (level === 2) {
    for (let i = 0; i < 10; i++) {
      const a = rng.int(2, 9)
      if (v % a === 0 && v / a >= 2 && v / a <= 12) return { text: `${a} × ${v / a}`, value: v }
    }
    const a = rng.int(Math.max(2, Math.floor(v / 2)), Math.max(3, v - 1))
    return { text: `${a} + ${v - a}`, value: v }
  }
  if (rng.next() < 0.5) {
    const a = rng.int(1, v - 1)
    return { text: `${a} + ${v - a}`, value: v }
  }
  const b = rng.int(1, 9)
  return { text: `${v + b} − ${b}`, value: v }
}

const baseRange = (level: number): [number, number] => (level <= 1 ? [6, 18] : level === 2 ? [16, 60] : [20, 80])
/** Fark: L1 1-5 · L2 1-3 · L3 1-2. %20 denemede eşit. */
export const cmpMaxDelta = (level: number) => (level <= 1 ? 5 : level === 2 ? 3 : 2)
export const chalkLimitMs = (trialIndex: number, streak: number) => Math.max(1800, 6000 - trialIndex * 70 - streak * 40)

export function makeCmpTrial(level: number, rng: Rng): CmpTrial {
  const [lo, hi] = baseRange(level)
  const base = rng.int(lo, hi)
  const equal = rng.next() < 0.2
  const delta = equal ? 0 : rng.int(1, cmpMaxDelta(level))
  const otherVal = base + (rng.next() < 0.5 ? delta : -delta)
  const a = makeExpr(base, level, rng)
  const b = makeExpr(Math.max(2, otherVal), level, rng)
  const answer: Cmp = a.value === b.value ? 'equal' : a.value > b.value ? 'left' : 'right'
  return rng.next() < 0.5 ? { left: a, right: b, answer } : { left: b, right: a, answer: answer === 'left' ? 'right' : answer === 'right' ? 'left' : 'equal' }
}

/** Test yardımcısı: "a op b (op c)" metnini hesaplar. */
export function evalExpr(text: string): number {
  const norm = text.replace(/×/g, '*').replace(/−/g, '-')
  // yalnızca rakam ve + - * boşluk kabul et
  if (!/^[\d+\-* ]+$/.test(norm)) return NaN
  return Function(`"use strict"; return (${norm})`)() as number
}
