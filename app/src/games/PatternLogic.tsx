import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genMatrix, matrixAttrs, type MCell, type MatrixPuzzle } from '../core/matrix'
import { useT } from '../core/store'
import { Glyph, PALETTE } from '../components/Glyphs'
import { Feed, SHAKE, StreakBar, useKeys, useLeveler, type Msg, useLater } from '../components/GameBits'

const SHAPES = [0, 1, 2] // daire, kare, üçgen
const limitMs = (n: number) => Math.max(9000, 24000 - n * 400)

function Cell({ c, size = 28 }: { c: MCell; size?: number }) {
  return (
    <div className="mx-cell-in" style={{ gridTemplateColumns: `repeat(${c.count === 1 ? 1 : c.count === 2 ? 2 : 2}, auto)` }}>
      {Array.from({ length: c.count }, (_, i) => <Glyph key={i} i={SHAPES[c.shape]} color={PALETTE[c.color]} size={size} />)}
    </div>
  )
}

export default function PatternLogic({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const lv = useLeveler(startLevel, 6)
  const S = useRef({ n: 0, streak: 0, shownAt: performance.now(), answered: false, msgId: 0 })
  const [pz, setPz] = useState<MatrixPuzzle>(() => genMatrix(lv.get(), rng))
  const pzRef = useRef(pz)
  const [n, setN] = useState(0)
  const [streak, setStreak] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [picked, setPicked] = useState<{ i: number; ok: boolean } | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])
  const limit = limitMs(n)

  const finish = (i: number | null) => {
    const s = S.current
    if (paused || s.answered) return
    s.answered = true
    const cur = pzRef.current
    const correct = i === cur.answerIndex
    const rt = performance.now() - s.shownAt
    s.streak = correct ? s.streak + 1 : 0
    setStreak(s.streak)
    session.record({ correct, rt: i === null ? limit : rt, points: Math.max(80, Math.round(320 - rt * 0.012)), tag: `L${lv.get()}` })
    const level = lv.report(correct)
    session.setLevel(level)
    setPicked({ i: i ?? -1, ok: correct })
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? `${Math.round(rt / 100) / 10} s` : t({ tr: 'Doğru seçenek vurgulandı', en: 'Correct option highlighted' }), good: correct, id: ++s.msgId })
    later(() => {
      s.n += 1
      const next = genMatrix(level, rng)
      pzRef.current = next
      s.answered = false; s.shownAt = performance.now()
      setPicked(null); setPz(next); setN(s.n)
    }, correct ? 250 : 1100)
  }
  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => finish(null), limit)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, paused, limit])
  useKeys((e) => { const k = Number(e.key); if (k >= 1 && k <= 4) finish(k - 1) })

  return (
    <div className="sm">
      <div className="sm-top">
        <span className="chip lvl" key={lv.level}>{t({ tr: `Seviye ${lv.level} · ${matrixAttrs(lv.level).length} kural`, en: `Level ${lv.level} · ${matrixAttrs(lv.level).length} rule(s)` })}</span>
        <span className="muted small">{t({ tr: 'Her satır ve sütun aynı kurala uyar. Eksik parça hangisi?', en: 'Every row and column follows the same rules. Which piece is missing?' })}</span>
      </div>
      <motion.div className="mx-grid glass" animate={shake}>
        {pz.grid.flat().map((c, i) => (
          <div key={i} className={`mx-cell ${i === 8 ? 'q' : ''}`}>{i === 8 ? <b>?</b> : <Cell c={c} />}</div>
        ))}
        <div className="lim-clock" key={`${n}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
      </motion.div>
      <div className="mx-opts">
        {pz.options.map((c, i) => (
          <motion.button key={i} whileTap={{ scale: 0.94 }} className={`mx-opt glass ${picked ? (i === pz.answerIndex ? 'ok' : i === picked.i ? 'bad' : '') : ''}`} onClick={() => finish(i)} aria-label={`option ${i + 1}`}>
            <Cell c={c} /><kbd className="kbd">{i + 1}</kbd>
          </motion.button>
        ))}
      </div>
      <Feed msg={msg} />
      <StreakBar streak={streak} />
    </div>
  )
}
