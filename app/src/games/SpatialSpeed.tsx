import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genRotTrial, rotCells, rotLimitMs, type Cells, type RotTrial } from '../core/rotation'
import { useT } from '../core/store'
import { Feed, SHAKE, StreakBar, useKeys, useLeveler, type Msg } from '../components/GameBits'

function Shape({ cells, color }: { cells: Cells; color: string }) {
  const minR = Math.min(...cells.map((c) => c[0])), minC = Math.min(...cells.map((c) => c[1]))
  const maxR = Math.max(...cells.map((c) => c[0])), maxC = Math.max(...cells.map((c) => c[1]))
  // Sabit 5x5 ızgara: iki şekil aynı ölçekte çizilir, boyut farkı ipucu vermez; şekil ortalanır.
  const size = 5
  const w = 100 / size
  const offR = (size - (maxR - minR + 1)) / 2, offC = (size - (maxC - minC + 1)) / 2
  return (
    <svg viewBox="0 0 100 100" width="100%" aria-hidden>
      {cells.map(([r, c], i) => <rect key={i} x={(c - minC + offC) * w + 1.5} y={(r - minR + offR) * w + 1.5} width={w - 3} height={w - 3} rx="5" fill={color} />)}
    </svg>
  )
}

export default function SpatialSpeed({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const lv = useLeveler(startLevel)
  const S = useRef({ n: 0, streak: 0, shownAt: performance.now(), answered: false, msgId: 0 })
  const [tr, setTr] = useState<RotTrial>(() => genRotTrial(rotCells(lv.get()), rng))
  const trRef = useRef(tr)
  const [n, setN] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])
  const limit = rotLimitMs(n, streak)

  const finish = (saysSame: boolean | null) => {
    const s = S.current
    if (s.answered) return
    s.answered = true
    const cur = trRef.current
    const correct = saysSame === cur.same
    const rt = performance.now() - s.shownAt
    s.streak = correct ? s.streak + 1 : 0
    setStreak(s.streak)
    session.record({ correct, rt: saysSame === null ? limit : rt, points: Math.max(60, Math.round(240 - rt * 0.03)), tag: `${cur.left.length}c` })
    const level = lv.report(correct)
    session.setLevel(level)
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? `${Math.round(rt)} ms` : cur.same ? t({ tr: 'Aynı şekildi (döndürülmüş)', en: 'It was the same (rotated)' }) : t({ tr: 'Aynalanmış, farklıydı', en: 'It was mirrored — different' }), good: correct, id: ++s.msgId })
    s.n += 1
    const next = genRotTrial(rotCells(level), rng)
    trRef.current = next
    s.answered = false; s.shownAt = performance.now()
    setTr(next); setN(s.n)
  }
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => finish(null), limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, paused, limit])
  useKeys((e) => {
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'e') finish(true)
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'h') finish(false)
  })

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Seviye ${lv.level} · ${tr.left.length} kare`, en: `Level ${lv.level} · ${tr.left.length} tiles` })}</span>
        <span className="muted small">{t({ tr: 'Sağdaki şekil, soldakinin sadece DÖNDÜRÜLMÜŞ hali mi? Aynalanmış ise FARKLI.', en: 'Is the right shape just a ROTATED copy of the left? A mirror image is DIFFERENT.' })}</span>
      </div>
      <motion.div className="rot-board glass" animate={shake}>
        <div className="rot-shape"><Shape cells={tr.left} color="#4C9AFF" /></div>
        <span className="sm-arrow" aria-hidden>≟</span>
        <div className="rot-shape"><Shape cells={tr.right} color="#FFC145" /></div>
        <div className="lim-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>
      <Feed msg={msg} />
      <StreakBar streak={streak} />
      <div className="sm-actions">
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice no" onClick={() => finish(false)}><span>← {t({ tr: 'FARKLI', en: 'DIFFERENT' })}</span><kbd>←</kbd></motion.button>
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice yes" onClick={() => finish(true)}><span>{t({ tr: 'AYNI', en: 'SAME' })} →</span><kbd>→</kbd></motion.button>
      </div>
    </div>
  )
}
