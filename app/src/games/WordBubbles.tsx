import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { STEMS, checkWord, trLower, wordPoints } from '../core/words'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { Feed, SHAKE, type Msg } from '../components/GameBits'

const STEM_SEC = 30

export default function WordBubbles({ session, paused, seed, timeLeft }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const stems = useMemo(() => rng.shuffle(STEMS), [rng])
  const S = useRef({ used: [] as string[], msgId: 0, count: 0, bid: 0 })
  const [val, setVal] = useState('')
  const [bubbles, setBubbles] = useState<{ id: number; w: string; x: number }[]>([])
  const [msg, setMsg] = useState<Msg | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const shake = useAnimationControls()

  // Kök zamana bağlı döner (toplam süre − kalan süre)
  const total = useRef(Math.ceil(timeLeft)).current // oyun başında kalan süre = toplam süre
  const elapsed = Math.max(0, total - Math.ceil(timeLeft))
  const stemIdx = Math.floor(elapsed / STEM_SEC) % stems.length
  const stem = stems[stemIdx]
  const stemSecLeft = STEM_SEC - (elapsed % STEM_SEC)
  useEffect(() => { inputRef.current?.focus() }, [stem, paused])

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (paused) return
    const w = trLower(val)
    if (!w) return
    const res = checkWord(stem, w, S.current.used)
    const say = (text: string, good: boolean) => setMsg({ text, good, id: ++S.current.msgId })
    if (res === 'ok') {
      S.current.used.push(w)
      S.current.count += 1
      session.record({ correct: true, points: wordPoints(w), tag: `len${w.length}` })
      session.setLevel(S.current.count)
      setBubbles((b) => [...b.slice(-11), { id: ++S.current.bid, w, x: 6 + rng.next() * 80 }])
      say(`+${wordPoints(w)}`, true)
      setVal('')
    } else {
      void shake.start(SHAKE)
      sfx.wrong()
      // Sözlük küçük olduğundan bilinmeyen sözcük ceza değildir: skor/kombo etkilenmez.
      if (res === 'dup') say(t({ tr: 'Bunu zaten yazdın', en: 'Already used' }), false)
      else if (res === 'stem') say(t({ tr: `"${stem}" ile başlamalı`, en: `Must start with "${stem}"` }), false)
      else say(t({ tr: 'Sözlükte yok (sözlük sürekli genişliyor)', en: 'Not in dictionary (the dictionary keeps growing)' }), false)
    }
  }

  return (
    <div className="wb">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Kök değişimine ${stemSecLeft} sn`, en: `Stem changes in ${stemSecLeft}s` })}</span>
        <span className="muted small">{t({ tr: 'Bu kökle başlayan Türkçe sözcükler yaz, Enter ile gönder. Uzun sözcük daha çok puan.', en: 'Type Turkish words starting with this stem, press Enter. Longer words score more.' })}</span>
      </div>
      <motion.div className="wb-stem glass" animate={shake} key={stem}>
        <span>{stem.toLocaleUpperCase('tr')}</span><i>…</i>
      </motion.div>
      <div className="wb-sea" aria-hidden>
        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.span key={b.id} className="wb-bubble" style={{ left: `${b.x}%` }} initial={{ y: 60, opacity: 0, scale: 0.6 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>{b.w}</motion.span>
          ))}
        </AnimatePresence>
      </div>
      <form onSubmit={submit} className="wb-form">
        <input ref={inputRef} value={val} onChange={(e) => setVal(e.target.value)} placeholder={t({ tr: `${stem}… ile başlayan sözcük`, en: `word starting with ${stem}…` })} autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="word" />
        <button className="btn primary" type="submit">↵</button>
      </form>
      <Feed msg={msg} />
      <span className="muted small">{t({ tr: `Bulunan: ${S.current.count}`, en: `Found: ${S.current.count}` })}</span>
    </div>
  )
}
