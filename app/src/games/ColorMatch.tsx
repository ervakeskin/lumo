import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { smNextLevel, smShouldMatch, SM_BLOCK } from '../core/adaptive'
import { cmIsMatch, cmLimitMs, cmMakeTrial, cmNextRule, INK_HEX, INK_NAME, type ColorTrial, type Rule } from '../core/stroop'
import { sfx } from '../core/audio'
import { useLang, useT } from '../core/store'

interface Msg { text: string; good: boolean; id: number }

export default function ColorMatch({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const lang = useLang()
  const rng = useRef(makeRng(seed)).current
  const S = useRef({
    n: 0, streak: 0, matches: 0, sinceSwitch: 0, answered: false, shownAt: performance.now(), msgId: 0,
    level: startLevel >= 1 && startLevel <= 3 ? startLevel : 1, blockTotal: 0, blockCorrect: 0,
  })
  const make = (rule: Rule) => {
    const st = S.current
    const isMatch = smShouldMatch(st.matches, st.n, rng.next())
    if (isMatch) st.matches += 1
    return cmMakeTrial(rule, isMatch, rng)
  }
  const [tr, setTr] = useState<ColorTrial>(() => make(rng.next() < 0.5 ? 'meaning' : 'ink'))
  const trRef = useRef(tr)
  const [n, setN] = useState(0)
  const [switched, setSwitched] = useState(false)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(S.current.level)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  const limit = cmLimitMs(n, streak) + (switched ? 300 : 0)

  const next = (correct: boolean | null, rt: number) => {
    const st = S.current
    const cur = trRef.current
    if (correct !== null) {
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
      setMsg({ text: correct ? `${Math.round(rt)} ms` : cur.isMatch ? t({ tr: 'Eşleşiyordu', en: 'It matched' }) : t({ tr: 'Eşleşmiyordu', en: 'No match' }), good: correct, id: ++st.msgId })
    }
    st.n += 1
    st.sinceSwitch += 1
    const rule = cmNextRule(cur.rule, st.sinceSwitch, st.level, rng.next())
    const sw = rule !== cur.rule
    if (sw) st.sinceSwitch = 0
    const nt = make(rule)
    trRef.current = nt
    st.answered = false
    st.shownAt = performance.now()
    setSwitched(sw)
    setTr(nt)
    setN(st.n)
  }

  const answer = (saysYes: boolean) => {
    const st = S.current
    if (paused || st.answered) return
    st.answered = true
    const correct = saysYes === cmIsMatch(trRef.current)
    const rt = performance.now() - st.shownAt
    session.record({ correct, rt, points: Math.max(40, Math.round(220 - rt * 0.08)), tag: trRef.current.rule })
    if (!correct) void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
    next(correct, rt)
  }
  const answerRef = useRef(answer)
  answerRef.current = answer

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => {
      const st = S.current
      if (st.answered) return
      st.answered = true
      session.record({ correct: false, rt: limit, tag: trRef.current.rule })
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
      next(false, limit)
    }, limit)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, paused, limit])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'e') answerRef.current(true)
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'h') answerRef.current(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const word = (w: { word: keyof typeof INK_NAME; ink: keyof typeof INK_HEX }) => (
    <span className="cm-word" style={{ color: INK_HEX[w.ink] }}>{INK_NAME[w.word][lang]}</span>
  )
  const levelName = ['', t({ tr: 'Seviye 1 · Yavaş değişen kural', en: 'Level 1 · Slow rule changes' }), t({ tr: 'Seviye 2 · Hızlı değişen kural', en: 'Level 2 · Fast rule changes' }), t({ tr: 'Seviye 3 · Her kartta yeni kural', en: 'Level 3 · New rule every card' })][level]

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={`l${level}`}>{levelName}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={`${tr.rule}-${n}`} className={`sm-ask ${tr.rule === 'meaning' ? 'shape' : 'color'}`} initial={switched ? { scale: 1.35, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
            <i aria-hidden />
            {tr.rule === 'meaning'
              ? t({ tr: 'ÜSTTEKİ KELİMENİN ANLAMI = ALTTAKİ YAZI RENGİ?', en: 'TOP WORD MEANING = BOTTOM INK COLOR?' })
              : t({ tr: 'İKİ YAZININ RENGİ AYNI MI?', en: 'SAME INK COLOR ON BOTH?' })}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div className="cm-board glass" animate={shake}>
        <div className="cm-card">{word(tr.top)}</div>
        <div className="cm-sep" aria-hidden />
        <div className="cm-card">{word(tr.bottom)}</div>
        <div className="lim-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>

      <div className="sm-feed" aria-live="polite">
        {msg && <motion.span key={msg.id} className={`sm-msg ${msg.good ? 'good' : 'bad'}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{msg.good ? '✓ ' : '✗ '}{msg.text}</motion.span>}
      </div>
      <div className="sm-streak">
        {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < streak ? 'on' : ''} />)}
      </div>
      <div className="sm-actions">
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice no" onClick={() => answer(false)}><span>← {t({ tr: 'HAYIR', en: 'NO' })}</span><kbd>←</kbd></motion.button>
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice yes" onClick={() => answer(true)}><span>{t({ tr: 'EVET', en: 'YES' })} →</span><kbd>→</kbd></motion.button>
      </div>
    </div>
  )
}
