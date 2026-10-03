import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { ROWS, STAGE_X, STATION_COLORS, railLevel, railStages, trainSpawnSec, trainTravelSec } from '../core/rails'
import { sfx } from '../core/audio'
import { useT } from '../core/store'

const MAX_MISSES = 3
interface Train { id: number; row: number; color: number; born: number; dur: number; r1: boolean; r2: boolean; cur: number }
interface Fx { id: number; row: number; good: boolean }

export default function TrainOfThought({ session, paused, seed }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const els = useRef(new Map<number, HTMLDivElement>())
  const trains = useRef<Train[]>([])
  const [ids, setIds] = useState<Train[]>([])
  const [s1, setS1] = useState([false, false, false])
  const [s2, setS2] = useState([false, false, false])
  const sw = useRef({ s1, s2 })
  sw.current = { s1, s2 }
  const [misses, setMisses] = useState(0)
  const [fx, setFx] = useState<Fx[]>([])
  const S = useRef({ clock: 0, lastSpawn: -9999, id: 0, resolved: 0, misses: 0, fx: 0 })
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const level = railLevel(S.current.resolved)
  const stages = railStages(level)

  const toggle = (stage: 1 | 2, row: number) => {
    if (pausedRef.current) return
    sfx.tick()
    if (stage === 1) setS1((a) => a.map((v, i) => (i === row ? !v : v)))
    else setS2((a) => a.map((v, i) => (i === row ? !v : v)))
  }

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const rowTop = (r: number) => `${((r + 0.5) / ROWS) * 100}%`
    const loop = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!pausedRef.current) {
        const st = S.current
        st.clock += dt
        const lv = railLevel(st.resolved)
        if (st.clock - st.lastSpawn > trainSpawnSec(lv, st.resolved) * 1000 && trains.current.length < 5) {
          const row = rng.int(0, ROWS - 1)
          const tr: Train = { id: ++st.id, row, color: rng.int(0, ROWS - 1), born: st.clock, dur: trainTravelSec(lv, st.resolved) * 1000, r1: false, r2: false, cur: row }
          trains.current = [...trains.current, tr]
          st.lastSpawn = st.clock
          setIds([...trains.current])
        }
        for (const tr of [...trains.current]) {
          const p = (st.clock - tr.born) / tr.dur
          // Makas kararı: tren makas çizgisini geçtiği anda, O ANKİ makas durumuna göre
          if (!tr.r1 && p >= STAGE_X[0]) { tr.r1 = true; if (sw.current.s1[tr.cur]) tr.cur = (tr.cur + 1) % ROWS }
          if (!tr.r2 && railStages(lv) > 1 && p >= STAGE_X[1]) { tr.r2 = true; if (sw.current.s2[tr.cur]) tr.cur = (tr.cur + 1) % ROWS }
          const el = els.current.get(tr.id)
          if (el) { el.style.left = `${Math.min(1, p) * 100}%`; el.style.top = rowTop(tr.cur) }
          if (p >= 1) {
            const good = tr.cur === tr.color
            session.record({ correct: good, rt: tr.dur, points: 140, tag: good ? 'delivered' : 'wrong-station' })
            st.resolved += 1
            session.setLevel(railLevel(st.resolved))
            const fid = ++st.fx
            setFx((f) => [...f, { id: fid, row: tr.cur, good }])
            setTimeout(() => setFx((f) => f.filter((x) => x.id !== fid)), 650)
            trains.current = trains.current.filter((x) => x.id !== tr.id)
            els.current.delete(tr.id)
            setIds([...trains.current])
            if (!good) { st.misses += 1; setMisses(st.misses); if (st.misses >= MAX_MISSES) session.end() }
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="tr">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Seviye ${level} · ${stages} makas katmanı`, en: `Level ${level} · ${stages} switch layer(s)` })}</span>
        <span className="muted small">{t({ tr: 'Makasa dokun: tren bir alt hatta geçer. Her treni kendi renkli istasyonuna ulaştır!', en: 'Tap a switch: the train shifts one line down. Deliver each train to its matching station!' })}</span>
        <div className="mm-errors" aria-label="misses">{Array.from({ length: MAX_MISSES }, (_, i) => <span key={i} className={`dot ${i < misses ? 'used' : ''}`} />)}</div>
      </div>
      <div className="tr-board glass">
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} className="tr-row" style={{ top: `${((r + 0.5) / ROWS) * 100}%` }}>
            <i className="tr-rail" />
            <span className="tr-station" style={{ background: STATION_COLORS[r] }} />
          </div>
        ))}
        {Array.from({ length: ROWS }, (_, r) => (
          <button key={`a${r}`} className={`tr-switch ${s1[r] ? 'on' : ''}`} style={{ left: `${STAGE_X[0] * 100}%`, top: `${((r + 0.5) / ROWS) * 100}%` }} onClick={() => toggle(1, r)} aria-pressed={s1[r]} aria-label={`switch 1-${r + 1}`}>{s1[r] ? '↘' : '→'}</button>
        ))}
        {stages > 1 && Array.from({ length: ROWS }, (_, r) => (
          <button key={`b${r}`} className={`tr-switch ${s2[r] ? 'on' : ''}`} style={{ left: `${STAGE_X[1] * 100}%`, top: `${((r + 0.5) / ROWS) * 100}%` }} onClick={() => toggle(2, r)} aria-pressed={s2[r]} aria-label={`switch 2-${r + 1}`}>{s2[r] ? '↘' : '→'}</button>
        ))}
        {ids.map((tr) => (
          <div key={tr.id} ref={(el) => { if (el) els.current.set(tr.id, el); else els.current.delete(tr.id) }} className="tr-train" style={{ background: STATION_COLORS[tr.color], left: 0, top: `${((tr.row + 0.5) / ROWS) * 100}%` }}><i /></div>
        ))}
        <AnimatePresence>
          {fx.map((f) => <motion.i key={f.id} className={`tr-fx ${f.good ? 'good' : 'bad'}`} style={{ top: `${((f.row + 0.5) / ROWS) * 100}%` }} initial={{ scale: 0.4, opacity: 1 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.6 }} />)}
        </AnimatePresence>
      </div>
    </div>
  )
}
