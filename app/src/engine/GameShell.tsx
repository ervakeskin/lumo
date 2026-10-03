import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, type GameMeta } from '../games/registry'
import { newSeed } from '../core/rng'
import { sfx, setMuted } from '../core/audio'
import { median } from '../core/adaptive'
import { useStore, useT, type PlayRecord } from '../core/store'
import type { GameProps, Session, TrialResult } from './types'
import Toggles from '../components/Toggles'
import BackButton from '../components/BackButton'
import { NEW_STEPS } from '../games/steps'
import ResultScreen, { type ResultData } from './ResultScreen'

type Phase = 'intro' | 'countdown' | 'playing' | 'result'

export interface FitMode {
  /** Kısa değerlendirme süresi (sn) */
  seconds: number
  /** Oyun bitince sonuç ekranı yerine çağrılır */
  onDone: (rec: PlayRecord) => void
}

export default function GameShell({ game, onReplay, fit }: { game: GameMeta; onReplay: () => void; fit?: FitMode }) {
  const totalSec = fit?.seconds ?? game.durationSec
  const t = useT()
  const nav = useNavigate()
  const lang = useStore((s) => s.lang)
  const muted = useStore((s) => s.muted)
  const savedLevel = useStore((s) => s.lastLevel[game.id] ?? 0)
  // Fit Test her zaman standart başlangıç seviyesinden başlar: testler birbiriyle karşılaştırılabilir kalsın
  const startLevel = fit ? 0 : savedLevel
  const addPlay = useStore((s) => s.addPlay)
  const cat = CATEGORIES[game.category]

  const [phase, setPhase] = useState<Phase>('intro')
  const [count, setCount] = useState(3)
  const [paused, setPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalSec)
  const [, force] = useState(0)
  const [result, setResult] = useState<ResultData | null>(null)
  const seed = useMemo(() => newSeed(), [])

  const trials = useRef<TrialResult[]>([])
  const score = useRef(0)
  const combo = useRef(0)
  const maxCombo = useRef(0)
  const level = useRef(startLevel)
  const endedRef = useRef(false)
  const finishRef = useRef<() => void>(() => {})

  useEffect(() => setMuted(muted), [muted])

  const session = useMemo<Session>(
    () => ({
      record(tr) {
        trials.current.push(tr)
        if (tr.correct) {
          combo.current += 1
          maxCombo.current = Math.max(maxCombo.current, combo.current)
          const mult = Math.min(2, 1 + Math.floor(combo.current / 5) * 0.25)
          score.current += Math.round((tr.points ?? 100) * mult)
          sfx.correct(combo.current)
        } else {
          combo.current = 0
          sfx.wrong()
        }
        force((n) => n + 1)
      },
      setLevel: (n) => {
        level.current = n
      },
      end: () => finishRef.current(),
      get combo() {
        return combo.current
      },
    }),
    [],
  )

  // Geri tuşu / sayfa değişimi: oyun ortasında onay iste, state sessizce kaybolmasın.
  const blocker = useBlocker(phase === 'countdown' || phase === 'playing')
  useEffect(() => {
    if (blocker.state === 'blocked') setPaused(true)
  }, [blocker.state])

  // Geri sayım: 3 → 2 → 1 → "Başla!"; her sayı tam 1 sn görünür, "Başla!" 0.6 sn.
  useEffect(() => {
    if (phase !== 'countdown') return
    sfx.count(count)
    const id = setTimeout(() => (count === 0 ? setPhase('playing') : setCount((c) => c - 1)), count === 0 ? 600 : 1000)
    return () => clearTimeout(id)
  }, [phase, count])

  const finish = useCallback(() => {
    if (endedRef.current) return
    endedRef.current = true
    const ts = trials.current
    const correct = ts.filter((x) => x.correct).length
    const rts = ts.filter((x) => x.correct && x.rt != null).map((x) => x.rt as number)
    const rec: PlayRecord = {
      gameId: game.id,
      at: Date.now(),
      score: score.current,
      accuracy: ts.length ? correct / ts.length : 0,
      medianRt: Math.round(median(rts)),
      level: level.current,
    }
    const prevPlays = useStore.getState().plays.filter((p) => p.gameId === game.id)
    const prevRt = prevPlays.length ? prevPlays[prevPlays.length - 1].medianRt : 0
    const { prevBest, isNewBest } = addPlay(rec)
    if (fit) {
      fit.onDone(rec)
      return
    }
    setResult({ rec, trials: ts, prevBest, isNewBest, prevRt, maxCombo: maxCombo.current })
    setPhase('result')
    sfx.fanfare()
  }, [addPlay, game.id, fit])

  finishRef.current = finish

  // Oyun saati (duraklatınca donar)
  useEffect(() => {
    if (phase !== 'playing' || paused) return
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setTimeLeft((tl) => Math.max(0, tl - dt))
    }, 100)
    return () => clearInterval(id)
  }, [phase, paused])

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) finish()
  }, [phase, timeLeft, finish])

  // Sekme gizlenince otomatik duraklat
  useEffect(() => {
    const h = () => document.hidden && setPaused(true)
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [])

  if (phase === 'result' && result) {
    return <ResultScreen game={game} data={result} onReplay={onReplay} onLibrary={() => nav('/oyunlar', { replace: true })} />
  }

  const Game = game.Component!
  const gameProps: GameProps = { session, paused: paused || phase !== 'playing', timeLeft, seed, startLevel }
  const pct = (timeLeft / totalSec) * 100

  return (
    <div className="shell" style={{ '--cat': cat.color } as React.CSSProperties}>
      <header className="hud">
        <BackButton to="/oyunlar" replace />
        <div className="hud-title" style={{ color: cat.color }}>{game.name}</div>
        <div className="hud-tools"><Toggles theme={false} /></div>
        <div className="hud-score" aria-live="polite">{score.current.toLocaleString(lang)}</div>
        {phase === 'playing' && (
          <button className="btn ghost" onClick={() => setPaused((p) => !p)}>
            {paused ? t({ tr: 'Devam', en: 'Resume' }) : t({ tr: 'Duraklat', en: 'Pause' })}
          </button>
        )}
      </header>
      <div className="timebar" role="progressbar" aria-valuenow={Math.round(timeLeft)} aria-valuemax={totalSec}>
        <div className={`timebar-fill ${pct < 20 ? 'warn' : ''}`} style={{ width: `${pct}%`, background: cat.color }} />
      </div>

      <main className="stage">
        {phase === 'intro' && <Tutorial game={game} onStart={() => { setCount(3); setPhase('countdown') }} />}
        {phase === 'countdown' && (
          <div className="cd" aria-live="assertive">
            <svg className="cd-ring" viewBox="0 0 200 200" aria-hidden>
              <circle cx="100" cy="100" r="88" className="cd-bg" />
              {count > 0 && <circle key={count} cx="100" cy="100" r="88" className="cd-fg" />}
            </svg>
            <motion.div key={count} className={`countdown ${count === 0 ? 'go' : ''}`} initial={{ scale: 1.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 20 }}>
              {count > 0 ? count : t({ tr: 'Başla!', en: 'Go!' })}
            </motion.div>
          </div>
        )}
        {phase === 'playing' && <Game {...gameProps} />}

        {paused && phase === 'playing' && blocker.state !== 'blocked' && (
          <div className="overlay">
            <h2>{t({ tr: 'Duraklatıldı', en: 'Paused' })}</h2>
            <button className="btn primary" onClick={() => setPaused(false)}>{t({ tr: 'Devam', en: 'Resume' })}</button>
          </div>
        )}
        {blocker.state === 'blocked' && (
          <div className="overlay" role="alertdialog" aria-modal="true">
            <h2>{t({ tr: 'Oyundan çıkmak istediğine emin misin?', en: 'Leave the game?' })}</h2>
            <p className="muted">{t({ tr: 'İlerlemen kaydedilmeyecek.', en: 'Your progress will not be saved.' })}</p>
            <div className="row">
              <button className="btn primary" onClick={() => { blocker.reset(); setPaused(false) }}>{t({ tr: 'Oyuna dön', en: 'Keep playing' })}</button>
              <button className="btn ghost" onClick={() => blocker.proceed()}>{t({ tr: 'Çık', en: 'Leave' })}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const STEPS: Record<string, { tr: string[]; en: string[] }> = {
  'color-match': {
    tr: ['Üstte ve altta birer renk adı görürsün; her yazı farklı bir renkle boyanmıştır.', 'Üstteki ipucunu oku: ya "kelimenin ANLAMI = alttaki YAZI RENGİ mi?" ya da "iki yazının RENGİ aynı mı?". Evet için →, hayır için ←.', 'Kural zamanla değişir. Kelimenin ne dediğine değil, sorulan özelliğe bak!'],
    en: ['You see a color word on top and one below; each is printed in some ink color.', 'Read the hint: either "top word MEANING = bottom INK color?" or "same INK color on both?". YES →, NO ←.', 'The rule changes over time. Ignore what the word says; check the asked feature!'],
  },
  'chalkboard-challenge': {
    tr: ['Tahtada iki ifade belirir.', 'Hangisinin değeri daha büyük? SOL (←), SAĞ (→) ya da eşitse EŞİT (↓).', 'Süre azalır, ifadeler zorlaşır ve değerler birbirine yaklaşır.'],
    en: ['Two expressions appear on the board.', 'Which has the greater value? LEFT (←), RIGHT (→), or EQUAL (↓).', 'Time shrinks, expressions get harder and values get closer.'],
  },
  'lost-in-migration': {
    tr: ['Bir sürü belirir; kuş, balık, uçak, kelebek, balina, arı, roket ya da kaplumbağa olabilir; türler karışabilir. Ortadaki lidere odaklan.', 'Sadece liderin gittiği yönü seç. Çevredekiler farklı yöne gidip seni yanıltır; bazen yönsüz baloncuklardır.', 'Doğru serilerle seviye çıkar: iki yön → dört yön, büyük ve karışık türlü sürü → parlamayan (altın) lider.'],
    en: ['A group appears; birds, fish, planes, butterflies, whales, bees, rockets or turtles, and species may be mixed. Focus on the leader in the middle.', 'Pick only the direction the leader is heading. The others may go elsewhere to mislead you; sometimes they are direction-less bubbles.', 'Streaks raise the level: two directions → four directions and a big mixed-species group → a leader that no longer glows (gold).'],
  },
  raindrops: {
    tr: ['Damlalar işlemlerle birlikte düşer.', 'Sonucu klavyeden ya da tuş takımından yaz; doğru sayı en aşağıdaki damlayı patlatır. Yanlış cevap için Enter.', 'Yere düşen damla suyu yükseltir. Beş doğru seri suyu bir seviye indirir; su dolarsa oyun biter.'],
    en: ['Drops fall carrying equations.', 'Type the result on your keyboard or keypad; the right number pops the lowest matching drop. Enter for a wrong entry.', 'A drop that lands raises the water. Five correct in a row lowers it one level; if it fills, the game ends.'],
  },
  'memory-matrix': {
    tr: ['Izgarada bazı kareler kısa süre parlar.', 'Parlayan karelerin yerini aklında tut.', 'Kareler kaybolunca aynı kareleri işaretle.'],
    en: ['Some tiles flash briefly on the grid.', 'Remember where they were.', 'After they vanish, tap the same tiles.'],
  },
  'speed-match': {
    tr: ['Ortada yeni bir kart belirir; solda ÖNCEKİ kart görünür.', 'Üstte hangi özelliğin sorulduğunu oku: RENK ya da ŞEKİL. Sadece o özellik aynıysa AYNI (→), değilse FARKLI (←).', 'Kural zamanla değişir; diğer özellik seni yanıltabilir. Halka dolmadan karar ver.'],
    en: ['A new card appears; the PREVIOUS card is on the left.', 'Read which feature is asked: COLOR or SHAPE. Only if that feature matches press SAME (→), otherwise DIFFERENT (←).', 'The rule changes over time; the other feature may mislead you. Decide before the ring runs out.'],
  },
}

function Tutorial({ game, onStart }: { game: GameMeta; onStart: () => void }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const steps = (STEPS[game.id] ?? NEW_STEPS[game.id])?.[lang] ?? [t(game.description)]
  const cat = CATEGORIES[game.category]
  return (
    <motion.div className="tutorial glass" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <span className="chip" style={{ background: cat.color + '22', color: cat.color }}>{t(cat.name)}</span>
      <h2>{game.name}</h2>
      <p className="muted">{t(game.paradigm)}</p>
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={i}><span className="step-n" style={{ background: cat.color }}>{i + 1}</span>{s}</li>
        ))}
      </ol>
      <button className="btn primary big" onClick={onStart} autoFocus>{t({ tr: 'Hazırım', en: "I'm ready" })}</button>
    </motion.div>
  )
}
