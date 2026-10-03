import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { BALL_R, H, W, genBumpers, pinballBumperCount, pinballShowMs, pinballSlots, simulate, type Bumper, type SimResult } from '../core/pinball'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import { Feed, SHAKE, type Msg, useLater } from '../components/GameBits'

const levelOf = (round: number) => (round < 4 ? 1 : round < 9 ? 2 : 3)
const GUESS_MS = 12000
type Phase = 'show' | 'guess' | 'reveal'
interface Round { bumpers: Bumper[]; x0: number; vx0: number; slots: number; sim: SimResult }

export default function PinballRecall({ session, paused, seed }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const ivRef = useRef<ReturnType<typeof setInterval>>(undefined)
  useEffect(() => () => clearInterval(ivRef.current), [])
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ round: 0, shownAt: 0, msgId: 0, answered: false })
  const make = (round: number): Round => {
    const lv = levelOf(round)
    const slots = pinballSlots(lv)
    const bumpers = genBumpers(pinballBumperCount(round), rng)
    const x0 = 0.2 + rng.next() * 0.6
    const vx0 = (rng.next() - 0.5) * 0.2
    return { bumpers, x0, vx0, slots, sim: simulate(bumpers, x0, vx0, slots) }
  }
  const [rd, setRd] = useState<Round>(() => make(0))
  const [phase, setPhase] = useState<Phase>('show')
  const [ball, setBall] = useState<[number, number]>([rd.x0, BALL_R])
  const [chosen, setChosen] = useState<number | null>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [leftMs, setLeftMs] = useState(pinballShowMs(1))
  const shake = useAnimationControls()
  const level = levelOf(S.current.round)

  // Göster: tamponlar görünür, sayaç iner → tahmin
  useEffect(() => {
    if (phase !== 'show' || paused) return
    const id = setInterval(() => setLeftMs((l) => l - 100), 100)
    return () => clearInterval(id)
  }, [phase, paused])
  useEffect(() => {
    if (phase === 'show' && leftMs <= 0) { S.current.shownAt = performance.now(); setPhase('guess') }
  }, [leftMs, phase])
  // Tahmin süresi
  useEffect(() => {
    if (phase !== 'guess' || paused) return
    const id = setTimeout(() => guess(null), GUESS_MS)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused])

  const nextRound = () => {
    const s = S.current
    s.round += 1
    s.answered = false
    const nr = make(s.round)
    session.setLevel(levelOf(s.round))
    setRd(nr); setBall([nr.x0, BALL_R]); setChosen(null); setLeftMs(pinballShowMs(levelOf(s.round))); setPhase('show')
  }
  const guess = (slot: number | null) => {
    const s = S.current
    if (paused || s.answered || phase !== 'guess') return
    s.answered = true
    const correct = slot === rd.sim.slot
    const rt = performance.now() - s.shownAt
    setChosen(slot)
    session.record({ correct, rt, points: 280 + rd.bumpers.length * 20, tag: `b${rd.bumpers.length}` })
    if (!correct) { void shake.start(SHAKE); sfx.wrong() }
    setMsg({ text: correct ? t({ tr: 'Doğru yuva!', en: 'Right slot!' }) : t({ tr: `Top ${rd.sim.slot + 1}. yuvaya düştü`, en: `Ball landed in slot ${rd.sim.slot + 1}` }), good: correct, id: ++s.msgId })
    setPhase('reveal')
    // Yörüngeyi oynat (zamanlayıcı tabanlı: sekme arka planda bile ilerler)
    let i = 0
    const path = rd.sim.path
    const step = Math.max(1, Math.ceil(path.length / 90))
    clearInterval(ivRef.current)
    const iv = setInterval(() => {
      i += step
      if (i >= path.length) { clearInterval(iv); setBall(path[path.length - 1]); later(nextRound, 900); return }
      setBall(path[i])
    }, 22)
    ivRef.current = iv
  }

  const bumpersVisible = phase !== 'guess'
  const slotW = W / rd.slots
  const slotBtns = useMemo(() => Array.from({ length: rd.slots }, (_, i) => i), [rd.slots])
  return (
    <div className="pb">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Seviye ${level} · ${rd.bumpers.length} tampon · ${rd.slots} yuva`, en: `Level ${level} · ${rd.bumpers.length} bumpers · ${rd.slots} slots` })}</span>
        <span className="muted small">
          {phase === 'show' ? t({ tr: `Tamponları ezberle (${Math.max(0, Math.ceil(leftMs / 1000))} sn)…`, en: `Memorize the bumpers (${Math.max(0, Math.ceil(leftMs / 1000))}s)…` }) : phase === 'guess' ? t({ tr: 'Top hangi yuvaya düşecek? Bir yuvaya dokun.', en: 'Which slot will the ball land in? Tap a slot.' }) : ''}
        </span>
      </div>
      <motion.div className="pb-board glass" animate={shake}>
        <svg viewBox={`0 0 ${W} ${H}`} className="pb-svg" aria-label="pinball table">
          {slotBtns.map((i) => <rect key={i} x={i * slotW} y={H - 0.14} width={slotW} height={0.14} className={`pb-slot ${chosen === i ? (i === rd.sim.slot ? 'ok' : 'bad') : phase === 'reveal' && i === rd.sim.slot ? 'ok' : ''}`} onClick={() => guess(i)} />)}
          {slotBtns.map((i) => <text key={`t${i}`} x={i * slotW + slotW / 2} y={H - 0.05} className="pb-slot-n" textAnchor="middle" pointerEvents="none">{i + 1}</text>)}
          {bumpersVisible && rd.bumpers.map((b, i) => <g key={i}><circle cx={b.x} cy={b.y} r={b.r} className="pb-bumper" /><circle cx={b.x} cy={b.y} r={b.r * 0.55} className="pb-bumper-in" /></g>)}
          {phase === 'show' && <path d={`M${rd.x0} ${BALL_R} l ${rd.vx0 * 1.4} 0.12`} stroke="#ffd166" strokeWidth="0.012" strokeLinecap="round" fill="none" />}
          <circle cx={ball[0]} cy={ball[1]} r={BALL_R} className="pb-ball" />
        </svg>
      </motion.div>
      <Feed msg={msg} />
    </div>
  )
}
