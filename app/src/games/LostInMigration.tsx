import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { limIncongruentRatio, limTrialMs, smNextLevel } from '../core/adaptive'
import {
  limDirections, limFlankers, limFormationSize, limLeaderGlow, limPickKind, limPickTheme, limFlankThemes, limTimeScale,
  type Cell, type Dir4, type FlankKind, type Theme,
} from '../core/flanker'
import { sfx } from '../core/audio'
import { useT } from '../core/store'
import Creature from '../components/Creatures'

interface Trial { n: number; lead: Dir4; flank: Cell[]; flankThemes: Theme[]; kind: FlankKind; theme: Theme; level: number; limit: number }
interface Msg { text: string; good: boolean; id: number }
const BLOCK = 10

// 3x3 ızgarada hücre sırası: merkez lider. Artı biçimli (L1) sürüde yalnızca kollar dolu.
const ORDER_9: [number, number][] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]]
const ORDER_5: [number, number][] = [[1, 0], [0, 1], [2, 1], [1, 2]]

const NAMES: Record<Dir4, { tr: string; en: string }> = {
  left: { tr: 'SOL', en: 'LEFT' }, right: { tr: 'SAĞ', en: 'RIGHT' }, up: { tr: 'YUKARI', en: 'UP' }, down: { tr: 'AŞAĞI', en: 'DOWN' },
}
const SUBJECT: Record<Theme, { tr: string; en: string }> = {
  bird: { tr: 'kuş', en: 'bird' }, fish: { tr: 'balık', en: 'fish' }, plane: { tr: 'uçak', en: 'plane' },
  butterfly: { tr: 'kelebek', en: 'butterfly' }, whale: { tr: 'balina', en: 'whale' }, bee: { tr: 'arı', en: 'bee' },
  rocket: { tr: 'roket', en: 'rocket' }, turtle: { tr: 'kaplumbağa', en: 'turtle' },
}

export default function LostInMigration({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const rng = useRef(makeRng(seed)).current
  const S = useRef({
    streak: 0, best: 0, recent: [] as boolean[], answered: false, shownAt: 0, n: 0, msgId: 0,
    level: startLevel >= 1 && startLevel <= 3 ? startLevel : 1, blockTotal: 0, blockCorrect: 0, theme: null as Theme | null,
  })
  const trRef = useRef<Trial | null>(null)
  const [tr, setTr] = useState<Trial | null>(null)
  const [phase, setPhase] = useState<'fix' | 'stim'>('fix')
  const [msg, setMsg] = useState<Msg | null>(null)
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(S.current.level)
  const [theme, setTheme] = useState<Theme>('bird')
  const shake = useAnimationControls()

  const commit = (x: Trial | null) => { trRef.current = x; setTr(x) }

  // Fixasyon → yeni deneme
  useEffect(() => {
    if (paused || phase !== 'fix') return
    const id = setTimeout(() => {
      const st = S.current
      const recentAcc = st.recent.length >= 10 ? st.recent.slice(-10).filter(Boolean).length / 10 : 0
      const kind = limPickKind(st.level, limIncongruentRatio(recentAcc), rng.next())
      const lead = rng.pick(limDirections(st.level))
      const th = limPickTheme(st.theme, rng, st.level)
      st.theme = th
      st.n += 1
      st.answered = false
      st.shownAt = performance.now()
      setTheme(th)
      commit({
        n: st.n, lead, kind, theme: th, level: st.level,
        flank: limFlankers(lead, kind, st.level, rng),
        flankThemes: limFlankThemes(th, st.level, limFormationSize(st.level) - 1, rng),
        limit: Math.round(limTrialMs(st.streak) * limTimeScale(st.level)),
      })
      setPhase('stim')
    }, 450)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused])

  const resolve = (correct: boolean, rt: number) => {
    const st = S.current
    const cur = trRef.current!
    st.answered = true
    st.recent.push(correct)
    st.streak = correct ? st.streak + 1 : 0
    st.best = Math.max(st.best, st.streak)
    session.record({ correct, rt, points: Math.max(50, Math.round(300 - rt * 0.12)), tag: cur.kind })
    // Seviye: her 10 denemelik blok sonunda doğruluğa göre
    st.blockTotal += 1
    if (correct) st.blockCorrect += 1
    if (st.blockTotal >= BLOCK) {
      const nl = smNextLevel(st.level, st.blockCorrect / st.blockTotal)
      if (nl > st.level) sfx.levelUp()
      st.level = nl
      setLevel(nl)
      st.blockTotal = 0
      st.blockCorrect = 0
    }
    session.setLevel(st.level)
    setStreak(st.streak)
    setFlash(correct ? 'ok' : 'bad')
    setMsg({ text: correct ? `${Math.round(rt)} ms` : t({ tr: `Doğrusu: ${NAMES[cur.lead].tr}`, en: `Correct: ${NAMES[cur.lead].en}` }), good: correct, id: ++st.msgId })
    if (!correct) void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.3 } })
    setTimeout(() => setFlash(null), 220)
    setPhase('fix')
  }

  const answer = (d: Dir4) => {
    const cur = trRef.current
    if (paused || phase !== 'stim' || !cur || S.current.answered) return
    if (!limDirections(cur.level).includes(d)) return
    resolve(d === cur.lead, performance.now() - S.current.shownAt)
  }
  const answerRef = useRef(answer)
  answerRef.current = answer

  // Süre aşımı
  useEffect(() => {
    if (paused || phase !== 'stim' || !tr) return
    const id = setTimeout(() => {
      if (!S.current.answered) resolve(false, tr.limit)
    }, tr.limit)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused, tr?.n])

  useEffect(() => {
    const map: Record<string, Dir4> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' }
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return
      const d = map[e.key] ?? map[e.key.toLowerCase()]
      if (d) {
        e.preventDefault()
        answerRef.current(d)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const four = level >= 2
  const levelName = [
    '',
    t({ tr: 'Seviye 1 · İki yön', en: 'Level 1 · Two directions' }),
    t({ tr: 'Seviye 2 · Dört yön, büyük sürü', en: 'Level 2 · Four directions, big flock' }),
    t({ tr: 'Seviye 3 · Lider parlamıyor', en: 'Level 3 · No glowing leader' }),
  ][level]

  // Hücreleri yerleştir: merkez lider, geri kalanı sırayla flanker
  const cells: { x: number; y: number; dir: Cell; theme: Theme; lead?: boolean }[] = []
  if (tr) {
    cells.push({ x: 1, y: 1, dir: tr.lead, theme: tr.theme, lead: true })
    const order = tr.flank.length === 4 ? ORDER_5 : ORDER_9
    order.forEach(([x, y], i) => cells.push({ x, y, dir: tr.flank[i], theme: tr.flankThemes[i] }))
  }

  const subject = SUBJECT[theme]
  return (
    <div className="lim">
      <div className="lim-top">
        <span className="chip lvl" key={`l${level}`}>{levelName}</span>
        <span className="muted small lim-q">
          {level >= 3
            ? t({ tr: `Altın renkli ${subject.tr} hangi yöne gidiyor?`, en: `Which way is the gold ${subject.en} heading?` })
            : t({ tr: `Parlayan ortadaki ${subject.tr} hangi yöne gidiyor?`, en: `Which way is the glowing center ${subject.en} heading?` })}
        </span>
      </div>

      <motion.div className={`lim-sky theme-${theme} ${flash ?? ''}`} animate={shake}>
        {phase === 'fix' && <div className="lim-fix" aria-hidden><i /><i /></div>}
        {phase === 'stim' && tr && (
          <div className="flock" key={tr.n}>
            {cells.map((c, i) => (
              <div key={i} className="flock-cell" style={{ gridColumn: c.x + 1, gridRow: c.y + 1 }}>
                <Creature theme={c.theme} dir={c.dir} lead={c.lead} glow={limLeaderGlow(tr.level)} delay={i * 90} />
              </div>
            ))}
          </div>
        )}
        {phase === 'stim' && tr && (
          <div className="lim-clock" key={`c${tr.n}`}><i style={{ animationDuration: `${tr.limit}ms`, animationPlayState: paused ? 'paused' : 'running' }} /></div>
        )}
      </motion.div>

      <div className="sm-feed" aria-live="polite">
        {msg && <motion.span key={msg.id} className={`sm-msg ${msg.good ? 'good' : 'bad'}`} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{msg.good ? '✓ ' : '✗ '}{msg.text}</motion.span>}
      </div>
      <div className="sm-streak">
        {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < streak ? 'on' : ''} />)}
        <span className="muted small">{streak >= 10 ? t({ tr: 'ATEŞTE!', en: 'ON FIRE!' }) : streak >= 5 ? `×${1 + Math.floor(streak / 5) * 0.25}` : ''}</span>
      </div>

      {four ? (
        <div className="dpad" role="group" aria-label={t({ tr: 'yön', en: 'direction' })}>
          {(['up', 'left', 'right', 'down'] as Dir4[]).map((d) => (
            <motion.button key={d} whileTap={{ scale: 0.92 }} className={`btn choice lim-btn dp-${d}`} onClick={() => answer(d)} aria-label={t(NAMES[d])}>
              <span>{{ up: '↑', down: '↓', left: '←', right: '→' }[d]}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="sm-actions">
          <motion.button whileTap={{ scale: 0.94 }} className="btn choice lim-btn" onClick={() => answer('left')}><span>← {t(NAMES.left)}</span><kbd>←</kbd></motion.button>
          <motion.button whileTap={{ scale: 0.94 }} className="btn choice lim-btn" onClick={() => answer('right')}><span>{t(NAMES.right)} →</span><kbd>→</kbd></motion.button>
        </div>
      )}
    </div>
  )
}
