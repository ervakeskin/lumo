import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import type { Dir4 } from '../core/flanker'
import { ebbLimitMs, genEbb, type EbbTrial } from '../core/ebb'
import { useT } from '../core/store'
import { DPad, Feed, SHAKE, StreakBar, dirOfKey, useKeys, useLeveler, type Msg } from '../components/GameBits'

const ROT: Record<Dir4, number> = { right: 0, down: 90, left: 180, up: 270 }
const VEC: Record<Dir4, [number, number]> = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }
const NAMES: Record<Dir4, { tr: string; en: string }> = { left: { tr: 'SOL', en: 'LEFT' }, right: { tr: 'SAĞ', en: 'RIGHT' }, up: { tr: 'YUKARI', en: 'UP' }, down: { tr: 'AŞAĞI', en: 'DOWN' } }

function Leaf({ color, face }: { color: 'green' | 'orange'; face: Dir4 }) {
  const fill = color === 'green' ? '#3fbf6a' : '#ff9f43'
  const dark = color === 'green' ? '#2a8c4b' : '#d9741a'
  return (
    <svg viewBox="0 0 100 100" width="100%" style={{ transform: `rotate(${ROT[face]}deg)` }} aria-hidden>
      <path d="M8 50 C24 14 66 14 92 50 C66 86 24 86 8 50Z" fill={fill} />
      <path d="M12 50 H84" stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <path d="M36 50 L52 32 M48 50 L64 34 M36 50 L52 68 M48 50 L64 66" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <path d="M84 50 L96 50" stroke="#fff" strokeOpacity=".9" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export default function EbbAndFlow({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const lv = useLeveler(startLevel)
  const S = useRef({ n: 0, streak: 0, shownAt: performance.now(), answered: false, msgId: 0 })
  const [tr, setTr] = useState<EbbTrial>(() => genEbb(lv.get(), rng))
  const trRef = useRef(tr)
  const [n, setN] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])
  const limit = ebbLimitMs(n, streak)
  const four = lv.level >= 2

  const finish = (d: Dir4 | null) => {
    const s = S.current
    if (paused || s.answered) return
    if (d && !four && (d === 'up' || d === 'down')) return
    s.answered = true
    const cur = trRef.current
    const correct = d === cur.answer
    const rt = performance.now() - s.shownAt
    s.streak = correct ? s.streak + 1 : 0
    setStreak(s.streak)
    session.record({ correct, rt: d === null ? limit : rt, points: Math.max(60, Math.round(240 - rt * 0.05)), tag: `${cur.color}${cur.congruent ? '-cong' : '-inc'}` })
    const level = lv.report(correct)
    session.setLevel(level)
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? `${Math.round(rt)} ms` : t({ tr: `Doğrusu: ${NAMES[cur.answer].tr} (${cur.color === 'green' ? 'bakış' : 'hareket'})`, en: `Correct: ${NAMES[cur.answer].en} (${cur.color === 'green' ? 'facing' : 'moving'})` }), good: correct, id: ++s.msgId })
    s.n += 1
    const next = genEbb(level, rng)
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
  useKeys((e) => { const d = dirOfKey(e.key); if (d) { e.preventDefault(); finish(d) } })

  const [vx, vy] = VEC[tr.move]
  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={lv.level}>{t({ tr: `Seviye ${lv.level} · ${four ? 'dört' : 'iki'} yön`, en: `Level ${lv.level} · ${four ? 'four' : 'two'} directions` })}</span>
        <div className="ebb-legend muted small">
          <span><i className="ebb-dot g" /> {t({ tr: 'Yeşil: BAKTIĞI yön', en: 'Green: direction it FACES' })}</span>
          <span><i className="ebb-dot o" /> {t({ tr: 'Turuncu: HAREKET yönü', en: 'Orange: direction it MOVES' })}</span>
        </div>
      </div>
      <motion.div className="pond glass" animate={shake}>
        <motion.div key={n} className="leaf" initial={{ x: -vx * 60, y: -vy * 60, opacity: 0, scale: 0.8 }} animate={{ x: vx * 60, y: vy * 60, opacity: 1, scale: 1 }} transition={{ duration: Math.min(1.6, limit / 1000), ease: 'linear', opacity: { duration: 0.15 } }}>
          <Leaf color={tr.color} face={tr.face} />
        </motion.div>
        <div className="lim-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>
      <Feed msg={msg} />
      <StreakBar streak={streak} />
      {four ? <DPad onPick={finish} /> : (
        <div className="sm-actions">
          <motion.button whileTap={{ scale: 0.94 }} className="btn choice lim-btn" onClick={() => finish('left')}><span>← {t(NAMES.left)}</span><kbd>←</kbd></motion.button>
          <motion.button whileTap={{ scale: 0.94 }} className="btn choice lim-btn" onClick={() => finish('right')}><span>{t(NAMES.right)} →</span><kbd>→</kbd></motion.button>
        </div>
      )}
    </div>
  )
}
