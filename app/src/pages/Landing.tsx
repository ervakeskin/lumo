import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '../core/store'
import { CATEGORIES, GAMES, isPlayable, type CategoryId } from '../games/registry'
import GameIcon from '../components/GameIcon'
import Mascot from '../components/Mascot'

export default function Landing() {
  const t = useT()
  const nav = useNavigate()
  const playable = GAMES.filter(isPlayable)
  const catIds = Object.keys(CATEGORIES) as CategoryId[]
  // Vitrin sırası her ziyarette karışır: hiçbir oyun "varsayılan ilk" olmasın
  const shown = useMemo(() => [...playable].sort(() => Math.random() - 0.5).slice(0, 11), []) // eslint-disable-line react-hooks/exhaustive-deps
  const surprise = () => nav(`/oyun/${playable[Math.floor(Math.random() * playable.length)].id}`)
  const ribbon = [...GAMES, ...GAMES]

  return (
    <>
      <section className="hero3">
        <div className="hero3-text">
          <span className="sticker rot-l">{t({ tr: 'Reklam yok · Kilit yok · Hesap şart değil', en: 'No ads · No locks · No account needed' })}</span>
          <h1>
            {t({ tr: 'Zihnin için ', en: 'Give your mind ' })}
            <mark>{t({ tr: 'günlük 10 dakika', en: 'ten minutes a day' })}</mark>
            {t({ tr: ' ışık.', en: ' of light.' })}
          </h1>
          <p className="lead">
            {t({
              tr: 'Hafıza, dikkat, hız ve esnekliği çalıştıran kısa oyunlar. Hepsi açık, hepsi ücretsiz. Seviyen sana göre ayarlanır, tepki süren ölçülür.',
              en: 'Short games that train memory, attention, speed and flexibility. All open, all free. Difficulty adapts to you and your reaction time is measured.',
            })}
          </p>
          <div className="row left">
            <Link to="/fit-test" className="btn primary big">{t({ tr: 'Fit Test ile başla', en: 'Start with the Fit Test' })}</Link>
            <button className="btn ghost big" onClick={surprise}>{t({ tr: 'Beni şaşırt ✦', en: 'Surprise me ✦' })}</button>
          </div>
          <ul className="stat-pills">
            <li><b>{GAMES.length}</b> {t({ tr: 'oyun', en: 'games' })}</li>
            <li><b>{catIds.length}</b> {t({ tr: 'beceri alanı', en: 'skill areas' })}</li>
            <li><b>0</b> {t({ tr: 'reklam', en: 'ads' })}</li>
          </ul>
        </div>

        <div className="hero3-art" aria-hidden>
          <div className="blob" />
          <div className="mascot-wrap"><Mascot size={260} track /></div>
          <div className="stk s1">
            <div className="mini-grid">{Array.from({ length: 9 }, (_, i) => <i key={i} className={[0, 4, 5].includes(i) ? 'on' : ''} />)}</div>
          </div>
          <div className="stk s2"><span>KAR</span><em>…puz</em></div>
          <div className="stk s3"><b>←</b><b className="hot">→</b></div>
          <div className="stk s4">+245<small>312 ms</small></div>
          <div className="stk s5">×1.5</div>
        </div>
      </section>

      <div className="ribbon" aria-hidden>
        <div className="ribbon-track">
          {ribbon.map((g, i) => (
            <span key={i} style={{ '--c': CATEGORIES[g.category].color } as React.CSSProperties}><i />{g.name}</span>
          ))}
        </div>
      </div>

      <section className="block-sec" id="try">
        <div className="try-head">
          <div>
            <h2>{t({ tr: 'İstediğinle başla', en: 'Start with any game' })}</h2>
            <p className="muted">{t({ tr: 'Sıra yok, kilit yok. Dokun ve oyna.', en: 'No order, no locks. Tap and play.' })}</p>
          </div>
          <Link to="/oyunlar" className="btn ghost">{t({ tr: `Tüm ${GAMES.length} oyun →`, en: `All ${GAMES.length} games →` })}</Link>
        </div>
        <div className="try-grid">
          {shown.map((g, i) => (
            <Link key={g.id} to={`/oyun/${g.id}`} className="try-card" style={{ '--c': CATEGORIES[g.category].color, '--r': `${[-1.6, 1.2, -0.8, 1.8, -1.2][i % 5]}deg` } as React.CSSProperties}>
              <GameIcon category={g.category} color={CATEGORIES[g.category].color} size={46} />
              <b>{g.name}</b>
              <span>{t(CATEGORIES[g.category].name)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block-sec">
        <h2>{t({ tr: `${catIds.length} beceri, tek antrenman`, en: `${catIds.length} skills, one workout` })}</h2>
        <div className="cat-row">
          {catIds.map((c) => (
            <Link to="/oyunlar" key={c} className="cat" style={{ '--c': CATEGORIES[c].color } as React.CSSProperties}>
              <span className="cat-n">{GAMES.filter((g) => g.category === c).length}</span>
              <b>{t(CATEGORIES[c].name)}</b>
              <span className="cat-sub">{t({ tr: 'oyun', en: 'games' })}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block-sec">
        <h2>{t({ tr: 'Neden Lumo?', en: 'Why Lumo?' })}</h2>
        <div className="why">
          {[
            [{ tr: 'Hepsi açık', en: 'Everything open' }, { tr: 'Abonelik, kilit, reklam yok. Hangi oyunu istersen onu oyna.', en: 'No subscription, no locks, no ads. Play whichever game you want.' }],
            [{ tr: 'Ne ölçtüğünü bil', en: 'Know what it measures' }, { tr: 'Her oyunda hangi görevi ölçtüğü açıkça yazar, tıbbi iddia yok.', en: 'Every game states what task it measures; no medical claims.' }],
            [{ tr: 'Sana göre ayarlanır', en: 'Adapts to you' }, { tr: 'Seviye doğruluğuna göre yükselir ya da düşer; ne çok kolay ne imkânsız.', en: 'Difficulty rises or falls with your accuracy: never trivial, never impossible.' }],
            [{ tr: 'Verin cihazında', en: 'Your data stays here' }, { tr: 'Sunucuya veri gönderilmez, skorların senin tarayıcında durur.', en: 'Nothing is sent to a server; your scores stay in your browser.' }],
          ].map(([h, p], i) => (
            <div className="why-item" key={i} style={{ '--n': `"${i + 1}"` } as React.CSSProperties}>
              <h3>{t(h)}</h3>
              <p>{t(p)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
