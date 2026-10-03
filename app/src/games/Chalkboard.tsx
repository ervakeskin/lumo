import { useLater } from '../components/GameBits'
import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { smNextLevel, SM_BLOCK } from '../core/adaptive'
import { chalkLimitMs, makeCmpTrial, type Cmp, type CmpTrial } from '../core/compare'
import { sfx } from '../core/audio'
import { useT } from '../core/store'

interface Msg { text: string; good: boolean; id: number }
const SYMBOL: Record<Cmp, string> = { left: '>', equal: '=', right: '<' }

export default function Chalkboard({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({
    n: 0, streak: 0, answered: false, shownAt: performance.now(), msgId: 0,
    level: startLevel >= 1 && startLevel <= 3 ? startLevel : 1, blockTotal: 0, blockCorrect: 0,
  })
  const [tr, setTr] = useState<CmpTrial>(() => makeCmpTrial(S.current.level, rng))
  const trRef = useRef(tr)
  const [n, setN] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(S.current.level)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [picked, setPicked] = useState<{ a: Cmp; ok: boolean } | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  const limit = chalkLimitMs(n, streak)

  const advance = (correct: boolean, rt: number, choice: Cmp | null) => {
    const st = S.current
    st.streak = correct ? st.streak + 1 : 0
    st.blockTotal += 1
    if (correct) st.blockCorrect += 1
    if (st.blockTotal >= SM_BLOCK) {
      const nl = smNextLevel(st.level, st.blockCorrect / st.blockTotal)
      if (nl > st.level) sfx.levelUp()
      st.level = nl
      setLevel(nl)
      st.blockTotal = 0
      st.blockCorrect = 0
    }
    session.setLevel(st.level)
    setStreak(st.streak)
    const cur = trRef.current
    setMsg({ text: correct ? `${Math.round(rt)} ms` : `${cur.left.text} ${SYMBOL[cur.answer]} ${cur.right.text}`, good: correct, id: ++st.msgId })
    setPicked(choice ? { a: choice, ok: correct } : null)
    // Kısa geri bildirim gecikmesi: tahta yeni soruya geçmeden doğru cevap görünür
    later(() => {
      st.n += 1
      const nt = makeCmpTrial(st.level, rng)
      trRef.current = nt
      st.answered = false
      st.shownAt = performance.now()
      setPicked(null)
      setTr(nt)
      setN(st.n)
    }, correct ? 140 : 650)
  }

  const answer = (a: Cmp) => {
    const st = S.current
    if (paused || st.answered) return
    st.answered = true
    const correct = a === trRef.current.answer
    const rt = performance.now() - st.shownAt
    session.record({ correct, rt, points: Math.max(50, Math.round(260 - rt * 0.04)), tag: `L${st.level}` })
    if (!correct) void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
    advance(correct, rt, a)
  }
  const answerRef = useRef(answer)
  answerRef.current = answer

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => {
      const st = S.current
      if (st.answered) return
      st.answered = true
      session.record({ correct: false, rt: limit, tag: `L${st.level}` })
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
      advance(false, limit, null)
    }, limit)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, paused, limit])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') answerRef.current('left')
      else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') answerRef.current('right')
      else if (e.key === 'ArrowDown' || e.key === '=' || e.key.toLowerCase() === 's') answerRef.current('equal')
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const levelName = ['', t({ tr: 'Seviye 1 · Basit ifadeler', en: 'Level 1 · Simple expressions' }), t({ tr: 'Seviye 2 · Çarpma ve iki basamak', en: 'Level 2 · Multiplication and two digits' }), t({ tr: 'Seviye 3 · Üç terimli, yakın değerler', en: 'Level 3 · Three terms, close values' })][level]
  const btn = (a: Cmp, label: string, key: string, cls = '') => (
    <motion.button whileTap={{ scale: 0.94 }} className={`btn choice chalk-btn ${cls} ${picked?.a === a ? (picked.ok ? 'ok' : 'bad') : ''}`} onClick={() => answer(a)}>
      <span>{label}</span><kbd>{key}</kbd>
    </motion.button>
  )

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={`l${level}`}>{levelName}</span>
        <span className="muted small">{t({ tr: 'Hangi ifadenin değeri daha büyük?', en: 'Which expression has the greater value?' })}</span>
      </div>

      <motion.div className="chalkboard" animate={shake}>
          <motion.div key={n} className="chalk-row" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.14 }}>
            <div className={`chalk-side ${picked && tr.answer === 'left' ? 'right-ans' : ''}`}>{tr.left.text}</div>
            <div className="chalk-vs">{picked ? SYMBOL[tr.answer] : '?'}</div>
            <div className={`chalk-side ${picked && tr.answer === 'right' ? 'right-ans' : ''}`}>{tr.right.text}</div>
          </motion.div>
        <div className="lim-clock chalk-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>

      <div className="sm-feed" aria-live="polite">
        {msg && <motion.span key={msg.id} className={`sm-msg ${msg.good ? 'good' : 'bad'}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{msg.good ? '✓ ' : '✗ '}{msg.text}</motion.span>}
      </div>
      <div className="sm-streak">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < streak ? 'on' : ''} />)}</div>

      <div className="chalk-actions">
        {btn('left', t({ tr: '← SOL BÜYÜK', en: '← LEFT' }), '←')}
        {btn('equal', t({ tr: '= EŞİT', en: '= EQUAL' }), '↓', 'mid')}
        {btn('right', t({ tr: 'SAĞ BÜYÜK →', en: 'RIGHT →' }), '→')}
      </div>
    </div>
  )
}
