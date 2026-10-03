import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { smIntervalMs, smNearMissRatio, smNextAsk, smNextLevel, smShouldMatch, SM_BLOCK, SM_SWITCH_GRACE_MS, type SmDim } from '../core/adaptive'
import { sfx } from '../core/audio'
import { useT } from '../core/store'

const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'hex', 'star'] as const
const COLORS = ['#FF6B6B', '#4C9AFF', '#22C7A9', '#FFC145', '#A78BFA']
export interface Sym { shape: (typeof SHAPES)[number]; color: string }
const OTHER: Record<SmDim, SmDim> = { color: 'shape', shape: 'color' }

export function Shape({ s, size = 140 }: { s: Sym; size?: number }) {
  const p = { fill: s.color }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {s.shape === 'circle' && <circle cx="50" cy="50" r="38" {...p} />}
      {s.shape === 'square' && <rect x="14" y="14" width="72" height="72" rx="10" {...p} />}
      {s.shape === 'triangle' && <path d="M50 12 L90 84 H10 Z" strokeLinejoin="round" {...p} />}
      {s.shape === 'diamond' && <path d="M50 8 L92 50 L50 92 L8 50 Z" {...p} />}
      {s.shape === 'hex' && <path d="M50 8 L86 29 V71 L50 92 L14 71 V29 Z" {...p} />}
      {s.shape === 'star' && <path d="M50 8 L61 38 L93 40 L68 60 L77 92 L50 74 L23 92 L32 60 L7 40 L39 38 Z" {...p} />}
    </svg>
  )
}

interface Msg { text: string; good: boolean; id: number }
interface View {
  hist: Sym[]
  /** mevcut kartta hangi özellik soruluyor */
  ask: SmDim
  /** bu deneme kural değişimi miydi (ek süre + vurgu) */
  switched: boolean
  n: number
  streak: number
  level: number
  msg: Msg | null
}

const RING_R = 118
const RING_C = 2 * Math.PI * RING_R

export default function SpeedMatch({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const rngRef = useRef(makeRng(seed))
  const rng = rngRef.current
  const rand = (): Sym => ({ shape: rng.pick(SHAPES), color: rng.pick(COLORS) })

  const S = useRef({ trials: 0, matches: 0, best: 0, blockTotal: 0, blockCorrect: 0, sinceSwitch: 0, answered: false, shownAt: performance.now(), msgId: 0 })
  const [v, setV] = useState<View>(() => ({
    hist: [rand()],
    ask: rng.next() < 0.5 ? 'color' : 'shape',
    switched: false,
    n: 0, streak: 0, msg: null,
    level: startLevel >= 1 && startLevel <= 3 ? startLevel : 1,
  }))
  // vRef her değişiklikte SENKRON güncellenir (render'ı beklemez): hızlı art arda basışlarda
  // bayat state ile yanlış kartın değerlendirilmesini önler.
  const vRef = useRef(v)
  const shake = useAnimationControls()
  const [resumeKey, setResumeKey] = useState(0)
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  const commit = (nv: View) => { vRef.current = nv; setV(nv) }
  const matches = (cur: View) => {
    const a = cur.hist[cur.hist.length - 1]
    const b = cur.hist[cur.hist.length - 2]
    return a[cur.ask] === b[cur.ask]
  }

  /** Sıradaki kartı üret: kural (ask) için match/non-match; diğer özellik çeldirici olarak oynatılır. */
  const makeNext = (prev: Sym, ask: SmDim, level: number): { next: Sym; isMatch: boolean } => {
    const st = S.current
    const isMatch = smShouldMatch(st.matches, st.trials, rng.next())
    const other = OTHER[ask]
    const pool = (d: SmDim) => (d === 'color' ? COLORS : SHAPES) as readonly string[]
    const n = { ...prev } as Record<SmDim, string>
    const p = prev as Record<SmDim, string>
    if (isMatch) {
      n[ask] = p[ask]
      // Kuralın önemini vurgula: sorulmayan özellik çoğu zaman farklı (tam kart aynı görünmez)
      n[other] = rng.next() < 0.6 ? rng.pick(pool(other).filter((x) => x !== p[other])) : p[other]
    } else {
      n[ask] = rng.pick(pool(ask).filter((x) => x !== p[ask]))
      // Yakın çeldirici: sorulmayan özellik AYNI kalır → yanıltıcı benzerlik
      n[other] = rng.next() < smNearMissRatio(level) ? p[other] : rng.pick(pool(other))
    }
    return { next: n as unknown as Sym, isMatch }
  }

  const advance = (result: { correct: boolean; rt: number; isMatch: boolean } | null) => {
    const st = S.current
    const cur = vRef.current
    let { streak, level } = cur
    let msg = cur.msg
    if (result) {
      streak = result.correct ? streak + 1 : 0
      st.best = Math.max(st.best, streak)
      st.blockTotal += 1
      if (result.correct) st.blockCorrect += 1
      const dimName = cur.ask === 'color' ? t({ tr: 'Renk', en: 'Color' }) : t({ tr: 'Şekil', en: 'Shape' })
      msg = {
        text: result.correct ? `${Math.round(result.rt)} ms` : `${dimName} ${result.isMatch ? t({ tr: 'aynıydı', en: 'matched' }) : t({ tr: 'farklıydı', en: 'differed' })}`,
        good: result.correct,
        id: ++st.msgId,
      }
      if (st.blockTotal >= SM_BLOCK) {
        const nl = smNextLevel(level, st.blockCorrect / st.blockTotal)
        if (nl > level) sfx.levelUp()
        level = nl
        st.blockTotal = 0
        st.blockCorrect = 0
      }
    }
    session.setLevel(level)
    // Sıradaki kartın kuralı
    st.sinceSwitch += 1
    const nextAsk = smNextAsk(cur.ask, st.sinceSwitch, level, rng.next())
    const switched = nextAsk !== cur.ask
    if (switched) st.sinceSwitch = 0
    const { next, isMatch } = makeNext(cur.hist[cur.hist.length - 1], nextAsk, level)
    st.trials += 1
    if (isMatch) st.matches += 1
    st.answered = false
    st.shownAt = performance.now()
    commit({ hist: [...cur.hist, next].slice(-3), ask: nextAsk, switched, n: cur.n + 1, streak, level, msg })
  }

  const answer = (saysYes: boolean) => {
    const cur = vRef.current
    if (paused || S.current.answered || cur.hist.length < 2) return
    S.current.answered = true
    const isMatch = matches(cur)
    const correct = saysYes === isMatch
    const rt = performance.now() - S.current.shownAt
    session.record({ correct, rt, points: Math.max(40, Math.round(200 - rt * 0.1)), tag: `L${cur.level}-${cur.ask}` })
    if (!correct) void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
    advance({ correct, rt, isMatch })
  }
  const answerRef = useRef(answer)
  answerRef.current = answer

  // Süre aşımı = yanlış. Kural değişen kartta ek süre. İlk kart (karşılaştırma yok) kısa gösterilip geçilir.
  const hasRef = v.hist.length >= 2
  const limit = hasRef ? smIntervalMs(v.n, v.streak) + (v.switched ? SM_SWITCH_GRACE_MS : 0) : 1000
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => {
      const cur = vRef.current
      if (S.current.answered) return
      if (cur.hist.length < 2) return advance(null)
      S.current.answered = true
      const isMatch = matches(cur)
      session.record({ correct: false, rt: limit, tag: `L${cur.level}-${cur.ask}` })
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
      advance({ correct: false, rt: limit, isMatch })
    }, limit)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.n, paused, limit])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'e') answerRef.current(true)
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'h') answerRef.current(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const cur = v.hist[v.hist.length - 1]
  const prev = v.hist.length >= 2 ? v.hist[v.hist.length - 2] : null
  const levelName = ['', t({ tr: 'Seviye 1 · Yavaş değişen kural', en: 'Level 1 · Slow rule changes' }), t({ tr: 'Seviye 2 · Hızlı değişen kural', en: 'Level 2 · Fast rule changes' }), t({ tr: 'Seviye 3 · Her kartta yeni kural', en: 'Level 3 · New rule every card' })][v.level]
  const hot = v.streak >= 5
  const askLabel = v.ask === 'color' ? t({ tr: 'RENK', en: 'COLOR' }) : t({ tr: 'ŞEKİL', en: 'SHAPE' })

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={`l${v.level}`}>{levelName}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={`${v.ask}-${v.n}`} className={`sm-ask ${v.ask}`} initial={v.switched ? { scale: 1.35, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
            <i aria-hidden />
            {t({ tr: `${askLabel} önceki kartla aynı mı?`, en: `Is the ${askLabel} the same as the previous card?` })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sm-board">
        <div className="sm-prev" aria-label={t({ tr: 'Önceki kart', en: 'Previous card' })}>
          <span className="muted small">{t({ tr: 'ÖNCEKİ', en: 'PREVIOUS' })}</span>
          <div className={`sm-slot ${prev ? 'target' : 'empty'}`}>{prev && <Shape s={prev} size={58} />}</div>
        </div>
        <span className="sm-arrow" aria-hidden>→</span>

        <motion.div className={`sm-card ${hot ? 'hot' : ''} ${v.msg?.good === false ? 'bad' : ''}`} animate={shake}>
          <svg className="ring" viewBox="0 0 260 260" aria-hidden>
            <circle cx="130" cy="130" r={RING_R} className="ring-bg" />
            <circle
              key={`${v.n}-${resumeKey}`}
              cx="130" cy="130" r={RING_R}
              className={`ring-fg ${hasRef ? '' : 'idle'}`}
              style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running', strokeDasharray: RING_C }}
            />
          </svg>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={v.n} className="sm-cur" initial={{ x: 90, opacity: 0, scale: 0.85 }} animate={{ x: 0, opacity: 1, scale: 1 }} exit={{ x: -90, opacity: 0, scale: 0.85 }} transition={{ type: 'spring', stiffness: 460, damping: 32 }}>
              <Shape s={cur} size={130} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="sm-feed" aria-live="polite">
        <AnimatePresence mode="wait">
          {v.msg && (
            <motion.span key={v.msg.id} className={`sm-msg ${v.msg.good ? 'good' : 'bad'}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              {v.msg.good ? '✓ ' : '✗ '}{v.msg.text}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="sm-streak" title="streak">
        {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < v.streak ? 'on' : ''} />)}
        <span className="muted small">{v.streak >= 10 ? t({ tr: 'ATEŞTE!', en: 'ON FIRE!' }) : v.streak >= 5 ? `×${1 + Math.floor(v.streak / 5) * 0.25}` : ''}</span>
      </div>

      <div className="sm-actions">
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice no" onClick={() => answer(false)}>
          <span>← {t({ tr: 'FARKLI', en: 'DIFFERENT' })}</span><kbd>←</kbd>
        </motion.button>
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice yes" onClick={() => answer(true)}>
          <span>{t({ tr: 'AYNI', en: 'SAME' })} →</span><kbd>→</kbd>
        </motion.button>
      </div>
    </div>
  )
}
