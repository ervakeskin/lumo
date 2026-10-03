import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { smNextLevel } from '../core/adaptive'
import { sfx } from '../core/audio'

export interface Msg { text: string; good: boolean; id: number }

/** Klavye dinleyicisi: en güncel handler her zaman çağrılır (bayat closure yok), tekrar eden tuşlar yok sayılır. */
export function useKeys(fn: (e: KeyboardEvent) => void) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (!e.repeat) ref.current(e) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])
}

/**
 * Duraklatmaya saygılı, unmount'ta temizlenen gecikmeli çağrı. Duraklatınca kalan süre dondurulur,
 * devam edince kaldığı yerden sürer (bare setTimeout: duraklatmayı yok sayar ve oyun bitince de çalışırdı).
 */
export function useLater(paused: boolean) {
  const q = useRef(new Map<number, { fn: () => void; left: number; t0: number; id?: ReturnType<typeof setTimeout> }>())
  const seq = useRef(0)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  const start = (key: number) => {
    const e = q.current.get(key)
    if (!e) return
    e.t0 = performance.now()
    e.id = setTimeout(() => { q.current.delete(key); e.fn() }, e.left)
  }

  useEffect(() => {
    for (const [key, e] of q.current) {
      if (paused) {
        if (e.id !== undefined) { clearTimeout(e.id); e.id = undefined; e.left = Math.max(0, e.left - (performance.now() - e.t0)) }
      } else if (e.id === undefined) start(key)
    }
  }, [paused]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const m = q.current
    return () => { for (const e of m.values()) if (e.id !== undefined) clearTimeout(e.id); m.clear() }
  }, [])

  return (fn: () => void, ms: number) => {
    const key = ++seq.current
    q.current.set(key, { fn, left: ms, t0: 0 })
    if (!pausedRef.current) start(key)
  }
}

/** Blok tabanlı seviye: her `block` denemede doğruluğa göre (≥%85 ↑, <%60 ↓). */
export function useLeveler(start: number, block = 10, max = 3) {
  const [level, setLevel] = useState(start >= 1 && start <= max ? start : 1)
  const st = useRef({ level: start >= 1 && start <= max ? start : 1, total: 0, ok: 0 })
  const report = (correct: boolean) => {
    const s = st.current
    s.total += 1
    if (correct) s.ok += 1
    if (s.total >= block) {
      const nl = Math.min(max, smNextLevel(s.level, s.ok / s.total))
      if (nl > s.level) sfx.levelUp()
      s.level = nl
      setLevel(nl)
      s.total = 0
      s.ok = 0
    }
    return s.level
  }
  return { level, report, get: () => st.current.level }
}

export function StreakBar({ streak }: { streak: number }) {
  return (
    <div className="sm-streak">
      {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < streak ? 'on' : ''} />)}
      <span className="muted small">{streak >= 10 ? 'ATEŞTE!' : streak >= 5 ? `×${1 + Math.floor(streak / 5) * 0.25}` : ''}</span>
    </div>
  )
}
export function Feed({ msg }: { msg: Msg | null }) {
  return (
    <div className="sm-feed" aria-live="polite">
      {msg && <motion.span key={msg.id} className={`sm-msg ${msg.good ? 'good' : 'bad'}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{msg.good ? '✓ ' : '✗ '}{msg.text}</motion.span>}
    </div>
  )
}
/** 4 yönlü tuş takımı (↑ ← ↓ →). */
export function DPad({ onPick, labels }: { onPick: (d: 'up' | 'down' | 'left' | 'right') => void; labels?: Record<string, string> }) {
  const arrow = { up: '↑', down: '↓', left: '←', right: '→' }
  return (
    <div className="dpad" role="group">
      {(['up', 'left', 'right', 'down'] as const).map((d) => (
        <motion.button key={d} whileTap={{ scale: 0.92 }} className={`btn choice lim-btn dp-${d}`} onClick={() => onPick(d)} aria-label={labels?.[d] ?? d}>
          <span>{arrow[d]}</span>
        </motion.button>
      ))}
    </div>
  )
}
export const DIR_KEYS: Record<string, 'up' | 'down' | 'left' | 'right'> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }
export const dirOfKey = (k: string) => DIR_KEYS[k] ?? DIR_KEYS[k.toLowerCase()]
export const SHAKE = { x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } }
