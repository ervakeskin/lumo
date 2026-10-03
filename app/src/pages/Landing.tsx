import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useT } from '../core/store'
import { CATEGORIES, GAMES, isPlayable, type CategoryId } from '../games/registry'
import GameIcon from '../components/GameIcon'

export default function Landing() {
  const t = useT()
  const nav = useNavigate()
  const playable = GAMES.filter(isPlayable)
  // Vitrin: her kategoriden bir oyun (ilk oynanabilir); kullanıcı istediğiyle başlayabilir
  const featured = (['memory', 'attention', 'speed', 'flexibility', 'problem', 'math', 'language'] as CategoryId[]).map((c) => playable.find((g) => g.category === c)).filter((g): g is (typeof playable)[number] => !!g)
  // Vitrin sırası her ziyarette karışır: hiçbir oyun "varsayılan ilk" olmasın
  const shownFeatured = useMemo(() => [...featured].sort(() => Math.random() - 0.5), []) // eslint-disable-line react-hooks/exhaustive-deps
  const surprise = () => nav(`/oyun/${playable[Math.floor(Math.random() * playable.length)].id}`)
  const cats = (['memory', 'attention', 'speed', 'flexibility', 'problem'] as CategoryId[])
  return (
    <>
      <section className="hero2">
        <div className="hero2-text">
          <span className="chip pill">{t({ tr: 'Reklamsız · Şeffaf · Bilimsel paradigmalar', en: 'Ad-free · Transparent · Science-based tasks' })}</span>
          <h1>{t({ tr: 'Zihnin için günlük 10 dakika.', en: 'Ten minutes a day for your mind.' })}</h1>
          <p className="lead">
            {t({
              tr: 'Hafıza, dikkat, hız ve esnekliği hedefleyen kısa oyunlar. Her oyun seviyene uyum sağlar, tepki sürenle birlikte ölçülür.',
              en: 'Short games targeting memory, attention, speed and flexibility. Each game adapts to your level and measures your reaction time.',
            })}
          </p>
          <div className="row left">
            <Link to="/fit-test" className="btn primary big">{t({ tr: 'Ücretsiz Fit Test', en: 'Free Fit Test' })}</Link>
            <button className="btn ghost big" onClick={() => document.getElementById('try')?.scrollIntoView({ behavior: 'smooth' })}>{t({ tr: 'Bir oyun seç ve dene', en: 'Pick a game to try' })}</button>
          </div>
          <ul className="stat-pills">
            <li><b>{GAMES.length}</b> {t({ tr: 'oyun', en: 'games' })}</li>
            <li><b>5</b> {t({ tr: 'beceri alanı', en: 'skill areas' })}</li>
            <li><b>0</b> {t({ tr: 'reklam', en: 'ads' })}</li>
          </ul>
        </div>
        <div className="hero2-art" aria-hidden>
          <div className="demo-grid">
            {Array.from({ length: 16 }, (_, i) => <motion.i key={i} className={[1, 6, 11, 12].includes(i) ? 'lit' : ''} animate={[1, 6, 11, 12].includes(i) ? { opacity: [0.35, 1, 0.35] } : {}} transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.05 }} />)}
          </div>
          <div className="demo-chip c1">+245 · 312 ms</div>
          <div className="demo-chip c2">×1.5</div>
        </div>
      </section>

      <section className="block-sec" id="try">
        <div className="try-head">
          <div>
            <h2>{t({ tr: 'İstediğin oyunla başla', en: 'Start with any game' })}</h2>
            <p className="muted">{t({ tr: 'Hesap gerekmez. Bir oyun seç ya da şansına bırak.', en: 'No account needed. Pick a game or leave it to chance.' })}</p>
          </div>
          <button className="btn primary" onClick={surprise}>{t({ tr: 'Beni şaşırt', en: 'Surprise me' })}</button>
        </div>
        <div className="try-grid">
          {shownFeatured.map((g) => (
            <Link key={g.id} to={`/oyun/${g.id}`} className="try-card glass">
              <GameIcon category={g.category} color={CATEGORIES[g.category].color} size={44} />
              <b>{g.name}</b>
              <span className="muted small">{t(CATEGORIES[g.category].name)}</span>
            </Link>
          ))}
          <Link to="/oyunlar" className="try-card glass more"><b>{t({ tr: `Tüm ${GAMES.length} oyun →`, en: `All ${GAMES.length} games →` })}</b></Link>
        </div>
      </section>

      <section className="block-sec">
        <h2>{t({ tr: 'Beş beceri, tek antrenman', en: 'Five skills, one workout' })}</h2>
        <div className="cat-row">
          {cats.map((c) => (
            <Link to="/oyunlar" key={c} className="cat glass">
              <GameIcon category={c} color={CATEGORIES[c].color} />
              <b>{t(CATEGORIES[c].name)}</b>
              <span className="muted small">{GAMES.filter((g) => g.category === c).length} {t({ tr: 'oyun', en: 'games' })}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block-sec">
        <h2>{t({ tr: 'Neden Lumo?', en: 'Why Lumo?' })}</h2>
        <div className="why">
          {[
            [{ tr: 'Tek tıkla iptal', en: 'One-click cancel' }, { tr: 'Gizli koşul yok, ücretsiz kapsam sonradan daraltılmaz.', en: 'No hidden terms; the free scope is never reduced later.' }],
            [{ tr: 'Kendi setini seç', en: 'Choose your own set' }, { tr: 'İlgilenmediğin beceriyi değiştir, sevdiğini sabitle.', en: 'Swap out skills you don’t care about; pin those you do.' }],
            [{ tr: 'Ne ölçtüğünü bil', en: 'Know what it measures' }, { tr: 'Her oyunda hangi görevi ölçtüğü açıkça yazar, tıbbi iddia yok.', en: 'Every game states what task it measures; no medical claims.' }],
            [{ tr: 'Arkadaşına meydan oku', en: 'Challenge a friend' }, { tr: 'Aynı seed, aynı oyun: skorunu link ile paylaş (yakında).', en: 'Same seed, same game: share your score by link (soon).' }],
          ].map(([h, p], i) => (
            <div className="why-item glass" key={i}>
              <h3>{t(h)}</h3>
              <p className="muted">{t(p)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
