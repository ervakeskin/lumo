import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, getGame } from '../games/registry'
import { FIT_GAMES, FIT_SECONDS, buildFit } from '../core/fit'
import { useStore, useT, type PlayRecord } from '../core/store'
import { useAuth } from '../core/auth'
import { Link } from 'react-router-dom'
import GameShell from '../engine/GameShell'
import BackButton from '../components/BackButton'
import GameIcon from '../components/GameIcon'

type Step = { kind: 'intro' } | { kind: 'game'; i: number } | { kind: 'card'; i: number }

export default function FitTest() {
  const t = useT()
  const nav = useNavigate()
  const addFit = useStore((s) => s.addFit)
  const account = useAuth((s) => s.current)
  const [step, setStep] = useState<Step>({ kind: 'intro' })
  const recs = useRef<Record<string, PlayRecord>>({})

  const fitMode = useMemo(
    () => (step.kind === 'game' ? { seconds: FIT_SECONDS, onDone: (rec: PlayRecord) => { recs.current[rec.gameId] = rec; setStep({ kind: 'card', i: step.i }) } } : undefined),
    [step],
  )

  if (step.kind === 'intro') {
    return (
      <div className="page-wrap">
        <div className="page-top"><BackButton to="/panel" /></div>
        <motion.section className="fit-intro glass" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span className="chip pill">{t({ tr: 'Fit Test · yaklaşık 8 dakika', en: 'Fit Test · about 8 minutes' })}</span>
          <h1>{t({ tr: 'Başlangıç seviyeni ölçelim', en: 'Let’s measure your starting level' })}</h1>
          <p className="muted">{t({ tr: `Beş kısa oyun (her biri ~${FIT_SECONDS} sn), beş beceri: hafıza, dikkat, hız, esneklik, problem çözme. Sonuçlar günlük antrenmanının başlangıç zorluğunu belirler.`, en: `Five short games (~${FIT_SECONDS}s each), five skills: memory, attention, speed, flexibility, problem solving. Results set the starting difficulty of your daily workout.` })}</p>
          <ol className="fit-list">
            {FIT_GAMES.map(({ gameId }) => {
              const g = getGame(gameId)!
              const cat = CATEGORIES[g.category]
              return <li key={gameId}><GameIcon category={g.category} color={cat.color} size={38} /><span><b>{g.name}</b><br /><span className="muted small">{t(cat.name)}</span></span></li>
            })}
          </ol>
          {!account && <p className="notice">{t({ tr: 'Fit Test kişisel veri gerektirir: sonuçlarının saklanması için ', en: 'The Fit Test needs personal data: to keep your results ' })}<Link to="/kayit" state={{ from: '/fit-test' }} className="lnk">{t({ tr: 'hesap aç', en: 'create an account' })}</Link>{t({ tr: ' ya da ', en: ' or ' })}<Link to="/giris" state={{ from: '/fit-test' }} className="lnk">{t({ tr: 'giriş yap', en: 'sign in' })}</Link>.</p>}
          <p className="muted small">{t({ tr: 'Not: Bu bir demo kalibrasyonudur; klinik ya da normlanmış bir ölçüm değildir.', en: 'Note: this is a demo calibration, not a clinical or normed measurement.' })}</p>
          <button className="btn primary big" onClick={() => setStep({ kind: 'game', i: 0 })}>{t({ tr: 'Teste Başla', en: 'Start the test' })}</button>
        </motion.section>
      </div>
    )
  }

  if (step.kind === 'card') {
    const done = FIT_GAMES[step.i]
    const doneGame = getGame(done.gameId)!
    const last = step.i === FIT_GAMES.length - 1
    const nextGame = last ? null : getGame(FIT_GAMES[step.i + 1].gameId)!
    const finish = () => {
      addFit(buildFit(Object.fromEntries(Object.values(recs.current).map((r) => [r.gameId, { score: r.score, accuracy: r.accuracy, medianRt: r.medianRt, level: r.level }]))))
      nav('/fit-test/sonuc', { replace: true })
    }
    return (
      <div className="page-wrap center">
        <motion.section className="fit-card glass" initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="fit-dots">{FIT_GAMES.map((_, i) => <i key={i} className={i <= step.i ? 'on' : ''} />)}</div>
          <h2>{t(CATEGORIES[doneGame.category].name)} {t({ tr: 'ölçüldü ✓', en: 'measured ✓' })}</h2>
          {nextGame ? <p className="muted">{t({ tr: 'Sırada:', en: 'Next:' })} <b>{nextGame.name}</b> ({t(CATEGORIES[nextGame.category].name)})</p> : <p className="muted">{t({ tr: 'Hepsi bitti. Sonucunu hazırlayalım!', en: 'All done. Let’s prepare your result!' })}</p>}
          <button className="btn primary big" autoFocus onClick={() => (last ? finish() : setStep({ kind: 'game', i: step.i + 1 }))}>
            {last ? t({ tr: 'Sonucu Gör', en: 'See result' }) : t({ tr: 'Devam', en: 'Continue' })}
          </button>
        </motion.section>
      </div>
    )
  }

  const game = getGame(FIT_GAMES[step.i].gameId)!
  return <GameShell key={game.id} game={game} fit={fitMode} onReplay={() => undefined} />
}
