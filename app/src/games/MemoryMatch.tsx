import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { nbIsMatch, nbNext, nbNextN, NB_BLOCK } from '../core/nback'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { Glyph, PALETTE } from '../components/Glyphs'
import { Feed, SHAKE, StreakBar, useKeys, useLater, type Msg } from '../components/GameBits'

const INTERVAL = 2800
const WARMUP = 1700
const REVEAL_MS = 750

/** Çift yüzlü kart: ön yüz şekil, arka yüz "?" — hafıza yükü görünür hale gelir. */
function Card({ sym, down, mark, verdict }: { sym: number | undefined; down: boolean; mark?: boolean; verdict?: boolean | null }) {
  if (sym === undefined) return <div className="nb-slot empty" />
  return (
    <div className={`nb-slot ${mark ? 'mark' : ''} ${verdict === true ? 'ok' : verdict === false ? 'bad' : ''}`}>
      <motion.div className="nb-flip" initial={false} animate={{ rotateY: down ? 180 : 0 }} transition={{ duration: 0.32, ease: 'easeOut' }}>
        <div className="nb-face front"><Glyph i={sym} color={PALETTE[sym % PALETTE.length]} size={64} /></div>
        <div className="nb-face back">?</div>
      </motion.div>
    </div>
  )
}

export default function MemoryMatch({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ n: startLevel >= 1 && startLevel <= 3 ? startLevel : 1, hist: [] as number[], answered: false, shownAt: 0, streak: 0, blockTotal: 0, blockOk: 0, msgId: 0 })
  const [view, setView] = useState({ tick: 0, n: S.current.n, streak: 0 })
  const [reveal, setReveal] = useState<null | boolean>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  // Yeni uyaran göster
  const present = () => {
    const s = S.current
    s.hist.push(nbNext(s.hist, s.n, rng))
    s.answered = false
    s.shownAt = performance.now()
    setReveal(null)
    setView((v) => ({ tick: v.tick + 1, n: s.n, streak: s.streak }))
  }
  const resolve = (correct: boolean | null, rt: number, wasMatch: boolean) => {
    const s = S.current
    if (correct === null) return present() // ısınma: henüz karşılaştırma yok
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
    // İşaretli kartı çevirip doğru cevabı göster, sonra sıradakine geç
    setReveal(correct)
    later(present, REVEAL_MS)
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

  // İlk gösterim
  useEffect(() => { if (view.tick === 0) present() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hist = S.current.hist
  const warm = hist.length <= view.n
  const limit = warm ? WARMUP : INTERVAL
  // Süre aşımı
  useEffect(() => {
    if (paused || view.tick === 0 || reveal !== null) return
    const id = setTimeout(() => {
      const s = S.current
      if (s.answered) return
      s.answered = true
      if (s.hist.length <= s.n) return present()
      const isMatch = nbIsMatch(s.hist, s.n)
      session.record({ correct: false, rt: INTERVAL, tag: `n${s.n}` })
      void shake.start(SHAKE)
      resolve(false, INTERVAL, isMatch)
    }, limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.tick, paused, limit, reveal])

  // Soldan sağa: n kapalı kart (en soldaki = karşılaştırılacak) + açık güncel kart
  const n = view.n
  const slots = Array.from({ length: n + 1 }, (_, k) => ({ k, idx: hist.length - 1 - (n - k) }))

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={n}>{n}-{t({ tr: 'geri', en: 'back' })}</span>
        <span className="muted small">{warm ? t({ tr: 'Şekilleri aklında tut: kartlar kapanıyor…', en: 'Remember the shapes: cards flip face-down…' }) : t({ tr: `Sağdaki şekil, işaretli kartla (${n} önceki) aynı mı?`, en: `Does the shape on the right match the marked card (${n} back)?` })}</span>
      </div>
      <motion.div className="nb-belt glass" animate={shake}>
        {slots.map(({ k, idx }) => (
          <div key={idx >= 0 ? `s${idx}` : `e${k}`} className="nb-col">
            <span className="nb-tag">{k === 0 ? t({ tr: `${n} önce`, en: `${n} back` }) : k === n ? t({ tr: 'şimdi', en: 'now' }) : ' '}</span>
            <Card sym={idx >= 0 ? hist[idx] : undefined} down={k < n && !(k === 0 && reveal !== null)} mark={k === 0 && !warm} verdict={k === 0 ? reveal : null} />
          </div>
        ))}
      </motion.div>
      <div className="nb-bar"><i key={`${view.tick}-${resumeKey}`} className={reveal !== null ? 'done' : ''} style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      <Feed msg={msg} />
      <StreakBar streak={view.streak} />
      <div className="sm-actions">
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice no" onClick={() => answer(false)}><span>← {t({ tr: 'FARKLI', en: 'DIFFERENT' })}</span><kbd>←</kbd></motion.button>
        <motion.button whileTap={{ scale: 0.94 }} className="btn choice yes" onClick={() => answer(true)}><span>{t({ tr: 'AYNI', en: 'SAME' })} →</span><kbd>→</kbd></motion.button>
      </div>
    </div>
  )
}
