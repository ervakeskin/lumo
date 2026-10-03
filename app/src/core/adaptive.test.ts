import { describe, expect, it } from 'vitest'
import * as a from './adaptive'
import { genExpr } from './mathgen'
import * as f from './flanker'
import * as sp from './stroop'
import * as cp from './compare'
import { axisScore, buildFit, lpi, AXES } from './fit'
import { pickWorkout, workoutCount } from './workout'

describe('Fit Test puanlaması', () => {
  it('daha iyi performans daha yüksek skor; 0-100 aralığı', () => {
    const weak = axisScore('speed-match', { accuracy: 0.55, medianRt: 1700, level: 1 })
    const mid = axisScore('speed-match', { accuracy: 0.8, medianRt: 1000, level: 2 })
    const top = axisScore('speed-match', { accuracy: 1, medianRt: 400, level: 3 })
    expect(weak).toBeLessThan(mid)
    expect(mid).toBeLessThan(top)
    expect(top).toBe(100)
    expect(axisScore('speed-match', { accuracy: 0.3, medianRt: 9999, level: 0 })).toBe(0)
    // doğruluk 0.5 (şans) iken yüksek seviye bedava puan getirmez
    expect(axisScore('speed-match', { accuracy: 0.5, medianRt: 0, level: 3 })).toBe(0)
    expect(axisScore('bilinmeyen', { accuracy: 1, medianRt: 1, level: 1 })).toBe(0)
  })
  it('buildFit her eksen için bir oyun kullanır, LPI eksen ortalamasının 10 katı', () => {
    const p = { accuracy: 1, medianRt: 0, level: 0 }
    const fit = buildFit({ 'memory-matrix': { score: 1, ...p }, 'speed-match': { score: 1, ...p } }, 1)
    expect(Object.keys(fit.axes).sort()).toEqual([...AXES].sort())
    expect(lpi({ memory: 50, attention: 50, speed: 50, flexibility: 50, problem: 50 })).toBe(500)
  })
})
describe('Günlük antrenman seçimi', () => {
  const games = ['memory', 'attention', 'speed', 'flexibility', 'problem'].map((c) => ({ id: `g-${c}`, category: c }))
  it('zayıf ekseni ve ilgi alanını öne alır, sayıyı korur', () => {
    const axes = { memory: 90, attention: 90, speed: 90, flexibility: 20, problem: 90 }
    const w = pickWorkout({ games, interests: {}, axes, plays: [], count: 3 })
    expect(w).toHaveLength(3)
    expect(w[0].id).toBe('g-flexibility')
    expect(w[0].reason).toBe('weak')
    const w2 = pickWorkout({ games, interests: { memory: 1 }, axes: null, plays: [], count: 1 })
    expect(w2[0].id).toBe('g-memory')
  })
  it('yakın zamanda oynananı geriye atar ve dışlananı seçmez', () => {
    const now = Date.now()
    const plays = Array.from({ length: 3 }, () => ({ gameId: 'g-memory', at: now - 1000 }))
    const w = pickWorkout({ games, interests: {}, axes: null, plays, count: 5, excluded: ['g-speed'], now })
    expect(w.map((x) => x.id)).not.toContain('g-speed')
    expect(w[w.length - 1].id).toBe('g-memory')
  })
  it('süreden oyun sayısı', () => {
    expect([5, 10, 15].map(workoutCount)).toEqual([2, 3, 4])
  })
})

describe('Color Match (Stroop)', () => {
  const r = makeRng(21)
  it('isMatch bayrağı kurala göre gerçekten doğru', () => {
    for (const rule of ['meaning', 'ink'] as const)
      for (let i = 0; i < 400; i++) {
        const want = i % 2 === 0
        const t = sp.cmMakeTrial(rule, want, r)
        expect(sp.cmIsMatch(t)).toBe(want)
      }
  })
  it('çatışma çoğunlukla var (Stroop): kelime anlamı ≠ yazı rengi', () => {
    let conflict = 0
    for (let i = 0; i < 1000; i++) {
      const t = sp.cmMakeTrial('ink', true, r)
      if (t.bottom.word !== t.bottom.ink) conflict++
    }
    expect(conflict / 1000).toBeGreaterThan(0.75)
  })
  it('kural değişimi ve süre', () => {
    expect(sp.cmNextRule('ink', 5, 1, 0.9)).toBe('ink')
    expect(sp.cmNextRule('ink', 6, 1, 0.9)).toBe('meaning')
    expect(sp.cmNextRule('ink', 3, 2, 0.9)).toBe('meaning')
    expect(sp.cmLimitMs(0, 0)).toBe(3200)
    expect(sp.cmLimitMs(1000, 1000)).toBe(1100)
  })
})
describe('Chalkboard Challenge', () => {
  const r = makeRng(33)
  it('ifade metni hedef değere eşit', () => {
    for (const level of [1, 2, 3])
      for (let i = 0; i < 300; i++) {
        const v = r.int(6, 60)
        const e = cp.makeExpr(v, level, r)
        expect(cp.evalExpr(e.text)).toBe(e.value)
      }
  })
  it('doğru cevap gerçekten doğru; eşit oranı ~%20', () => {
    let eq = 0
    for (const level of [1, 2, 3])
      for (let i = 0; i < 500; i++) {
        const t = cp.makeCmpTrial(level, r)
        const l = cp.evalExpr(t.left.text), rr = cp.evalExpr(t.right.text)
        expect(t.answer).toBe(l === rr ? 'equal' : l > rr ? 'left' : 'right')
        if (t.answer === 'equal') eq++
      }
    expect(eq / 1500).toBeGreaterThan(0.14)
    expect(eq / 1500).toBeLessThan(0.26)
  })
})

describe('Flanker (Lost in Migration)', () => {
  const rng = makeRng(7)
  it('seviyeye göre yön sayısı ve sürü boyutu', () => {
    expect(f.limDirections(1)).toEqual(['left', 'right'])
    expect(f.limDirections(2)).toHaveLength(4)
    expect(f.limFormationSize(1)).toBe(5)
    expect(f.limFormationSize(3)).toBe(9)
  })
  it('congruent: hepsi lider ile aynı; incongruent: hiçbiri aynı değil; neutral: yönsüz', () => {
    for (const level of [1, 2, 3])
      for (const lead of f.limDirections(level)) {
        const n = f.limFormationSize(level) - 1
        const c = f.limFlankers(lead, 'congruent', level, rng)
        const i = f.limFlankers(lead, 'incongruent', level, rng)
        const z = f.limFlankers(lead, 'neutral', level, rng)
        expect(c).toHaveLength(n)
        expect(c.every((x) => x === lead)).toBe(true)
        expect(i.every((x) => x !== lead && x !== 'none')).toBe(true)
        expect(i.every((x) => f.limDirections(level).includes(x as f.Dir4))).toBe(true)
        expect(z.every((x) => x === 'none')).toBe(true)
      }
  })
  it('L1 de nötr deneme yok; L2 de yaklaşık %15', () => {
    const r = makeRng(3)
    let neutral1 = 0, neutral2 = 0
    for (let k = 0; k < 2000; k++) {
      if (f.limPickKind(1, 0.5, r.next()) === 'neutral') neutral1++
      if (f.limPickKind(2, 0.5, r.next()) === 'neutral') neutral2++
    }
    expect(neutral1).toBe(0)
    expect(neutral2 / 2000).toBeGreaterThan(0.11)
    expect(neutral2 / 2000).toBeLessThan(0.19)
  })
  it('incongruent oranı uygulanır', () => {
    const r = makeRng(9)
    let inc = 0, tot = 0
    for (let k = 0; k < 3000; k++) {
      const kd = f.limPickKind(1, 0.65, r.next())
      tot++
      if (kd === 'incongruent') inc++
    }
    expect(inc / tot).toBeGreaterThan(0.6)
    expect(inc / tot).toBeLessThan(0.7)
  })
  it('tema: art arda tekrar yok, tüm türler görülür; havuz seviyeyle büyür', () => {
    const r = makeRng(5)
    let prev: f.Theme | null = null
    const seen = new Set<f.Theme>()
    for (let k = 0; k < 200; k++) {
      const th = f.limPickTheme(prev, r)
      expect(th).not.toBe(prev)
      seen.add(th)
      prev = th
    }
    expect(seen.size).toBe(f.THEMES.length)
    expect(f.limThemePool(1).length).toBeLessThan(f.limThemePool(2).length)
    expect(f.limThemePool(3)).toEqual(f.THEMES)
  })
  it('karışık sürü: L1 hiç, L3 her zaman; L2 yaklaşık yarısı', () => {
    const r = makeRng(11)
    const mixed = (lvl: number) => {
      let m = 0
      for (let k = 0; k < 1000; k++) if (f.limFlankThemes('bird', lvl, 8, r).some((x) => x !== 'bird')) m++
      return m / 1000
    }
    expect(mixed(1)).toBe(0)
    expect(mixed(2)).toBeGreaterThan(0.4)
    expect(mixed(2)).toBeLessThan(0.6)
    expect(mixed(3)).toBeGreaterThan(0.95)
  })
})
import { makeRng } from './rng'

describe('Raindrops işlem üretimi', () => {
  const calc = (e: string) => {
    const [x, op, y] = e.split(' ')
    const A = Number(x), B = Number(y)
    return op === '+' ? A + B : op === '−' ? A - B : op === '×' ? A * B : A / B
  }
  it('her kademede cevap doğru, pozitif tam sayı', () => {
    const rng = makeRng(42)
    for (const tier of ['easy', 'mid', 'hard'] as const)
      for (let i = 0; i < 300; i++) {
        const { expr, ans } = genExpr(tier, rng)
        expect(calc(expr)).toBe(ans)
        expect(Number.isInteger(ans) && ans > 0).toBe(true)
      }
  })
  it('easy yalnızca tek basamaklı toplama/çıkarma', () => {
    const rng = makeRng(1)
    for (let i = 0; i < 200; i++) expect(genExpr('easy', rng).expr).toMatch(/^\d{1,2} [+−] \d$/)
  })
})

describe('Memory Matrix', () => {
  it('K kuralı: 0 hata +1, 1 hata sabit, 2+ hata -1 (min 3)', () => {
    expect(a.mmNextK(4, 0)).toBe(5)
    expect(a.mmNextK(4, 1)).toBe(4)
    expect(a.mmNextK(4, 2)).toBe(3)
    expect(a.mmNextK(3, 3)).toBe(3)
  })
  it('grid her 3 K artışında büyür, 7 ile sınırlı', () => {
    expect(a.mmGridSize(3)).toBe(3)
    expect(a.mmGridSize(5)).toBe(3)
    expect(a.mmGridSize(6)).toBe(4)
    expect(a.mmGridSize(99)).toBe(7)
  })
  it('flash süresi 600ms altına inmez', () => {
    expect(a.mmFlashMs(0)).toBe(1200)
    expect(a.mmFlashMs(1000)).toBe(600)
  })
})
describe('Lost in Migration', () => {
  it('trial süresi 700ms taban', () => {
    expect(a.limTrialMs(0)).toBe(2000)
    expect(a.limTrialMs(500)).toBe(700)
  })
  it('doğruluk >%90 ise incongruent %65', () => {
    expect(a.limIncongruentRatio(0.95)).toBe(0.65)
    expect(a.limIncongruentRatio(0.8)).toBe(0.5)
  })
  it('flanker etkisi', () => {
    expect(a.flankerEffect([500, 600], [700, 800])).toBe(200)
  })
})
describe('Speed Match', () => {
  it('süre cömert başlar, azalır, 650ms taban', () => {
    expect(a.smIntervalMs(0, 0)).toBe(2600)
    expect(a.smIntervalMs(10, 0)).toBeLessThan(a.smIntervalMs(0, 0))
    expect(a.smIntervalMs(10, 5)).toBeLessThan(a.smIntervalMs(10, 0))
    expect(a.smIntervalMs(1000, 1000)).toBe(650)
  })
  it('match oranı %35-45 bandında tutulur', () => {
    expect(a.smShouldMatch(1, 10, 0.99)).toBe(true)
    expect(a.smShouldMatch(8, 10, 0.0)).toBe(false)
  })
})
describe('Raindrops', () => {
  it('düşme süresi 3sn taban, damla sayısı kademeli', () => {
    expect(a.rdFallSec(0)).toBe(8)
    expect(a.rdFallSec(100)).toBe(3)
    expect(a.rdSimultaneous(1)).toBe(1)
    expect(a.rdSimultaneous(9)).toBe(2)
    expect(a.rdSimultaneous(20)).toBe(3)
    expect(a.rdTier(5)).toBe('easy')
    expect(a.rdTier(6)).toBe('mid')
    expect(a.rdTier(16)).toBe('hard')
  })
})

describe('Speed Match seviyeleri', () => {
  it('blok doğruluğuna göre seviye değişir', () => {
    expect(a.smNextLevel(1, 0.9)).toBe(2)
    expect(a.smNextLevel(3, 1)).toBe(3)
    expect(a.smNextLevel(2, 0.7)).toBe(2)
    expect(a.smNextLevel(2, 0.5)).toBe(1)
    expect(a.smNextLevel(1, 0.1)).toBe(1)
  })
  it('kural değişimi: L1 6, L2 3 denemede; L3 rastgele', () => {
    expect(a.smNextAsk('color', 5, 1, 0.9)).toBe('color')
    expect(a.smNextAsk('color', 6, 1, 0.9)).toBe('shape')
    expect(a.smNextAsk('shape', 3, 2, 0.9)).toBe('color')
    expect(a.smNextAsk('shape', 0, 3, 0.1)).toBe('color')
    expect(a.smNextAsk('shape', 0, 3, 0.9)).toBe('shape')
  })
  it('yakın çeldirici oranı L2 de L1 den yüksek', () => {
    expect(a.smNearMissRatio(2)).toBeGreaterThan(a.smNearMissRatio(1))
  })
})
