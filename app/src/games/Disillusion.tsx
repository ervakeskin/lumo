import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { answerFor, makeRefs, makeStimulus, sortNextRule, sortRules, type SCard, type SortRule } from '../core/sorting'
import { useT } from '../core/store'
import { Glyph, PALETTE } from '../components/Glyphs'
import { Feed, SHAKE, StreakBar, useKeys, useLeveler, type Msg, useLater } from '../components/GameBits'

const SHAPE_IDX = [0, 1, 2, 3] // daire, kare, üçgen, baklava
const COLOR_IDX = [0, 1, 2, 3].map((i) => PALETTE[i])
const limitMs = (n: number, streak: number) => Math.max(2200, 5200 - n * 40 - streak * 25)

function CardView({ c, size = 34 }: { c: SCard; size?: number }) {
  return (
    <div className="dis-card-in" style={{ gridTemplateColumns: `repeat(${Math.min(c.count, 2)}, auto)` }}>
      {Array.from({ length: c.count }, (_, i) => <Glyph key={i} i={SHAPE_IDX[c.shape]} color={COLOR_IDX[c.color]} size={size} />)}
    </div>
  )
}

export default function Disillusion({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const lv = useLeveler(startLevel)
  const refs = useRef<SCard[]>(makeRefs(rng)).current
  const S = useRef({ n: 0, streak: 0, since: 0, rule: 'color' as SortRule, shownAt: performance.now(), answered: false, msgId: 0 })
  const [stim, setStim] = useState<SCard>(() => makeStimulus(refs, rng))
  const stimRef = useRef(stim)
  const [rule, setRule] = useState<SortRule>('color')
  const [switched, setSwitched] = useState(false)
  const [showCue, setShowCue] = useState(true)
  const [n, setN] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [picked, setPicked] = useState<{ i: number; ok: boolean; ans: number } | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])
  const limit = limitMs(n, streak)

  // Seviye 3: ipucu kısa süre görünür, sonra gizlenir (çalışma belleği yükü)
  useEffect(() => {
    setShowCue(true)
    if (lv.level < 3) return
    const id = setTimeout(() => setShowCue(false), 900)
    return () => clearTimeout(id)
  }, [n, lv.level])

  const finish = (i: number | null) => {
    const s = S.current
    if (paused || s.answered) return
    s.answered = true
    const ans = answerFor(refs, stimRef.current, s.rule)
    const correct = i === ans
    const rt = performance.now() - s.shownAt
    s.streak = correct ? s.streak + 1 : 0
    setStreak(s.streak)
    session.record({ correct, rt: i === null ? limit : rt, points: Math.max(60, Math.round(240 - rt * 0.03)), tag: s.rule })
    const level = lv.report(correct)
    session.setLevel(level)
    setPicked({ i: i ?? -1, ok: correct, ans })
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? `${Math.round(rt)} ms` : t({ tr: 'Doğru kart vurgulandı', en: 'Correct card highlighted' }), good: correct, id: ++s.msgId })
    later(() => {
      s.n += 1; s.since += 1
      const nr = sortNextRule(s.rule, s.since, level, rng)
      const sw = nr !== s.rule
      if (sw) s.since = 0
      s.rule = nr
      const ns = makeStimulus(refs, rng)
      stimRef.current = ns
      s.answered = false; s.shownAt = performance.now()
      setPicked(null); setSwitched(sw); setRule(nr); setStim(ns); setN(s.n)
    }, correct ? 200 : 750)
  }
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => finish(null), limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, paused, limit])
  useKeys((e) => { const k = Number(e.key); if (k >= 1 && k <= 4) finish(k - 1) })

  const ruleLabel: Record<SortRule, string> = { color: t({ tr: 'RENGE GÖRE', en: 'BY COLOR' }), shape: t({ tr: 'ŞEKLE GÖRE', en: 'BY SHAPE' }), count: t({ tr: 'SAYIYA GÖRE', en: 'BY COUNT' }) }
  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={lv.level}>{t({ tr: `Seviye ${lv.level} · ${sortRules(lv.level).length} kural`, en: `Level ${lv.level} · ${sortRules(lv.level).length} rules` })}</span>
          <motion.div key={`${rule}-${n}`} className={`sm-ask ${rule === 'color' ? 'color' : 'shape'}`} initial={switched ? { scale: 1.35, opacity: 0 } : false} animate={{ scale: 1, opacity: showCue ? 1 : 0.15 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
            <i aria-hidden />{showCue ? ruleLabel[rule] : '?'}
          </motion.div>
      </div>
      <div className="dis-refs">
        {refs.map((r, i) => (
          <motion.button key={i} whileTap={{ scale: 0.94 }} className={`dis-ref glass ${picked ? (i === picked.ans ? 'ok' : i === picked.i ? 'bad' : '') : ''}`} onClick={() => finish(i)} aria-label={`card ${i + 1}`}>
            <CardView c={r} /><kbd className="kbd">{i + 1}</kbd>
          </motion.button>
        ))}
      </div>
      <motion.div className="dis-stim glass" animate={shake}>
        <CardView c={stim} size={44} />
        <div className="lim-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>
      <Feed msg={msg} />
      <StreakBar streak={streak} />
    </div>
  )
}
