import Mascot from '../components/Mascot'
import { useEffect, useState } from 'react'
import { animate, motion } from 'framer-motion'
import { CATEGORIES, type GameMeta } from '../games/registry'
import BackButton from '../components/BackButton'
import { useStore, useT, type PlayRecord } from '../core/store'
import { useAuth } from '../core/auth'
import AuthModal from '../components/AuthModal'
import { flankerEffect, mean } from '../core/adaptive'
import type { TrialResult } from './types'

export interface ResultData {
  rec: PlayRecord
  trials: TrialResult[]
  prevBest: number
  isNewBest: boolean
  prevRt: number
  maxCombo: number
}

function useCountUp(to: number) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const c = animate(0, to, { duration: 1.2, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [to])
  return v
}

export default function ResultScreen({ game, data, onReplay, onLibrary }: { game: GameMeta; data: ResultData; onReplay: () => void; onLibrary: () => void }) {
  const t = useT()
  const { rec, trials, prevBest, isNewBest, prevRt } = data
  const shown = useCountUp(rec.score)
  // Kayıt hatırlatması: hesap yoksa ilk oyundan sonra, hâlâ yoksa 4. oyundan sonra bir kez daha
  const { current, prompted, markPrompted } = useAuth()
  const playCount = useStore((s) => s.plays.length)
  const shouldPrompt = !current && ((prompted === 0 && playCount >= 1) || (prompted === 1 && playCount >= 4))
  const [showAuth, setShowAuth] = useState(false)
  useEffect(() => {
    if (!shouldPrompt) return
    const id = setTimeout(() => { setShowAuth(true); markPrompted() }, 1700)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const color = CATEGORIES[game.category].color

  // Gerçek hesaplanmış yorum (şablon sabit metin değil)
  const notes: string[] = []
  if (prevRt > 0 && rec.medianRt > 0) {
    const d = Math.round(((prevRt - rec.medianRt) / prevRt) * 100)
    if (Math.abs(d) >= 2)
      notes.push(d > 0 ? t({ tr: `Medyan tepki süren önceki oyuna göre %${d} düştü.`, en: `Your median reaction time dropped ${d}% vs last game.` }) : t({ tr: `Medyan tepki süren önceki oyuna göre %${-d} arttı.`, en: `Your median reaction time rose ${-d}% vs last game.` }))
  }
  if (rec.accuracy >= 0.9) notes.push(t({ tr: 'Doğruluğun %90 üzerinde: zorluk bir sonraki oyunda artacak.', en: 'Accuracy above 90%: difficulty will step up next game.' }))
  else if (rec.accuracy < 0.6) notes.push(t({ tr: 'Doğruluğun düşük kaldı; bir sonraki oyunda biraz daha yavaş ve dikkatli dene.', en: 'Accuracy was low; try slower and more careful next game.' }))
  const cong = trials.filter((x) => x.correct && x.rt != null && x.tag === 'congruent').map((x) => x.rt as number)
  const incong = trials.filter((x) => x.correct && x.rt != null && x.tag === 'incongruent').map((x) => x.rt as number)
  if (cong.length >= 3 && incong.length >= 3) {
    const fe = flankerEffect(cong, incong)
    notes.push(t({ tr: `Flanker etkisi: çeldirici kuşlar seni ortalama ${fe} ms yavaşlattı (uyumlu ${Math.round(mean(cong))} ms, uyumsuz ${Math.round(mean(incong))} ms).`, en: `Flanker effect: distractor birds slowed you by ${fe} ms on average (congruent ${Math.round(mean(cong))} ms, incongruent ${Math.round(mean(incong))} ms).` }))
  }
  if (data.maxCombo >= 5) notes.push(t({ tr: `En uzun doğru serin: ${data.maxCombo}.`, en: `Longest correct streak: ${data.maxCombo}.` }))

  return (
    <div className="result">
      <div className="result-top"><BackButton to="/oyunlar" replace /></div>
      <motion.div className="glass result-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="result-mascot"><Mascot size={92} mood={isNewBest ? 'wow' : 'happy'} /></div>
        <div className="muted">{game.name}</div>
        <div className="big-score" style={{ color }}>{shown.toLocaleString()}</div>
        {isNewBest && <div className="badge-best">★ {t({ tr: 'Yeni kişisel rekor!', en: 'New personal best!' })}</div>}

        <div className="stats">
          <Stat label={t({ tr: 'Doğruluk', en: 'Accuracy' })} value={`%${Math.round(rec.accuracy * 100)}`} />
          <Stat label={t({ tr: 'Medyan tepki', en: 'Median RT' })} value={rec.medianRt ? `${rec.medianRt} ms` : '—'} />
          <Stat label={t({ tr: 'Önceki en iyi', en: 'Previous best' })} value={prevBest ? prevBest.toLocaleString() : '—'} />
        </div>

        <AccuracyChart trials={trials} color={color} label={t({ tr: 'Round bazlı doğruluk (10 denemelik dilimler)', en: 'Accuracy by block (10 trials each)' })} />
        <RtHistogram trials={trials} color={color} label={t({ tr: 'Tepki süresi dağılımı', en: 'Reaction time distribution' })} />

        {notes.length > 0 && <ul className="notes">{notes.map((n) => <li key={n}>{n}</li>)}</ul>}

        <div className="row">
          <button className="btn primary" onClick={onReplay} autoFocus>{t({ tr: 'Tekrar Oyna', en: 'Play again' })}</button>
          <button className="btn ghost" onClick={onLibrary}>{t({ tr: 'Diğer Oyunlar', en: 'Other games' })}</button>
        </div>
      </motion.div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="stat"><div className="stat-v">{value}</div><div className="muted">{label}</div></div>
)

function AccuracyChart({ trials, color, label }: { trials: TrialResult[]; color: string; label: string }) {
  const blocks: number[] = []
  for (let i = 0; i < trials.length; i += 10) {
    const b = trials.slice(i, i + 10)
    blocks.push(b.filter((x) => x.correct).length / b.length)
  }
  if (blocks.length < 2) return null
  const w = 300, h = 70
  const pts = blocks.map((v, i) => `${(i / (blocks.length - 1)) * w},${h - v * (h - 6) - 3}`).join(' ')
  return (
    <figure className="chart">
      <figcaption className="muted">{label}</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
        {blocks.map((v, i) => <circle key={i} cx={(i / (blocks.length - 1)) * w} cy={h - v * (h - 6) - 3} r="3.5" fill={color} />)}
      </svg>
    </figure>
  )
}

function RtHistogram({ trials, color, label }: { trials: TrialResult[]; color: string; label: string }) {
  const rts = trials.filter((x) => x.rt != null).map((x) => x.rt as number)
  if (rts.length < 5) return null
  const lo = Math.min(...rts), hi = Math.max(...rts)
  const bins = 8
  const step = Math.max(1, (hi - lo) / bins)
  const counts = Array(bins).fill(0)
  rts.forEach((r) => counts[Math.min(bins - 1, Math.floor((r - lo) / step))]++)
  const max = Math.max(...counts)
  return (
    <figure className="chart">
      <figcaption className="muted">{label} ({Math.round(lo)}–{Math.round(hi)} ms)</figcaption>
      <svg viewBox="0 0 300 70" role="img" aria-label={label}>
        {counts.map((c, i) => <rect key={i} x={i * 37.5 + 2} y={68 - (c / max) * 62} width="33" height={(c / max) * 62} rx="4" fill={color} opacity="0.85" />)}
      </svg>
    </figure>
  )
}
