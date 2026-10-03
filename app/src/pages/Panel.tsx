import { Link } from 'react-router-dom'
import { CATEGORIES, GAMES, getGame, isPlayable } from '../games/registry'
import { RETEST_DAYS, daysSince } from '../core/fit'
import { pickWorkout, workoutCount } from '../core/workout'
import { useStore, useT } from '../core/store'
import { useUser } from '../core/auth'
import GameIcon from '../components/GameIcon'

const dayKey = (ts: number) => new Date(ts).toDateString()

function streakDays(times: number[]) {
  const days = new Set(times.map(dayKey))
  let n = 0
  const d = new Date()
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1)
  while (days.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1) }
  return n
}

export default function Panel() {
  const t = useT()
  const user = useUser()
  const { plays, profile, fits, swaps, swapOut } = useStore()
  const today = new Date().toDateString()
  const todays = plays.filter((p) => dayKey(p.at) === today)
  const streak = streakDays(plays.map((p) => p.at))
  const fit = fits[fits.length - 1]

  const set = pickWorkout({
    games: GAMES.filter(isPlayable).map((g) => ({ id: g.id, category: g.category })),
    interests: profile.interests,
    axes: fit?.axes ?? null,
    plays,
    excluded: swaps[today] ?? [],
    count: workoutCount(profile.minutes),
  })
  const doneToday = new Set(todays.map((p) => p.gameId))
  const spare = GAMES.filter((g) => isPlayable(g) && !set.some((w) => w.id === g.id) && !(swaps[today] ?? []).includes(g.id)).length
  const last = plays.slice(-5).reverse()
  const hour = new Date().getHours()
  const greet = hour < 12 ? t({ tr: 'Günaydın', en: 'Good morning' }) : hour < 18 ? t({ tr: 'İyi günler', en: 'Good afternoon' }) : t({ tr: 'İyi akşamlar', en: 'Good evening' })
  const reasonLabel = { weak: t({ tr: 'Gelişim alanın', en: 'Growth area' }), interest: t({ tr: 'İlgi alanın', en: 'Your interest' }), fresh: t({ tr: 'Yeni', en: 'New' }) }
  const retestDue = fit && daysSince(fit.at) >= RETEST_DAYS

  return (
    <section>
      <div className="page-head">
        <h1>{greet}{user && !user.guest ? `, ${user.name}` : ''}</h1>
        {!user && <p className="muted"><Link to="/giris" state={{ from: '/panel' }} className="lnk">{t({ tr: 'Giriş yap', en: 'Sign in' })}</Link> {t({ tr: 'ya da', en: 'or' })} <Link to="/kayit" className="lnk">{t({ tr: 'kayıt ol', en: 'sign up' })}</Link> {t({ tr: 've ilerlemen profilinde dursun.', en: 'to keep your progress on your profile.' })}</p>}
      </div>

      {!fit ? (
        <div className="cta-card glass">
          <div><h3>{t({ tr: 'Fit Test ile başla', en: 'Start with the Fit Test' })}</h3><p className="muted">{t({ tr: '5 kısa oyunla başlangıç seviyeni ölç; antrenmanın buna göre kurulur.', en: 'Five short games measure your starting level; your workout is built from it.' })}</p></div>
          <Link to="/fit-test" className="btn primary">{t({ tr: 'Teste Başla', en: 'Start test' })}</Link>
        </div>
      ) : (
        <div className="cta-card glass">
          <div>
            <h3>{retestDue ? t({ tr: 'Yeniden test zamanı', en: 'Time to retest' }) : `${t({ tr: 'Lumo Endeksi', en: 'Lumo Index' })}: ${fit.lpi}`}</h3>
            <p className="muted">{retestDue ? t({ tr: `Son testin ${daysSince(fit.at)} gün önceydi. Gelişimini ilk sonucunla karşılaştır.`, en: `Your last test was ${daysSince(fit.at)} days ago. Compare with your baseline.` }) : t({ tr: `Bir sonraki karşılaştırma ${RETEST_DAYS} gün sonra önerilir.`, en: `Next comparison suggested after ${RETEST_DAYS} days.` })}</p>
          </div>
          <div className="row">
            <Link to="/fit-test/sonuc" className="btn ghost">{t({ tr: 'Sonucu gör', en: 'View result' })}</Link>
            {retestDue && <Link to="/fit-test" className="btn primary">{t({ tr: 'Yeniden test', en: 'Retest' })}</Link>}
          </div>
        </div>
      )}
      {!profile.done && (
        <div className="cta-card glass slim">
          <p className="muted">{t({ tr: 'Antrenmanını kişiselleştirmek için 3 kısa soruyu yanıtla.', en: 'Answer 3 quick questions to personalize your workout.' })}</p>
          <Link to="/baslangic" className="btn ghost sm">{t({ tr: 'Kişiselleştir', en: 'Personalize' })}</Link>
        </div>
      )}

      <div className="kpis">
        <div className="kpi glass"><b>{streak}</b><span className="muted">{t({ tr: 'gün seri', en: 'day streak' })}</span></div>
        <div className="kpi glass"><b>{todays.length}</b><span className="muted">{t({ tr: 'bugün oynanan', en: 'played today' })}</span></div>
        <div className="kpi glass"><b>{plays.length}</b><span className="muted">{t({ tr: 'toplam oyun', en: 'total games' })}</span></div>
      </div>

      <h2>{t({ tr: 'Bugünün antrenmanı', en: "Today's workout" })}</h2>
      <div className="workout">
        {set.map((w, i) => {
          const g = getGame(w.id)!
          const cat = CATEGORIES[g.category]
          const done = doneToday.has(g.id)
          return (
            <div key={g.id} className={`wo glass ${done ? 'done' : ''}`}>
              <Link to={`/oyun/${g.id}`} className="wo-main">
                <span className="wo-n">{done ? '✓' : i + 1}</span>
                <GameIcon category={g.category} color={cat.color} size={44} />
                <span className="wo-t"><b>{g.name}</b><span className="muted small">{t(cat.name)} · <span className="reason">{reasonLabel[w.reason]}</span></span></span>
                <span className="play-cta">{done ? t({ tr: 'Tekrar', en: 'Again' }) : t({ tr: 'Başla →', en: 'Start →' })}</span>
              </Link>
              {!done && spare > 0 && (
                <button className="btn ghost sm" onClick={() => swapOut(today, g.id)} title={t({ tr: 'Bu oyunu bugünlük değiştir', en: 'Swap this game for today' })}>↻ {t({ tr: 'Değiştir', en: 'Swap' })}</button>
              )}
            </div>
          )
        })}
      </div>
      <p className="muted small">{t({ tr: 'Set; ilgi alanların, Fit Test’teki zayıf yönün ve son günlerde oynadıklarına göre seçilir. İstemediğin oyunu değiştirebilirsin.', en: 'The set is picked from your interests, your weaker Fit Test areas and what you played recently. You can swap out any game.' })}</p>

      <h2>{t({ tr: 'Son oyunlar', en: 'Recent games' })}</h2>
      {last.length === 0 ? (
        <p className="muted">{t({ tr: 'Henüz oyun oynamadın. İlk antrenmanına başla!', en: 'No games yet. Start your first workout!' })}</p>
      ) : (
        <div className="recent glass">
          {last.map((p, i) => (
            <div key={i} className="recent-row">
              <b>{getGame(p.gameId)?.name}</b>
              <span className="muted">{new Date(p.at).toLocaleDateString()}</span>
              <span>%{Math.round(p.accuracy * 100)}</span>
              <span>{p.medianRt ? `${p.medianRt} ms` : '—'}</span>
              <b>{p.score.toLocaleString()}</b>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
