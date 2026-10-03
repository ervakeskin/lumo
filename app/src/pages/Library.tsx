import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES, GAMES, isPlayable, type CategoryId } from '../games/registry'
import { useStore, useT } from '../core/store'
import GameIcon from '../components/GameIcon'

export default function Library() {
  const t = useT()
  const best = useStore((s) => s.best)
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const list = GAMES.filter((g) => filter === 'all' || g.category === filter)
  return (
    <section>
      <div className="page-head">
        <h1>{t({ tr: 'Oyunlar', en: 'Games' })}</h1>
        <p className="muted">{t({ tr: `${GAMES.filter(isPlayable).length} oyun oynanabilir, kalanı yolda.`, en: `${GAMES.filter(isPlayable).length} games playable, the rest are on the way.` })}</p>
      </div>
      <div className="filters" role="tablist">
        <button className={`chip-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>{t({ tr: 'Tümü', en: 'All' })}</button>
        {(Object.keys(CATEGORIES) as CategoryId[]).map((c) => (
          <button key={c} className={`chip-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{t(CATEGORIES[c].name)}</button>
        ))}
      </div>
      <div className="grid">
        {list.map((g, i) => {
          const cat = CATEGORIES[g.category]
          const ok = isPlayable(g)
          const card = (
            <motion.div className={`card glass ${ok ? 'live' : 'soon'}`} style={{ '--c': cat.color } as React.CSSProperties} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} whileHover={ok ? { y: -4 } : undefined}>
              <div className="card-top">
                <GameIcon category={g.category} color={cat.color} />
              </div>
              <h3>{g.name}</h3>
              <span className="muted small">{t(cat.name)} · {t(g.paradigm)}</span>
              <p className="muted">{t(g.description)}</p>
              <div className="card-foot">
                {ok ? <span className="play-cta">{best[g.id] ? `★ ${best[g.id].toLocaleString()}` : t({ tr: 'Oyna →', en: 'Play →' })}</span> : <span className="muted">{t({ tr: 'Yakında', en: 'Coming soon' })}</span>}
              </div>
            </motion.div>
          )
          return ok ? <Link key={g.id} to={`/oyun/${g.id}`}>{card}</Link> : <div key={g.id}>{card}</div>
        })}
      </div>
    </section>
  )
}
