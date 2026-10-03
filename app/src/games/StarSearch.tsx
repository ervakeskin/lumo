import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genSearch, type SItem } from '../core/search'
import { useT } from '../core/store'
import { Feed, SHAKE, StreakBar, useLeveler, type Msg, useLater } from '../components/GameBits'

const COLORS = ['#FFC145', '#4C9AFF', '#FF6B6B', '#2FD08F', '#B79BFF', '#FF8A3D', '#3DD5F3']
const STAR5 = 'M50 6 L61 38 L94 38 L67 58 L77 92 L50 72 L23 92 L33 58 L6 38 L39 38Z'
const STAR4 = 'M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40Z'
const limitMs = (n: number) => Math.max(3500, 9000 - n * 100)

interface Trial { items: SItem[]; target: number; pos: [number, number][]; cols: number; level: number }

export default function StarSearch({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const lv = useLeveler(startLevel, 8)
  const S = useRef({ n: 0, streak: 0, shownAt: performance.now(), answered: false, msgId: 0 })
  const build = (level: number): Trial => {
    const { items, targetIndex } = genSearch(level, rng)
    const cols = Math.ceil(Math.sqrt(items.length * 1.35))
    return { items, target: targetIndex, cols, level, pos: items.map(() => [(rng.next() - 0.5) * 0.4, (rng.next() - 0.5) * 0.4] as [number, number]) }
  }
  const [tr, setTr] = useState<Trial>(() => build(lv.get()))
  const trRef = useRef(tr)
  const [n, setN] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [hit, setHit] = useState<number | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  const finish = (idx: number | null) => {
    const s = S.current
    if (s.answered) return
    s.answered = true
    const cur = trRef.current
    const correct = idx === cur.target
    const rt = performance.now() - s.shownAt
    s.streak = correct ? s.streak + 1 : 0
    setStreak(s.streak)
    session.record({ correct, rt: idx === null ? limitMs(s.n) : rt, points: Math.max(60, Math.round(260 - rt * 0.03)), tag: `L${cur.level}` })
    const level = lv.report(correct)
    session.setLevel(level)
    setHit(cur.target)
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? `${Math.round(rt)} ms` : idx === null ? t({ tr: 'Süre doldu', en: 'Time’s up' }) : t({ tr: 'Yanlış yıldız', en: 'Wrong star' }), good: correct, id: ++s.msgId })
    later(() => {
      s.n += 1
      const next = build(level)
      trRef.current = next
      s.answered = false; s.shownAt = performance.now()
      setHit(null); setTr(next); setN(s.n)
    }, correct ? 180 : 700)
  }
  const limit = limitMs(n)
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => finish(null), limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, paused, limit])

  const levelName = [
    '', t({ tr: 'Seviye 1 · Rengi farklı olan', en: 'Level 1 · Odd color' }),
    t({ tr: 'Seviye 2 · Şekli farklı olan', en: 'Level 2 · Odd shape' }),
    t({ tr: 'Seviye 3 · Renk + şekil birleşimi', en: 'Level 3 · Color + shape conjunction' }),
  ][tr.level]
  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={tr.level}>{levelName}</span>
        <span className="muted small">{t({ tr: 'Kalabalıkta diğerlerinden farklı olan tek yıldızı bul.', en: 'Find the one star that differs from the rest.' })}</span>
      </div>
      <motion.div className="sky-board glass" animate={shake} style={{ gridTemplateColumns: `repeat(${tr.cols}, 1fr)` }}>
        {tr.items.map((it, i) => (
          <button key={i} className={`sky-cell ${hit === i ? 'hit' : ''}`} style={{ transform: `translate(${tr.pos[i][0] * 30}%, ${tr.pos[i][1] * 30}%)` }} onClick={() => finish(i)} aria-label={`${t({ tr: 'yıldız', en: 'star' })} ${i + 1}`}>
            <svg viewBox="0 0 100 100" width="100%" style={{ transform: `rotate(${it.rot}deg)` }}><path d={it.shape === 1 ? STAR4 : STAR5} fill={COLORS[it.color % COLORS.length]} strokeLinejoin="round" /></svg>
          </button>
        ))}
        <div className="lim-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>
      <Feed msg={msg} />
      <StreakBar streak={streak} />
    </div>
  )
}
