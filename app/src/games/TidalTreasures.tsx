import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { tidalLevel, tidalLimitMs, tidalNext, type TItem } from '../core/tidal'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { Glyph, hsl } from '../components/Glyphs'
import { Feed, SHAKE, StreakBar, useKeys, useLater, progressFor, type Msg } from '../components/GameBits'

const REVEAL_MS = 650

interface Wave { item: TItem; isOld: boolean; n: number }

export default function TidalTreasures({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ n: progressFor(tidalLevel, startLevel), seen: [] as TItem[], answered: false, shownAt: 0, streak: 0, msgId: 0 })
  const [wave, setWave] = useState<Wave>(() => ({ ...tidalNext([], S.current.n, rng), n: S.current.n }))
  const [reveal, setReveal] = useState<null | boolean>(null) // null: karar bekleniyor · true/false: doğru/yanlış
  const [found, setFound] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])
  useEffect(() => { S.current.shownAt = performance.now() }, [])

  const limit = tidalLimitMs(wave.n)

  const next = () => {
    const s = S.current
    s.n += 1
    const w = tidalNext(s.seen, s.n, rng)
    s.answered = false
    s.shownAt = performance.now()
    session.setLevel(tidalLevel(s.n))
    setReveal(null)
    setWave({ ...w, n: s.n })
  }

  const resolve = (saysOld: boolean | null) => {
    const s = S.current
    if (s.answered) return
    s.answered = true
    const rt = saysOld === null ? limit : performance.now() - s.shownAt
    const correct = saysOld === wave.isOld
    // Yeni hazine koleksiyona girer; eskiler zaten içeride
    if (!wave.isOld) { s.seen.push(wave.item); setFound(s.seen.length) }
    s.streak = correct ? s.streak + 1 : 0
    setStreak(s.streak)
    session.record({ correct, rt, points: 100 + Math.min(s.streak, 10) * 10, tag: wave.isOld ? 'old' : `new-L${tidalLevel(wave.n)}` })
    if (!correct) { void shake.start(SHAKE); sfx.wrong() }
    const text = correct
      ? (wave.isOld ? t({ tr: 'Evet, bunu bulmuştun!', en: 'Yes, you found this before!' }) : t({ tr: 'Yepyeni bir hazine!', en: 'A brand-new treasure!' }))
      : saysOld === null
        ? t({ tr: 'Süre doldu', en: 'Out of time' })
        : wave.isOld ? t({ tr: 'Bunu zaten bulmuştun', en: 'You had already found this' }) : t({ tr: 'Bu yeniydi, benzer bir hazineyle karıştı', en: 'This one was new — a look-alike fooled you' })
    setMsg({ text, good: correct, id: ++s.msgId })
    setReveal(correct)
    later(next, REVEAL_MS)
  }

  useKeys((e) => {
    if (paused) return
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'y') resolve(false)
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'g') resolve(true)
  })

  // Süre aşımı
  useEffect(() => {
    if (paused || reveal !== null) return
    const id = setTimeout(() => resolve(null), limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wave, paused, reveal, limit])

  return (
    <div className="tt">
      <div className="tt-top">
        <span className="chip lvl">{t({ tr: `Koleksiyon: ${found} hazine`, en: `Collection: ${found} treasures` })}</span>
        <span className="muted small">{t({ tr: 'Dalga bir hazine getirdi. Bunu daha önce buldun mu?', en: 'A wave brought a treasure. Have you found it before?' })}</span>
      </div>
      <motion.div className={`tt-beach ${reveal === true ? 'ok' : reveal === false ? 'bad' : ''}`} animate={shake}>
        <div className="tt-waves" aria-hidden><i /><i /><i /></div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={wave.n} className="tt-wash" initial={{ x: -140, opacity: 0, rotate: -12 }} animate={{ x: 0, opacity: 1, rotate: 0 }} exit={{ x: 140, opacity: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
            <Glyph i={wave.item.shape} color={hsl(wave.item.hue)} size={120} />
          </motion.div>
        </AnimatePresence>
        <div className="tt-bar"><i key={`${wave.n}-${resumeKey}`} className={reveal !== null ? 'done' : ''} style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>
      <Feed msg={msg} />
      <StreakBar streak={streak} />
      <div className="sm-actions">
        <button className="btn choice no" onClick={() => resolve(false)} disabled={reveal !== null}><span>← {t({ tr: 'YENİ', en: 'NEW' })}</span><kbd>←</kbd></button>
        <button className="btn choice yes" onClick={() => resolve(true)} disabled={reveal !== null}><span>{t({ tr: 'BULMUŞTUM', en: 'SEEN' })} →</span><kbd>→</kbd></button>
      </div>
    </div>
  )
}
