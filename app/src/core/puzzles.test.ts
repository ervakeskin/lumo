import { describe, expect, it } from 'vitest'
import { makeRng } from './rng'
import * as nb from './nback'
import * as td from './tidal'
import * as fc from './faces'
import * as sd from './seeds'
import * as sr from './search'
import * as ro from './rotation'
import * as so from './sorting'
import * as eb from './ebb'
import * as sl from './slide'
import * as mx from './matrix'
import * as mz from './maze'
import * as wd from './words'
import * as rl from './rails'
import * as pb from './pinball'

describe('n-back', () => {
  it('üretilen uyaran nbIsMatch ile tutarlı, oran ~%30', () => {
    for (const n of [1, 2, 3]) {
      const r = makeRng(n)
      const hist: number[] = []
      let matches = 0, trials = 0
      for (let i = 0; i < 1500; i++) {
        hist.push(nb.nbNext(hist, n, r))
        if (hist.length > n) { trials++; if (nb.nbIsMatch(hist, n)) matches++ }
      }
      expect(matches / trials).toBeGreaterThan(0.25)
      expect(matches / trials).toBeLessThan(0.36)
    }
  })
  it('n seviyeleri', () => {
    expect(nb.nbNextN(1, 0.9)).toBe(2)
    expect(nb.nbNextN(3, 1)).toBe(3)
    expect(nb.nbNextN(2, 0.5)).toBe(1)
    expect(nb.nbNextN(2, 0.7)).toBe(2)
  })
})
describe('Tidal Treasures', () => {
  it('eskiler görülmüştür, yeniler görülmemiştir; oran ~%40', () => {
    const r = makeRng(1)
    const seen: td.TItem[] = []
    let old = 0, total = 0
    for (let n = 0; n < 100; n++) { // gerçekçi oyun uzunluğu (havuz 144 çift)
      const { item, isOld } = td.tidalNext(seen, n, r)
      const known = seen.some((x) => td.tidalKey(x) === td.tidalKey(item))
      expect(known).toBe(isOld)
      if (seen.length >= 2) { total++; if (isOld) old++ }
      if (!isOld) seen.push(item)
    }
    expect(old / total).toBeGreaterThan(0.3)
    expect(old / total).toBeLessThan(0.5)
  })
  it('L3: yeniler çoğunlukla eski bir hazineye benzer (aynı şekil)', () => {
    const r = makeRng(7)
    let lure = 0, fresh = 0
    for (let k = 0; k < 400; k++) {
      const seen = [{ id: 0, shape: 3, hue: 0 }, { id: 1, shape: 5, hue: 120 }]
      const { item, isOld } = td.tidalNext(seen, 40, r)
      if (isOld) continue
      fresh++
      if (seen.some((x) => x.shape === item.shape)) lure++
    }
    expect(lure / fresh).toBeGreaterThan(0.6)
  })
  it('seviye ve süre', () => {
    expect(td.tidalLevel(0)).toBe(1)
    expect(td.tidalLevel(30)).toBe(3)
    expect(td.tidalLimitMs(1000)).toBe(1800)
  })
})
describe('Familiar Faces', () => {
  it('müşteriler ve sorular tutarlı', () => {
    const r = makeRng(2)
    for (let k = 2; k <= 6; k++)
      for (let t = 0; t < 40; t++) {
        const cs = fc.makeCustomers(k, r)
        expect(new Set(cs.map((c) => c.name)).size).toBe(k)
        expect(new Set(cs.map((c) => c.order)).size).toBe(k)
        const qs = fc.makeQuestions(cs, r)
        expect(qs).toHaveLength(k)
        for (const q of qs) {
          expect(q.options).toHaveLength(4)
          expect(new Set(q.options).size).toBe(4)
          expect(q.options).toContain(q.answer)
          expect(q.answer).toBe(q.kind === 'order' ? cs[q.customer].order : cs[q.customer].name)
        }
      }
  })
})
describe('Splitting Seeds', () => {
  it('ideal bölücü farkı ≤ 1, benzersiz x', () => {
    const r = makeRng(3)
    for (const mode of ['cluster', 'scatter'] as const)
      for (const n of [20, 33, 50, 70]) {
        const s = sd.genSeeds(n, mode, r)
        expect(s).toHaveLength(n)
        expect(new Set(s.map((p) => p.x)).size).toBe(n)
        expect(sd.splitDiff(s, sd.idealDivider(s))).toBeLessThanOrEqual(1)
        expect(s.every((p) => p.x > 0 && p.x < 1.01)).toBe(true)
      }
  })
})
describe('Star Search', () => {
  it('hedef benzersiz ve doğru indekste', () => {
    const r = makeRng(4)
    for (const level of [1, 2, 3])
      for (let t = 0; t < 100; t++) {
        const { items, targetIndex } = sr.genSearch(level, r)
        expect(items).toHaveLength(sr.searchCount(level))
        const tg = items[targetIndex]
        const dupes = items.filter((x, i) => i !== targetIndex && x.shape === tg.shape && x.color === tg.color)
        expect(dupes).toHaveLength(0)
      }
  })
})
describe('Spatial Speed (rotasyon)', () => {
  it('same=true döndürülmüş aynı şekil, same=false aynalı (farklı)', () => {
    const r = makeRng(5)
    for (const k of [5, 6, 7])
      for (let t = 0; t < 120; t++) {
        const tr = ro.genRotTrial(k, r)
        expect(tr.left).toHaveLength(k)
        expect(ro.sameUnderRotation(tr.left, tr.right)).toBe(tr.same)
      }
  })
})
describe('Disillusion (kural değişimi)', () => {
  it('her kuralda tam bir referans eşleşir ve kurallar farklı referansları işaret eder', () => {
    const r = makeRng(6)
    for (let t = 0; t < 300; t++) {
      const refs = so.makeRefs(r)
      const st = so.makeStimulus(refs, r)
      const ans = (['color', 'shape', 'count'] as const).map((rule) => so.answerFor(refs, st, rule))
      expect(new Set(ans).size).toBe(3)
      for (const rule of ['color', 'shape', 'count'] as const) expect(refs.filter((x) => x[rule] === st[rule])).toHaveLength(1)
    }
  })
  it('kural değişim aralığı', () => {
    const r = makeRng(7)
    expect(so.sortNextRule('color', 4, 1, r)).toBe('color')
    expect(so.sortNextRule('color', 5, 1, r)).toBe('shape')
    expect(so.sortRules(1)).toHaveLength(2)
    expect(so.sortRules(2)).toHaveLength(3)
  })
})
describe('Ebb and Flow', () => {
  it('cevap renge göre: yeşil=bakış, turuncu=hareket; uyumsuz oranı', () => {
    const r = makeRng(8)
    let conflict = 0
    for (let t = 0; t < 2000; t++) {
      const e = eb.genEbb(3, r)
      expect(e.answer).toBe(e.color === 'green' ? e.face : e.move)
      expect(e.congruent).toBe(e.face === e.move)
      if (!e.congruent) conflict++
    }
    expect(conflict / 2000).toBeGreaterThan(0.8)
    expect(eb.ebbDirs(1)).toHaveLength(2)
  })
})
describe('Pirate Passage (kayan gemi)', () => {
  it('üretilen bulmaca çözülebilir, optimal hamle uyuşur, hamle sınırı ≥ optimal', () => {
    const r = makeRng(9)
    for (const level of [1, 2, 3])
      for (let t = 0; t < 25; t++) {
        const p = sl.genPuzzle(level, r)
        expect(p.optimal).toBeGreaterThanOrEqual(1)
        expect(sl.solve(p.rocks, p.size, p.start, p.goal)).toBe(p.optimal)
        expect(sl.moveLimit(p, level)).toBeGreaterThan(p.optimal)
        expect(p.rocks[p.start[0]][p.start[1]]).toBe(false)
        expect(p.rocks[p.goal[0]][p.goal[1]]).toBe(false)
      }
  })
  it('kayma taşa/duvara kadar sürer', () => {
    const rocks = Array.from({ length: 4 }, () => Array<boolean>(4).fill(false))
    rocks[0][3] = true
    expect(sl.slidePath(rocks, 4, [0, 0], 'right')).toEqual([[0, 1], [0, 2]])
    expect(sl.slidePath(rocks, 4, [0, 0], 'up')).toEqual([])
  })
})
describe('Pattern Logic (matris)', () => {
  it('cevap benzersiz seçenek ve Latin özelliği', () => {
    const r = makeRng(10)
    for (const level of [1, 2, 3])
      for (let t = 0; t < 200; t++) {
        const p = mx.genMatrix(level, r)
        expect(p.options).toHaveLength(4)
        expect(p.options.filter((c) => mx.cellsEqual(c, p.grid[2][2]))).toHaveLength(1)
        expect(mx.cellsEqual(p.options[p.answerIndex], p.grid[2][2])).toBe(true)
        for (const a of mx.matrixAttrs(level)) {
          for (let i = 0; i < 3; i++) {
            expect(new Set(p.grid[i].map((c) => c[a])).size).toBe(3)
            expect(new Set(p.grid.map((row) => row[i][a])).size).toBe(3)
          }
        }
      }
  })
})
describe('Penguin Pursuit (labirent)', () => {
  it('mükemmel labirent: tüm hücrelere ulaşılır, kenar sayısı = hücre − 1', () => {
    const r = makeRng(11)
    for (const [w, h] of [[7, 7], [9, 9], [11, 11]] as const) {
      const m = mz.genMaze(w, h, r)
      const { dist } = mz.bfs(m, [0, 0])
      expect(dist.flat().every((d) => d >= 0)).toBe(true)
      let edges = 0
      for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) { if (m.open[i][j].right) edges++; if (m.open[i][j].down) edges++ }
      expect(edges).toBe(w * h - 1)
    }
  })
  it('en kısa yol uzunluğu = BFS mesafesi; balık adil konumda', () => {
    const r = makeRng(12)
    const m = mz.genMaze(9, 9, r)
    const player: mz.Cell = [8, 0], rival: mz.Cell = [0, 8]
    const fish = mz.pickFish(m, player, rival, r, 5, 0)
    const dp = mz.bfs(m, player).dist, dr = mz.bfs(m, rival).dist
    expect(mz.pathTo(m, rival, fish)).toHaveLength(dr[fish[0]][fish[1]])
    expect(dp[fish[0]][fish[1]]).toBeLessThanOrEqual(dr[fish[0]][fish[1]])
  })
})
describe('Word Bubbles (TR)', () => {
  it('sözlükteki her sözcük kökle başlar, tekrar yok, yeterli çeşit', () => {
    for (const stem of wd.STEMS) {
      const list = wd.WORDS[stem].map(wd.trLower)
      expect(list.length).toBeGreaterThanOrEqual(10)
      expect(new Set(list).size).toBe(list.length)
      expect(list.every((w) => w.startsWith(wd.trLower(stem)))).toBe(true)
    }
  })
  it('checkWord', () => {
    expect(wd.checkWord('kar', 'Karpuz', [])).toBe('ok')
    expect(wd.checkWord('kar', 'karpuz', ['karpuz'])).toBe('dup')
    expect(wd.checkWord('kar', 'kalem', [])).toBe('stem')
    expect(wd.checkWord('kar', 'karxyz', [])).toBe('invalid')
    expect(wd.checkWord('göz', 'GÖZLÜK', [])).toBe('ok')
  })
})
describe('Train of Thought (raylar)', () => {
  it('finalRow makas mantığı', () => {
    expect(rl.finalRow(0, [false, false, false], null)).toBe(0)
    expect(rl.finalRow(0, [true, false, false], null)).toBe(1)
    expect(rl.finalRow(2, [true, true, true], null)).toBe(0)
    expect(rl.finalRow(0, [true, false, false], [false, true, false])).toBe(2)
  })
  it('her başlangıç için her hedef hat ulaşılabilir (2 katman)', () => {
    for (let s = 0; s < rl.ROWS; s++) {
      const reach = new Set<number>()
      for (const a of [false, true]) for (const b of [false, true]) reach.add(rl.finalRow(s, [a, a, a].map((x, i) => (i === s ? a : x)), [b, b, b]))
      expect(reach.size).toBe(3)
    }
  })
})
describe('Pinball Recall (fizik)', () => {
  it('deterministik ve geçerli yuva; tamponsuz düz düşüş', () => {
    const b = pb.genBumpers(4, makeRng(13))
    const a1 = pb.simulate(b, 0.4, 0.05, 5)
    const a2 = pb.simulate(b, 0.4, 0.05, 5)
    expect(a1).toEqual(a2)
    expect(a1.slot).toBeGreaterThanOrEqual(0)
    expect(a1.slot).toBeLessThan(5)
    expect(pb.simulate([], 0.5, 0, 5).slot).toBe(2)
    expect(pb.simulate([], 0.1, 0, 5).slot).toBe(0)
    expect(pb.simulate([], 0.9, 0, 3).slot).toBe(2)
  })
  it('tamponlar arası mesafe ve sınırlar; her koşuda top biter', () => {
    const r = makeRng(14)
    for (let t = 0; t < 60; t++) {
      const b = pb.genBumpers(pb.pinballBumperCount(t), r)
      for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) expect(Math.hypot(b[i].x - b[j].x, b[i].y - b[j].y)).toBeGreaterThanOrEqual(0.2 - 1e-9)
      const res = pb.simulate(b, 0.15 + r.next() * 0.7, (r.next() - 0.5) * 0.3, 5)
      expect(res.path.length).toBeGreaterThan(5)
      expect(res.path.length).toBeLessThan(2000)
    }
  })
})
