import { useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genPuzzle, moveLimit, passesGoal, slidePath, type Dir, type Pos, type Puzzle } from '../core/slide'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { DPad, Feed, SHAKE, dirOfKey, useKeys, type Msg, useLater, progressFor } from '../components/GameBits'

const levelOf = (solved: number) => (solved < 3 ? 1 : solved < 8 ? 2 : 3)

export default function PiratePassage({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ solved: progressFor(levelOf, startLevel), moves: 0, shownAt: performance.now(), busy: false, msgId: 0, over: false })
  const [pz, setPz] = useState<Puzzle>(() => genPuzzle(levelOf(S.current.solved), rng))
  const pzRef = useRef(pz)
  const [pos, setPos] = useState<Pos>(pz.start)
  const posRef = useRef<Pos>(pz.start)
  const [moves, setMoves] = useState(0)
  const [slideMs, setSlideMs] = useState(0)
  const [gold, setGold] = useState(false)
  const [msg, setMsg] = useState<Msg | null>(null)
  const shake = useAnimationControls()

  const level = levelOf(S.current.solved)
  const limit = moveLimit(pz, level)

  const nextPuzzle = () => {
    const s = S.current
    const lv = levelOf(s.solved)
    session.setLevel(lv)
    const np = genPuzzle(lv, rng)
    pzRef.current = np
    posRef.current = np.start
    s.moves = 0; s.busy = false; s.shownAt = performance.now(); s.over = false
    setGold(false); setPz(np); setPos(np.start); setMoves(0); setSlideMs(0)
  }
  const reset = () => {
    const s = S.current
    if (s.busy || s.over) return
    posRef.current = pzRef.current.start
    s.moves = 0
    setSlideMs(0); setPos(pzRef.current.start); setMoves(0)
  }
  const fail = (text: string) => {
    const s = S.current
    s.over = true
    session.record({ correct: false, rt: performance.now() - s.shownAt, tag: 'fail' })
    void shake.start(SHAKE)
    setMsg({ text, good: false, id: ++s.msgId })
    later(nextPuzzle, 1100)
  }
  const go = (d: Dir) => {
    const s = S.current
    if (paused || s.busy || s.over) return
    const cur = pzRef.current
    const path = slidePath(cur.rocks, cur.size, posRef.current, d)
    if (!path.length) { void shake.start({ x: [0, -4, 4, -2, 2, 0], transition: { duration: 0.2 } }); return }
    s.moves += 1
    setMoves(s.moves)
    const stop = path[path.length - 1]
    posRef.current = stop
    s.busy = true
    const ms = 90 * path.length + 80
    setSlideMs(ms)
    setPos(stop)
    const found = passesGoal(path, cur.goal)
    later(() => {
      s.busy = false
      if (found) {
        s.over = true
        const rt = performance.now() - s.shownAt
        const perfect = s.moves <= cur.optimal
        sfx.levelUp()
        session.record({ correct: true, rt, points: 200 + Math.max(0, limit - s.moves) * 40 + (perfect ? 120 : 0), tag: perfect ? 'optimal' : 'ok' })
        s.solved += 1
        setGold(true)
        setMsg({ text: perfect ? t({ tr: 'Hazine! En kısa yol ★', en: 'Treasure! Shortest route ★' }) : t({ tr: `Hazine! ${s.moves} hamle (en iyi ${cur.optimal})`, en: `Treasure! ${s.moves} moves (best ${cur.optimal})` }), good: true, id: ++s.msgId })
        later(nextPuzzle, 800)
      } else if (s.moves >= limit) fail(t({ tr: 'Hamle hakkın bitti', en: 'Out of moves' }))
    }, ms)
  }
  useKeys((e) => {
    const d = dirOfKey(e.key)
    if (d) { e.preventDefault(); go(d) }
    else if (e.key.toLowerCase() === 'r') reset()
  })

  const n = pz.size
  const cell = 100 / n
  const at = ([r, c]: Pos) => ({ left: `${c * cell}%`, top: `${r * cell}%`, width: `${cell}%`, height: `${cell}%` })
  return (
    <div className="pp">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Seviye ${level} · ${n}×${n}`, en: `Level ${level} · ${n}×${n}` })}</span>
        <span className="muted small">{t({ tr: 'Gemi bir yönde kayar, kayaya çarpana kadar durmaz. Hazineden geçince alırsın.', en: 'The ship slides until it hits a rock or wall. Sail through the treasure to collect it.' })}</span>
      </div>
      <motion.div className="sea glass" animate={shake}>
        <div className="sea-in" style={{ aspectRatio: '1' }}>
          {pz.rocks.flatMap((row, r) => row.map((x, c) => x && <div key={`${r}-${c}`} className="rock" style={at([r, c])}><svg viewBox="0 0 40 40"><path d="M6 34 L10 16 L20 6 L32 12 L35 34Z" fill="#6f7a99" /><path d="M10 16 L20 6 L32 12 L22 20Z" fill="#8f9bbb" /></svg></div>))}
          <div className={`chest ${gold ? 'open' : ''}`} style={at(pz.goal)}><svg viewBox="0 0 40 40"><rect x="6" y="18" width="28" height="16" rx="3" fill="#b5772d" /><path d="M6 18 C6 8 34 8 34 18Z" fill="#d99a3e" /><rect x="17" y="18" width="6" height="8" fill="#ffd166" /></svg></div>
          <div className="ship" style={{ ...at(pos), transition: `left ${slideMs}ms linear, top ${slideMs}ms linear` }}><svg viewBox="0 0 40 40"><path d="M6 24 H34 L29 33 H11Z" fill="#8a5a2b" /><path d="M20 6 V24" stroke="#5b3a29" strokeWidth="2.4" /><path d="M20 8 L32 20 H20Z" fill="#f4f1e6" /><path d="M20 10 L10 20 H20Z" fill="#dfe6ff" /></svg></div>
        </div>
      </motion.div>
      <div className="pp-info">
        <span className={moves >= limit - 1 ? 'warn-t' : ''}>{t({ tr: 'Hamle', en: 'Moves' })}: <b>{moves}</b> / {limit}</span>
        <button className="btn ghost sm" onClick={reset}>↺ {t({ tr: 'Baştan (R)', en: 'Restart (R)' })}</button>
      </div>
      <Feed msg={msg} />
      <DPad onPick={go} />
    </div>
  )
}
