import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { animate, motion } from 'framer-motion'
import { CATEGORIES, GAMES } from '../games/registry'
import { AXES, RETEST_DAYS, strongest, weakest } from '../core/fit'
import { useStore, useT, type Axis } from '../core/store'
import Radar from '../components/Radar'

export default function FitResult() {
  const t = useT()
  const fits = useStore((s) => s.fits)
  const fit = fits[fits.length - 1]
  const prev = fits.length > 1 ? fits[fits.length - 2] : null
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!fit) return
    const c = animate(0, fit.lpi, { duration: 1.4, ease: 'easeOut', onUpdate: (x) => setShown(Math.round(x)) })
    return () => c.stop()
  }, [fit])
  if (!fit) return <Navigate to="/fit-test" replace />

  const labels = Object.fromEntries(AXES.map((a) => [a, t(CATEGORIES[a].name)])) as Record<Axis, string>
  const colors = Object.fromEntries(AXES.map((a) => [a, CATEGORIES[a].color])) as Record<Axis, string>
  const best = strongest(fit.axes), worst = weakest(fit.axes)
  const gameOf = (a: Axis) => GAMES.find((g) => g.category === a && Object.keys(fit.perGame).includes(g.id))?.name
  const delta = prev ? fit.lpi - prev.lpi : null

  return (
    <section className="fit-res">
      <div className="page-head center-t">
        <span className="chip pill">{t({ tr: 'Fit Test sonucu', en: 'Fit Test result' })}</span>
        <h1>{t({ tr: 'Beyin profilin hazır', en: 'Your brain profile is ready' })}</h1>
      </div>

      <div className="fit-grid">
        <div className="glass fit-radar-box">
          <Radar values={fit.axes} compare={prev?.axes} labels={labels} colors={colors} />
          {prev && <p className="muted small">{t({ tr: 'Soluk alan: önceki testin.', en: 'Faded area: your previous test.' })}</p>}
        </div>

        <div className="fit-side">
          <div className="glass lpi-box">
            <div className="muted">{t({ tr: 'Lumo Endeksi', en: 'Lumo Index' })}</div>
            <motion.div className="lpi">{shown}</motion.div>
            <div className="muted small">/ 1000{delta != null && ` · ${delta >= 0 ? '+' : ''}${delta} ${t({ tr: 'önceki teste göre', en: 'vs previous test' })}`}</div>
          </div>
          <div className="glass axis-box">
            {[...AXES].sort((a, b) => fit.axes[b] - fit.axes[a]).map((a) => (
              <div key={a} className="axis-row">
                <span style={{ color: colors[a] }}><b>{labels[a]}</b></span>
                <div className="axis-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${fit.axes[a]}%` }} transition={{ duration: 0.9, delay: 0.2 }} style={{ background: colors[a] }} /></div>
                <b>{fit.axes[a]}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass insight-box">
        <p><b>{t({ tr: 'Güçlü yönün:', en: 'Your strength:' })}</b> {labels[best]} ({fit.axes[best]}). <b>{t({ tr: 'Gelişim alanın:', en: 'Growth area:' })}</b> {labels[worst]} ({fit.axes[worst]})
          {gameOf(worst) ? ` — ${t({ tr: 'antrenmanında öne çıkacak oyun:', en: 'a game you will see more:' })} ${gameOf(worst)}.` : '.'}</p>
        <p className="muted small">
          {t({ tr: `Skorlar doğruluk, tepki süresi ve ulaştığın seviyeden hesaplanan demo kalibrasyonudur; klinik/normlanmış değildir. ${RETEST_DAYS} günde bir Fit Test'i tekrarlayıp gelişimini kendi ilk sonucunla karşılaştırabilirsin.`, en: `Scores come from a demo calibration using accuracy, reaction time and reached level; they are not clinical or normed. Repeat the Fit Test every ${RETEST_DAYS} days to compare with your own baseline.` })}
        </p>
      </div>

      <div className="row">
        <Link to="/panel" className="btn primary big">{t({ tr: 'Antrenman planımı gör', en: 'See my workout plan' })}</Link>
        <Link to="/oyunlar" className="btn ghost big">{t({ tr: 'Oyunlara git', en: 'Browse games' })}</Link>
      </div>
    </section>
  )
}
