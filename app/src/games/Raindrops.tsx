import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genExpr } from '../core/mathgen'
import { rdFallSec, rdSimultaneous, rdTier } from '../core/adaptive'
import { sfx } from '../core/audio'
import { useT } from '../core/store'

const LANES = 5
const MAX_WATER = 5
const DROP_H = 100

interface Drop { id: number; expr: string; ans: number; lane: number; born: number; dur: number }
interface Fx { id: number; x: number; y: number; good: boolean }

export default function Raindrops({ session, paused, seed }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const arenaRef = useRef<HTMLDivElement>(null)
  const els = useRef(new Map<number, HTMLDivElement>())
  const dropsRef = useRef<Drop[]>([])
  const [drops, setDrops] = useState<Drop[]>([])
  const [buffer, setBuffer] = useState('')
  const bufRef = useRef('')
  const [water, setWater] = useState(0)
  const [fx, setFx] = useState<Fx[]>([])
  const [shakeKey, setShakeKey] = useState(0)
  const S = useRef({ clock: 0, lastSpawn: -9999, id: 0, resolved: 0, water: 0, okRun: 0, fxId: 0 })
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const syncDrops = () => setDrops([...dropsRef.current])
  const setBuf = (v: string) => { bufRef.current = v; setBuffer(v) }

  const progress = (d: Drop) => (S.current.clock - d.born) / d.dur

  const splash = useCallback((lane: number, y: number, good: boolean) => {
    const id = ++S.current.fxId
    setFx((f) => [...f, { id, x: ((lane + 0.5) / LANES) * 100, y, good }])
    setTimeout(() => setFx((f) => f.filter((e) => e.id !== id)), 700)
  }, [])

  const raiseWater = useCallback(() => {
    const st = S.current
    st.water = Math.min(MAX_WATER, st.water + 1)
    st.okRun = 0
    setWater(st.water)
    if (st.water >= MAX_WATER) session.end()
  }, [session])

  const remove = (id: number) => {
    dropsRef.current = dropsRef.current.filter((d) => d.id !== id)
    els.current.delete(id)
    S.current.resolved += 1
    session.setLevel(S.current.resolved)
    syncDrops()
  }

  const solve = (d: Drop) => {
    const arenaH = arenaRef.current?.clientHeight ?? 400
    const p = Math.min(1, Math.max(0, progress(d)))
    const y = p * (arenaH - DROP_H) + DROP_H / 2
    session.record({ correct: true, rt: S.current.clock - d.born, points: 100 + Math.round((1 - p) * 100), tag: rdTier(S.current.resolved + 1) })
    splash(d.lane, y, true)
    const st = S.current
    st.okRun += 1
    if (st.okRun >= 5 && st.water > 0) { st.water -= 1; st.okRun = 0; setWater(st.water); sfx.levelUp() }
    remove(d.id)
    setBuf('')
  }

  /** Yazılan sayıyı en aşağıdaki eşleşen damlayla çöz. force=Enter. */
  const tryMatch = (force: boolean) => {
    const buf = bufRef.current
    if (!buf) return
    const num = Number(buf)
    const hits = dropsRef.current.filter((d) => d.ans === num).sort((a, b) => progress(b) - progress(a))
    if (hits.length) {
      // "1" yazarken "12" cevaplı damla varsa Enter'ı ya da sonraki rakamı bekle
      const longer = dropsRef.current.some((d) => d.ans !== num && String(d.ans).startsWith(buf))
      if (force || !longer) return solve(hits[0])
      return
    }
    if (force) {
      session.record({ correct: false, tag: 'wrong-entry' })
      setShakeKey((k) => k + 1)
      setBuf('')
    }
  }

  const press = (k: string) => {
    if (pausedRef.current) return
    if (k === 'back') return setBuf(bufRef.current.slice(0, -1))
    if (k === 'enter') return tryMatch(true)
    if (bufRef.current.length >= 3) return
    setBuf(bufRef.current + k)
    tryMatch(false)
  }
  const pressRef = useRef(press)
  pressRef.current = press

  // Oyun döngüsü: yalnızca duraklatılmamışken saat ilerler; konum DOM'a doğrudan yazılır (React render'ı yok).
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!pausedRef.current) {
        const st = S.current
        st.clock += dt
        const round = st.resolved
        // yeni damla
        if (dropsRef.current.length < rdSimultaneous(round) && st.clock - st.lastSpawn > 900) {
          const used = new Set(dropsRef.current.filter((d) => progress(d) < 0.4).map((d) => d.lane))
          const free = Array.from({ length: LANES }, (_, i) => i).filter((i) => !used.has(i))
          const lane = rng.pick(free.length ? free : [0, 1, 2, 3, 4])
          let e = genExpr(rdTier(round + 1), rng)
          for (let i = 0; i < 6 && dropsRef.current.some((d) => d.ans === e.ans); i++) e = genExpr(rdTier(round + 1), rng)
          const d: Drop = { id: ++st.id, expr: e.expr, ans: e.ans, lane, born: st.clock, dur: rdFallSec(round) * 1000 }
          dropsRef.current = [...dropsRef.current, d]
          st.lastSpawn = st.clock
          syncDrops()
        }
        const H = (arenaRef.current?.clientHeight ?? 400) - DROP_H
        for (const d of [...dropsRef.current]) {
          const p = progress(d)
          const el = els.current.get(d.id)
          if (el) el.style.transform = `translateY(${Math.max(0, Math.min(1, p)) * H}px)`
          if (p >= 1) {
            session.record({ correct: false, tag: 'missed' })
            splash(d.lane, H + DROP_H / 2, false)
            sfx.wrong()
            remove(d.id)
            raiseWater()
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) pressRef.current(e.key)
      else if (e.key === 'Backspace') pressRef.current('back')
      else if (e.key === 'Enter') pressRef.current('enter')
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div className="rd">
      <div className="rd-arena" ref={arenaRef}>
        <div className="rd-lanes" aria-hidden>{Array.from({ length: LANES }, (_, i) => <i key={i} />)}</div>
        {drops.map((d) => (
          <div
            key={d.id}
            ref={(el) => { if (el) els.current.set(d.id, el); else els.current.delete(d.id) }}
            className={`rd-drop ${buffer && String(d.ans).startsWith(buffer) ? 'hint' : ''}`}
            style={{ left: `${((d.lane + 0.5) / LANES) * 100}%`, height: DROP_H }}
          >
            <svg viewBox="0 0 70 84" width="82" height={DROP_H} aria-hidden>
              <defs>
                <linearGradient id={`g${d.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fd3ff" /><stop offset="1" stopColor="#2f7dff" /></linearGradient>
              </defs>
              <path d="M35 4 C35 4 62 36 62 56 C62 71 50 80 35 80 C20 80 8 71 8 56 C8 36 35 4 35 4Z" fill={`url(#g${d.id})`} />
              <path d="M22 50 C22 42 26 36 30 32" stroke="#fff" strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
            <span className="rd-expr">{d.expr}</span>
          </div>
        ))}
        <AnimatePresence>
          {fx.map((f) => (
            <motion.i key={f.id} className={`rd-fx ${f.good ? 'good' : 'bad'}`} style={{ left: `${f.x}%`, top: f.y }} initial={{ scale: 0.3, opacity: 0.9 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.6 }} />
          ))}
        </AnimatePresence>
        <div className="rd-water" style={{ height: `${6 + water * 13}%` }} aria-label={`${t({ tr: 'su', en: 'water' })} ${water}/${MAX_WATER}`} />
      </div>

      <motion.div key={shakeKey} className="rd-entry" animate={shakeKey ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.3 }}>
        <div className="rd-buf" aria-live="polite">{buffer || <span className="muted">{t({ tr: 'cevabı yaz', en: 'type the answer' })}</span>}</div>
        <div className="rd-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => <button key={k} className="btn ghost" onClick={() => press(k)}>{k}</button>)}
          <button className="btn ghost" onClick={() => press('back')} aria-label={t({ tr: 'sil', en: 'backspace' })}>⌫</button>
          <button className="btn ghost" onClick={() => press('0')}>0</button>
          <button className="btn primary" onClick={() => press('enter')} aria-label={t({ tr: 'gönder', en: 'enter' })}>↵</button>
        </div>
      </motion.div>
    </div>
  )
}
