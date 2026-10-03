import { useMemo, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { tidalCount, tidalLevel, tidalSet, type TItem } from '../core/tidal'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { Glyph, hsl } from '../components/Glyphs'
import { Feed, SHAKE, type Msg, useLater } from '../components/GameBits'

const LIVES = 3

export default function TidalTreasures({ session, paused, seed }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ round: 0, clicked: new Set<number>(), shownAt: performance.now(), msgId: 0, lives: LIVES, locked: false })
  const build = (round: number) => tidalSet(tidalCount(round), tidalLevel(round), rng)
  const [items, setItems] = useState<TItem[]>(() => build(0))
  const setRef = useRef(items)
  const [order, setOrder] = useState<TItem[]>(() => rng.shuffle(items))
  const [round, setRound] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [found, setFound] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const shake = useAnimationControls()

  const say = (text: string, good: boolean) => setMsg({ text, good, id: ++S.current.msgId })
  const newRound = (r: number) => {
    const s = S.current
    s.round = r; s.clicked = new Set(); s.shownAt = performance.now(); s.locked = false
    const set = build(r)
    setRef.current = set
    setItems(set); setOrder(rng.shuffle(set)); setRound(r); setFound(0)
    session.setLevel(tidalLevel(r))
  }

  const pick = (it: TItem) => {
    const s = S.current
    if (paused || s.locked) return
    const rt = performance.now() - s.shownAt
    if (s.clicked.has(it.id)) {
      session.record({ correct: false, rt })
      s.lives -= 1
      setLives(s.lives)
      say(t({ tr: 'Bunu zaten seçmiştin', en: 'You already picked that one' }), false)
      void shake.start(SHAKE)
      if (s.lives <= 0) return session.end()
      s.locked = true
      later(() => newRound(s.round), 700)
      return
    }
    s.clicked.add(it.id)
    session.record({ correct: true, rt, points: 100 + s.clicked.size * 10 })
    setFound(s.clicked.size)
    if (s.clicked.size === setRef.current.length) {
      sfx.levelUp()
      say(t({ tr: 'Tur tamam!', en: 'Round complete!' }), true)
      s.locked = true
      later(() => newRound(s.round + 1), 500)
    } else {
      s.shownAt = performance.now()
      setOrder(rng.shuffle(setRef.current)) // her seçimden sonra yerler karışır
    }
  }

  const cols = useMemo(() => Math.ceil(Math.sqrt(items.length * 1.2)), [items.length])
  return (
    <div className="tt">
      <div className="tt-top">
        <span className="chip lvl">{t({ tr: `Tur ${round + 1} · ${items.length} nesne`, en: `Round ${round + 1} · ${items.length} items` })}</span>
        <span className="muted small">{t({ tr: 'Daha önce SEÇMEDİĞİN bir nesneyi seç. Yerleri her seferinde karışır.', en: 'Pick an item you have NOT picked before. Positions shuffle every time.' })}</span>
        <div className="mm-errors" aria-label="lives">{Array.from({ length: LIVES }, (_, i) => <span key={i} className={`dot ${i >= lives ? 'used' : ''}`} />)}</div>
      </div>
      <motion.div className="tt-sea" animate={shake} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {order.map((it) => (
          <motion.button key={it.id} layout transition={{ type: 'spring', stiffness: 500, damping: 34 }} className="tt-item" onClick={() => pick(it)} whileTap={{ scale: 0.9 }} aria-label={`item ${it.id + 1}`}>
            <Glyph i={it.shape} color={hsl(it.hue)} size={54} />
          </motion.button>
        ))}
      </motion.div>
      <Feed msg={msg} />
      <span className="muted small">{t({ tr: `Bu turda seçilen: ${found}/${items.length}`, en: `Picked this round: ${found}/${items.length}` })}</span>
    </div>
  )
}
