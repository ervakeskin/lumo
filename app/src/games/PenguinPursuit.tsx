import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genMaze, mazeSize, pathTo, pickFish, rivalMs, step, type Cell, type MDir, type Maze } from '../core/maze'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { DPad, Feed, SHAKE, dirOfKey, useKeys, type Msg, useLater, progressFor } from '../components/GameBits'

interface Round { maze: Maze; player: Cell; rival: Cell; fish: Cell; rivalPath: Cell[] }
const levelOf = (wins: number) => (wins < 2 ? 1 : wins < 5 ? 2 : 3)

function makeRound(level: number, rng: ReturnType<typeof makeRng>): Round {
  const n = mazeSize(level)
  const maze = genMaze(n, n, rng)
  const player: Cell = [n - 1, 0], rival: Cell = [0, n - 1]
  const fish = pickFish(maze, player, rival, rng, Math.floor(n * 0.8), 1)
  return { maze, player, rival, fish, rivalPath: pathTo(maze, rival, fish) }
}

export default function PenguinPursuit({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ wins: progressFor(levelOf, startLevel), round: 0, shownAt: performance.now(), over: false, msgId: 0, rivalStep: 0 })
  const [rd, setRd] = useState<Round>(() => makeRound(levelOf(S.current.wins), rng))
  const rdRef = useRef(rd)
  const [pl, setPl] = useState<Cell>(rd.player)
  const plRef = useRef<Cell>(rd.player)
  const [rv, setRv] = useState<Cell>(rd.rival)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [tick, setTick] = useState(0)
  const shake = useAnimationControls()
  const level = levelOf(S.current.wins)

  const nextRound = () => {
    const s = S.current
    s.round += 1
    const lv = levelOf(s.wins)
    session.setLevel(lv)
    const nr = makeRound(lv, rng)
    rdRef.current = nr
    plRef.current = nr.player
    s.over = false; s.rivalStep = 0; s.shownAt = performance.now()
    setRd(nr); setPl(nr.player); setRv(nr.rival); setTick((x) => x + 1)
  }
  const end = (won: boolean) => {
    const s = S.current
    if (s.over) return
    s.over = true
    const rt = performance.now() - s.shownAt
    if (won) { s.wins += 1; sfx.levelUp() } else void shake.start(SHAKE)
    session.record({ correct: won, rt, points: 260 + Math.max(0, 40 - Math.floor(rt / 400)) * 5, tag: won ? 'win' : 'lose' })
    setMsg({ text: won ? t({ tr: 'Balığı önce sen aldın!', en: 'You got the fish first!' }) : t({ tr: 'Rakip önce yakaladı', en: 'The rival got it first' }), good: won, id: ++s.msgId })
    later(nextRound, 1000)
  }

  const move = (d: MDir) => {
    const s = S.current
    if (paused || s.over) return
    const nx = step(rdRef.current.maze, plRef.current, d)
    if (!nx) return
    plRef.current = nx
    setPl(nx)
    const f = rdRef.current.fish
    if (nx[0] === f[0] && nx[1] === f[1]) end(true)
  }
  useKeys((e) => { const d = dirOfKey(e.key); if (d) { e.preventDefault(); move(d) } })

  // Rakip en kısa yolda ilerler; duraklatınca durur
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => {
      const s = S.current
      if (s.over) return
      const p = rdRef.current.rivalPath
      const nx = p[s.rivalStep]
      if (!nx) return
      s.rivalStep += 1
      setRv(nx)
      const f = rdRef.current.fish
      if (nx[0] === f[0] && nx[1] === f[1]) end(false)
    }, rivalMs(level, S.current.round))
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rv, paused, tick])

  const n = rd.maze.w
  return (
    <div className="pp">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Seviye ${level} · ${n}×${n} labirent`, en: `Level ${level} · ${n}×${n} maze` })}</span>
        <span className="muted small">{t({ tr: 'Mavi penguen sensin. Kırmızı rakipten önce balığa ulaş!', en: 'You are the blue penguin. Reach the fish before the red rival!' })}</span>
      </div>
      <motion.div className="maze glass" animate={shake} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {rd.maze.open.flatMap((row, r) => row.map((o, c) => (
          <div key={`${r}-${c}`} className="mz-cell" style={{ borderTopColor: o.up ? 'transparent' : undefined, borderBottomColor: o.down ? 'transparent' : undefined, borderLeftColor: o.left ? 'transparent' : undefined, borderRightColor: o.right ? 'transparent' : undefined }}>
            {rd.fish[0] === r && rd.fish[1] === c && <svg viewBox="0 0 40 40" className="mz-item"><path d="M6 20 C14 8 28 8 34 20 C28 32 14 32 6 20Z" fill="#ff9f43" /><path d="M6 20 L1 12 V28Z" fill="#ff7a1a" /><circle cx="27" cy="18" r="2" fill="#1b1024" /></svg>}
            {pl[0] === r && pl[1] === c && <Penguin color="#4C9AFF" />}
            {rv[0] === r && rv[1] === c && <Penguin color="#ef5b5b" />}
          </div>
        )))}
      </motion.div>
      <Feed msg={msg} />
      <DPad onPick={move} />
    </div>
  )
}
function Penguin({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" className="mz-item mz-pg" aria-hidden>
      <ellipse cx="20" cy="23" rx="12" ry="14" fill={color} />
      <ellipse cx="20" cy="26" rx="7" ry="9" fill="#f4f1e6" />
      <circle cx="16" cy="15" r="2" fill="#fff" /><circle cx="24" cy="15" r="2" fill="#fff" />
      <circle cx="16" cy="15" r="1" fill="#111" /><circle cx="24" cy="15" r="1" fill="#111" />
      <path d="M17 19 L23 19 L20 23Z" fill="#ffc145" />
    </svg>
  )
}
