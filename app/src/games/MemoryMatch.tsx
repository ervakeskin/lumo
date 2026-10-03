import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { nbIsMatch, nbNext, nbNextN, NB_BLOCK } from '../core/nback'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { Glyph, PALETTE } from '../components/Glyphs'
import { Feed, SHAKE, StreakBar, useKeys, type Msg } from '../components/GameBits'

const INTERVAL = 2800

export default function MemoryMatch({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ n: startLevel >= 1 && startLevel <= 3 ? startLevel : 1, hist: [] as number[], answered: false, shownAt: 0, streak: 0, blockTotal: 0, blockOk: 0, msgId: 0 })
  const [view, setView] = useState({ sym: -1, tick: 0, n: S.current.n, streak: 0 })
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  // Yeni uyaran göster
  const present = () => {
    const s = S.current
    const sym = nbNext(s.hist, s.n, rng)
    s.hist.push(sym)
    s.answered = false
    s.shownAt = performance.now()
    setView((v) => ({ sym, tick: v.tick + 1, n: s.n, streak: s.streak }))
  }
  const resolve = (correct: boolean | null, rt: number, wasMatch: boolean) => {
    const s = S.current
    if (correct !== null) {
      s.streak = correct ? s.streak + 1 : 0
      s.blockTotal += 1
      if (correct) s.blockOk += 1
      if (s.blockTotal >= NB_BLOCK) {
        const nn = nbNextN(s.n, s.blockOk / s.blockTotal)
        if (nn > s.n) sfx.levelUp()
        s.n = nn
        s.blockTotal = 0
        s.blockOk = 0
      }
      session.setLevel(s.n)
      setMsg({ text: correct ? `${Math.round(rt)} ms` : wasMatch ? t({ tr: 'Eşleşiyordu', en: 'It matched' }) : t({ tr: 'Eşleşmiyordu', en: 'No match' }), good: correct, id: ++s.msgId })
    }
    present()
  }
  const answer = (saysMatch: boolean) => {
    const s = S.current
    if (paused || s.answered || s.hist.length <= s.n) return
    s.answered = true
    const isMatch = nbIsMatch(s.hist, s.n)
    const correct = saysMatch === isMatch
    const rt = performance.now() - s.shownAt
    session.record({ correct, rt, points: Math.max(60, Math.round(240 - rt * 0.06)), tag: `n${s.n}` })
    if (!correct) void shake.start(SHAKE)
    resolve(correct, rt, isMatch)
  }
  useKeys((e) => {
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'e') answer(true)
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'h') answer(false)
  })

  // İlk gösterim + süre aşımı
  useEffect(() => {
    if (view.tick === 0) { present(); return }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const limit = S.current.hist.length <= S.current.n ? 1700 : INTERVAL
  useEffect(() => {
    if (paused || view.tick === 0) return
    const id = setTimeout(() => {
      const s = S.current
      if (s.answered) return
      s.answered = true
      if (s.hist.length <= s.n) return present() // henüz karşılaştırma yok
      const isMatch = nbIsMatch(s.hist, s.n)
      session.record({ correct: false, rt: INTERVAL, tag: `n${s.n}` })
      void shake.start(SHAKE)
      resolve(false, INTERVAL, isMatch)
    }, limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.tick, paused, limit])

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={view.n}>{view.n}-{t({ tr: 'geri', en: 'back' })}</span>
        <span className="muted small">{S.current.hist.length <= view.n ? t({ tr: 'Şekilleri aklında tut…', en: 'Hold the shapes in mind…' }) : t({ tr: `Bu şekil, ${view.n} adım ÖNCEKİ ile aynı mı?`, en: `Is this the same as ${view.n} step(s) BACK?` })}</span>
      </div>
      <motion.div className="nb-card glass" animate={shake}>
        <svg className="ring" viewBox="0 0 260 260" aria-hidden>
          <circle cx="130" cy="130" r="118" className="ring-bg" />
          <circle key={`${view.tick}-${resumeKey}`} cx="130" cy="130" r="118" className="ring-fg" style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running', strokeDasharray: 741 }} />
        </svg>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={view.tick} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }}>
            {view.sym >= 0 && <Glyph i={view.sym} color={PALETTE[view.sym % PALETTE.length]} size={130} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <Feed msg={msg} />
      <StreakBar streak={view.streak} />
      <div className="sm-actions">
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice no" onClick={() => answer(false)}><span>← {t({ tr: 'FARKLI', en: 'DIFFERENT' })}</span><kbd>←</kbd></motion.button>
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice yes" onClick={() => answer(true)}><span>{t({ tr: 'AYNI', en: 'SAME' })} →</span><kbd>→</kbd></motion.button>
      </div>
    </div>
  )
}
