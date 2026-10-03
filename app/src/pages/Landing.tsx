import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '../core/store'
import { CATEGORIES, GAMES, isPlayable, type CategoryId } from '../games/registry'
import GameIcon from '../components/GameIcon'

const LIT_TILES = [2, 6, 8, 12, 18, 21]

export default function Landing() {
  const t = useT()
  const nav = useNavigate()
  const playable = GAMES.filter(isPlayable)
  const catIds = Object.keys(CATEGORIES) as CategoryId[]
  // Galeri sırası her ziyarette karışır: hiçbir oyun "varsayılan ilk" olmasın
  const shown = useMemo(() => [...playable].sort(() => Math.random() - 0.5).slice(0, 10), []) // eslint-disable-line react-hooks/exhaustive-deps
  const surprise = () => nav(`/oyun/${playable[Math.floor(Math.random() * playable.length)].id}`)

  return (
    <>
      <section className="hero4">
        <div className="hero4-glow" aria-hidden />
        <p className="eyebrow rise">{t({ tr: 'Ücretsiz beyin antrenmanı', en: 'Free brain training' })}</p>
        <h1 className="rise d1">
          {t({ tr: 'Zihnin için ', en: 'A little light for ' })}
          <em>{t({ tr: 'her gün biraz ışık.', en: 'your mind, every day.' })}</em>
        </h1>
        <p className="lead rise d2">
          {t({
            tr: 'Hafıza, dikkat, hız ve esnekliği çalıştıran kısa oyunlar. Hepsi açık, hiç reklam yok, seviyen sana göre ayarlanır.',
            en: 'Short games that train memory, attention, speed and flexibility. Everything open, no ads, difficulty adapts to you.',
          })}
        </p>
        <div className="row rise d3">
          <Link to="/fit-test" className="btn primary big">{t({ tr: 'Fit Test ile başla', en: 'Start with the Fit Test' })}</Link>
          <button className="text-link" onClick={surprise}>{t({ tr: 'Beni şaşırt ›', en: 'Surprise me ›' })}</button>
        </div>

        <div className="device-stage rise d4" aria-hidden>
          <div className="device">
            <div className="device-screen">
              <div className="device-top">
                <span className="dots"><i /><i /><i /></span>
                <span>Memory Matrix</span>
                <b>1.240</b>
              </div>
              <div className="device-bar"><i /></div>
              <div className="device-grid">
                {Array.from({ length: 25 }, (_, i) => <i key={i} style={{ '--d': `${LIT_TILES.includes(i) ? (LIT_TILES.indexOf(i) % 3) * 0.1 : 0}s` } as React.CSSProperties} className={LIT_TILES.includes(i) ? 'on' : ''} />)}
              </div>
            </div>
          </div>
          <div className="float-chip c1"><small>{t({ tr: 'Tepki süren', en: 'Reaction time' })}</small><b>312 ms</b></div>
          <div className="float-chip c2"><small>{t({ tr: 'Seri', en: 'Streak' })}</small><b>×1.5</b></div>
          <div className="float-chip c3"><small>{t({ tr: 'Seviye', en: 'Level' })}</small><b>4 ↑</b></div>
        </div>
      </section>

      <section className="block-sec">
        <div className="sec-head">
          <h2>{t({ tr: 'Sade. Açık. Sana göre.', en: 'Simple. Open. Yours.' })}</h2>
          <p>{t({ tr: 'Kilitli oyun, abonelik ya da reklam yok. Sadece iyi tasarlanmış görevler.', en: 'No locked games, no subscription, no ads. Just well-designed tasks.' })}</p>
        </div>
        <div className="bento">
          <div className="b1">
            <div>
              <span className="big-n">{GAMES.length}</span>
              <h3>{t({ tr: 'oyun, hepsi açık.', en: 'games, all open.' })}</h3>
              <p>{t({ tr: `${catIds.length} beceri alanında kısa, odaklı görevler.`, en: `Short, focused tasks across ${catIds.length} skill areas.` })}</p>
            </div>
            <div className="dot-cloud">
              {catIds.map((c) => <span key={c} style={{ '--c': CATEGORIES[c].color } as React.CSSProperties}><i />{t(CATEGORIES[c].name)}</span>)}
            </div>
          </div>
          <div className="b2">
            <div>
              <h3>{t({ tr: 'Seviyen sana uyar.', en: 'Adapts to you.' })}</h3>
              <p>{t({ tr: 'Doğruluğuna göre yükselir ya da kolaylaşır.', en: 'Rises or eases with your accuracy.' })}</p>
            </div>
            <div className="level-bars" aria-hidden><i /><i /><i /><i /><i /></div>
          </div>
          <div className="b3">
            <div>
              <h3>{t({ tr: 'Verin cihazında.', en: 'Your data stays here.' })}</h3>
              <p>{t({ tr: 'Sunucuya hiçbir şey gönderilmez.', en: 'Nothing is sent to a server.' })}</p>
            </div>
            <svg className="lock" viewBox="0 0 48 48" fill="none" aria-hidden><rect x="9" y="21" width="30" height="21" rx="6" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="2.5" /><path d="M16 21v-5a8 8 0 0116 0v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="31" r="3" fill="currentColor" /></svg>
          </div>
          <div className="b4">
            <div>
              <h3>{t({ tr: 'Ne ölçtüğünü bilirsin.', en: 'Know what it measures.' })}</h3>
              <p>{t({ tr: 'Her oyun hangi bilişsel görevi ölçtüğünü açıkça söyler. Tıbbi iddia yok.', en: 'Each game says which cognitive task it is based on. No medical claims.' })}</p>
            </div>
            <div className="row2">
              {['Flanker', 'Stroop', 'n-back', t({ tr: 'Sürekli tanıma', en: 'Continuous recognition' }), t({ tr: 'Kural değişimi', en: 'Rule switching' })].map((x) => <span key={x}>{x}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="block-sec">
        <div className="sec-head">
          <h2>{t({ tr: 'Birini seç, başla.', en: 'Pick one and begin.' })}</h2>
          <p>{t({ tr: 'Sıra yok, kilit yok.', en: 'No order, no locks.' })}</p>
        </div>
        <div className="gallery">
          {shown.map((g) => (
            <Link key={g.id} to={`/oyun/${g.id}`} className="g-card" style={{ '--c': CATEGORIES[g.category].color } as React.CSSProperties}>
              <GameIcon category={g.category} color={CATEGORIES[g.category].color} size={52} />
              <div>
                <small>{t(CATEGORIES[g.category].name)}</small>
                <b>{g.name}</b>
                <span className="d">{t(g.description)}</span>
                <div className="go">{t({ tr: 'Oyna ›', en: 'Play ›' })}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <Link to="/oyunlar" className="btn ghost">{t({ tr: `Tüm ${GAMES.length} oyunu gör`, en: `See all ${GAMES.length} games` })}</Link>
        </div>
      </section>

      <section className="block-sec">
        <div className="sec-head"><h2>{t({ tr: 'Beceri alanları', en: 'Skill areas' })}</h2></div>
        <div className="cat-row">
          {catIds.map((c) => (
            <Link to="/oyunlar" key={c} className="cat" style={{ '--c': CATEGORIES[c].color } as React.CSSProperties}>
              <span className="cat-dot" />
              <span><b>{t(CATEGORIES[c].name)}</b><span className="cat-sub">{GAMES.filter((g) => g.category === c).length} {t({ tr: 'oyun', en: 'games' })}</span></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
