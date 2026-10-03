import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { genSeeds, idealDivider, seedCount, seedTol, splitDiff, type Seed } from '../core/seeds'
import { useT } from '../core/store'
import { Feed, SHAKE, useKeys, type Msg, useLater, progressFor } from '../components/GameBits'

const levelOf = (round: number) => (round < 3 ? 1 : round < 8 ? 2 : 3)
const limitMs = (round: number) => Math.max(6000, 14000 - round * 300)

export default function SplittingSeeds({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ round: progressFor(levelOf, startLevel), shownAt: performance.now(), answered: false, msgId: 0 })
  const make = (r: number) => genSeeds(seedCount(r), r % 2 === 0 ? 'cluster' : 'scatter', rng)
  const [seeds, setSeeds] = useState<Seed[]>(() => make(S.current.round))
  const seedsRef = useRef(seeds)
  const [div, setDiv] = useState(0.5)
  const divRef = useRef(0.5)
  const [round, setRound] = useState(S.current.round)
  const [reveal, setReveal] = useState<{ left: number; right: number; ideal: number } | null>(null)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [resumeKey, setResumeKey] = useState(0)
  const shake = useAnimationControls()
  useEffect(() => { if (!paused) setResumeKey((k) => k + 1) }, [paused])

  const move = (v: number) => { const c = Math.min(0.97, Math.max(0.03, v)); divRef.current = c; setDiv(c) }
  const submit = () => {
    const s = S.current
    if (paused || s.answered) return
    s.answered = true
    const cur = seedsRef.current
    const d = divRef.current
    const diff = splitDiff(cur, d)
    const left = cur.filter((x) => x.x < d).length
    const level = levelOf(s.round)
    const correct = diff <= seedTol(level)
    const rt = performance.now() - s.shownAt
    session.record({ correct, rt, points: Math.max(30, 220 - diff * 25), tag: `d${diff}` })
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? t({ tr: `Fark: ${diff} tohum`, en: `Off by ${diff}` }) : t({ tr: `Fark ${diff} — biraz fazla`, en: `Off by ${diff} — too much` }), good: correct, id: ++s.msgId })
    setReveal({ left, right: cur.length - left, ideal: idealDivider(cur) })
    session.setLevel(level)
    later(() => {
      s.round += 1
      const next = make(s.round)
      seedsRef.current = next
      s.answered = false
      s.shownAt = performance.now()
      setSeeds(next); setRound(s.round); setReveal(null); move(0.5)
    }, 1300)
  }
  const submitRef = useRef(submit)
  submitRef.current = submit

  useKeys((e) => {
    if (e.key === 'ArrowLeft') move(divRef.current - (e.shiftKey ? 0.05 : 0.01))
    else if (e.key === 'ArrowRight') move(divRef.current + (e.shiftKey ? 0.05 : 0.01))
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); submit() }
  })
  const limit = limitMs(round)
  useEffect(() => {
    if (paused || reveal) return
    const id = setTimeout(() => submitRef.current(), limit)
    return () => clearTimeout(id)
  }, [round, paused, reveal, limit])

  const dots = useMemo(() => seeds.map((s, i) => <ellipse key={i} cx={s.x * 100} cy={s.y * 60} rx="0.9" ry="1.5" transform={`rotate(${(i * 47) % 180} ${s.x * 100} ${s.y * 60})`} fill="#e9c46a" stroke="#a87b1f" strokeWidth="0.25" />), [seeds])
  return (
    <div className="ss">
      <div className="sm-top">
        <span className="chip lvl">{t({ tr: `Yığın ${round + 1} · ${seeds.length} tohum`, en: `Pile ${round + 1} · ${seeds.length} seeds` })}</span>
        <span className="muted small">{t({ tr: 'Çizgiyi sürükle: sol ve sağdaki tohum sayısı eşit olsun. Saymadan, göz kararı!', en: 'Drag the line so left and right have equal seeds. Don’t count — eyeball it!' })}</span>
      </div>
      <motion.div className="ss-board glass" animate={shake}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="ss-svg" aria-hidden>
          {dots}
          <line x1={div * 100} x2={div * 100} y1="0" y2="60" stroke="#ff8c42" strokeWidth="0.7" />
          {reveal && <line x1={reveal.ideal * 100} x2={reveal.ideal * 100} y1="0" y2="60" stroke="#2fd08f" strokeWidth="0.6" strokeDasharray="1.6 1.2" />}
        </svg>
        {reveal && <div className="ss-counts"><b>{reveal.left}</b><b>{reveal.right}</b></div>}
        <div className="lim-clock" key={`${round}-${resumeKey}`}><i style={{ animationDuration: `${limit}ms`, animationPlayState: paused || reveal ? 'paused' : 'running' }} /></div>
      </motion.div>
      <input className="ss-range" type="range" min="30" max="970" value={Math.round(div * 1000)} onChange={(e) => move(Number(e.target.value) / 1000)} aria-label={t({ tr: 'bölücü çizgi', en: 'divider' })} disabled={!!reveal} />
      <Feed msg={msg} />
      <button className="btn primary big" onClick={submit} disabled={!!reveal}>{t({ tr: 'Böl ✓', en: 'Split ✓' })} <kbd className="kbd">Enter</kbd></button>
    </div>
  )
}
