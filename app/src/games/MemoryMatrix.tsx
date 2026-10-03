import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { mmFlashMs, mmGridSize, mmNextK, MM_MIN_K } from '../core/adaptive'
import { sfx } from '../core/audio'
import { useT } from '../core/store'

type Phase = 'ready' | 'show' | 'recall' | 'feedback'
const MAX_ERRORS = 3
const READY_MS = 600
const FEEDBACK_MS = 900

// Hafif döşeme: CSS geçişi + memo; GameShell'in 100 ms'lik yeniden render'ı döşemeleri etkilemez
const Tile = memo(function Tile({ i, on, wrong, miss, disabled, onPick, label }: {
  label: string; i: number; on: boolean; wrong: boolean; miss: boolean; disabled: boolean; onPick: (i: number) => void
}) {
  return (
    <button
      className={`mm-cell ${on ? 'on' : ''} ${wrong ? 'wrong' : ''} ${miss ? 'miss' : ''}`}
      aria-label={`${label} ${i + 1}`}
      onClick={() => onPick(i)}
      disabled={disabled}
    />
  )
})

export default function MemoryMatrix({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const [round, setRound] = useState(0)
  const [k, setK] = useState(Math.max(MM_MIN_K, startLevel || MM_MIN_K))
  const [phase, setPhase] = useState<Phase>('ready')
  const [found, setFound] = useState<number[]>([])
  const [wrong, setWrong] = useState<number[]>([])
  const shake = useAnimationControls()
  const recallStart = useRef(0)
  // Hızlı ardışık tıklamalarda bayat state olmasın diye ref ile senkron tutulur
  const foundRef = useRef<number[]>([])
  const wrongRef = useRef<number[]>([])
  const closed = useRef(false)
  const nextK = useRef(k)

  const grid = mmGridSize(k)
  const targets = useMemo(() => {
    const rng = makeRng(seed + round * 7919)
    return rng.shuffle(Array.from({ length: grid * grid }, (_, i) => i)).slice(0, k)
  }, [seed, round, grid, k])

  // ready → show
  useEffect(() => {
    if (phase !== 'ready' || paused) return
    const id = setTimeout(() => setPhase('show'), READY_MS)
    return () => clearTimeout(id)
  }, [phase, paused, round])

  // show → recall
  useEffect(() => {
    if (phase !== 'show' || paused) return
    const id = setTimeout(() => {
      recallStart.current = performance.now()
      setPhase('recall')
    }, mmFlashMs(round) + 200)
    return () => clearTimeout(id)
  }, [phase, paused, round])

  // feedback → sonraki tur (duraklatmaya saygılı, unmount'ta temizlenir)
  useEffect(() => {
    if (phase !== 'feedback' || paused) return
    const id = setTimeout(() => {
      foundRef.current = []
      wrongRef.current = []
      closed.current = false
      setK(nextK.current)
      setRound((r) => r + 1)
      setFound([])
      setWrong([])
      setPhase('ready')
    }, FEEDBACK_MS)
    return () => clearTimeout(id)
  }, [phase, paused])

  const endRound = (errors: number) => {
    const nextK_ = mmNextK(k, errors)
    if (nextK_ > k) sfx.levelUp()
    session.setLevel(nextK_)
    closed.current = true
    nextK.current = nextK_
    setPhase('feedback')
  }

  const onCellImpl = (i: number) => {
    if (phase !== 'recall' || paused || closed.current) return
    if (foundRef.current.includes(i) || wrongRef.current.includes(i)) return
    const rt = performance.now() - recallStart.current
    if (targets.includes(i)) {
      const nf = [...foundRef.current, i]
      foundRef.current = nf
      setFound(nf)
      session.record({ correct: true, rt, points: 100 })
      recallStart.current = performance.now()
      if (nf.length === k) endRound(wrongRef.current.length)
    } else {
      const nw = [...wrongRef.current, i]
      wrongRef.current = nw
      setWrong(nw)
      void shake.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.3 } })
      session.record({ correct: false, rt })
      if (nw.length >= MAX_ERRORS) endRound(nw.length)
    }
  }
  // Döşemelere sabit referans: her zaman en güncel closure'ı çağırır
  const handler = useRef(onCellImpl)
  handler.current = onCellImpl
  const onCell = useRef((i: number) => handler.current(i)).current

  const flashing = phase === 'show'

  return (
    <div className="mm">
      <div className="mm-info muted">{t({ tr: `Tur ${round + 1} · ${k} kare`, en: `Round ${round + 1} · ${k} tiles` })}</div>
      <motion.div
        className="mm-grid"
        style={{ gridTemplateColumns: `repeat(${grid}, 1fr)` }}
        animate={shake}
      >
        {Array.from({ length: grid * grid }, (_, i) => {
          const isFound = found.includes(i)
          const isWrong = wrong.includes(i)
          const showMiss = phase === 'feedback' && targets.includes(i) && !isFound
          const on = flashing ? targets.includes(i) : isFound
          return (
            <Tile
              key={i}
              i={i}
              on={on}
              wrong={isWrong}
              miss={showMiss}
              disabled={phase !== 'recall'}
              onPick={onCell}
              label={t({ tr: 'kare', en: 'tile' })}
            />
          )
        })}
      </motion.div>
      <div className="mm-errors" aria-label={t({ tr: 'hatalar', en: 'errors' })}>
        {Array.from({ length: MAX_ERRORS }, (_, i) => (
          <span key={i} className={`dot ${i < wrong.length ? 'used' : ''}`} />
        ))}
      </div>
    </div>
  )
}
