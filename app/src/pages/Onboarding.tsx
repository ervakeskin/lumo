import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore, useT, type Profile } from '../core/store'
import type { CategoryId } from '../games/registry'

type L = { tr: string; en: string }
const AREAS: { id: CategoryId; label: L; hint: L }[] = [
  { id: 'memory', label: { tr: 'Hafıza', en: 'Memory' }, hint: { tr: 'İsim, yer ve şeyleri akılda tutmak', en: 'Remembering names, places and things' } },
  { id: 'attention', label: { tr: 'Odaklanma', en: 'Focus' }, hint: { tr: 'Dikkatimi dağıtan şeylere rağmen odakta kalmak', en: 'Staying on task despite distractions' } },
  { id: 'speed', label: { tr: 'Karar hızı', en: 'Decision speed' }, hint: { tr: 'Daha çabuk algılamak ve tepki vermek', en: 'Perceiving and reacting faster' } },
  { id: 'flexibility', label: { tr: 'Esneklik', en: 'Flexibility' }, hint: { tr: 'Görevler ve kurallar arasında hızlı geçiş', en: 'Switching quickly between tasks and rules' } },
  { id: 'problem', label: { tr: 'Problem çözme', en: 'Problem solving' }, hint: { tr: 'Mantık, örüntü ve planlama', en: 'Logic, patterns and planning' } },
  { id: 'math', label: { tr: 'Zihinden işlem', en: 'Mental math' }, hint: { tr: 'Sayılarla hızlı ve rahat çalışmak', en: 'Working with numbers quickly' } },
]
const MINUTES: { v: number; label: L }[] = [
  { v: 5, label: { tr: '5 dakika', en: '5 minutes' } }, { v: 10, label: { tr: '10 dakika', en: '10 minutes' } }, { v: 15, label: { tr: '15 dakika ya da fazlası', en: '15+ minutes' } },
]
const TIMES: { v: NonNullable<Profile['timeOfDay']>; label: L }[] = [
  { v: 'morning', label: { tr: 'Sabah', en: 'Morning' } }, { v: 'noon', label: { tr: 'Öğlen', en: 'Midday' } }, { v: 'evening', label: { tr: 'Akşam', en: 'Evening' } },
]

export default function Onboarding() {
  const t = useT()
  const nav = useNavigate()
  const setProfile = useStore((s) => s.setProfile)
  const [step, setStep] = useState(0)
  const [areas, setAreas] = useState<CategoryId[]>([])
  const [minutes, setMinutes] = useState(10)
  const [time, setTime] = useState<Profile['timeOfDay']>(null)
  const total = 3

  const finish = (skip = false) => {
    // İlgi ağırlık vektörü: seçilen 1.0, seçilmeyen 0.25 (hiç seçim yoksa hepsi nötr 0.4)
    const interests: Profile['interests'] = {}
    if (!skip && areas.length) for (const a of AREAS) interests[a.id] = areas.includes(a.id) ? 1 : 0.25
    setProfile({ done: true, interests, minutes, timeOfDay: skip ? null : time })
    nav('/fit-test', { replace: true })
  }
  const toggle = (id: CategoryId) => setAreas((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))

  const opt = (active: boolean, label: string, onClick: () => void, hint?: string) => (
    <motion.button key={label} whileTap={{ scale: 0.97 }} className={`opt ${active ? 'on' : ''}`} onClick={onClick} aria-pressed={active}>
      <b>{label}</b>{hint && <span className="muted small">{hint}</span>}
    </motion.button>
  )

  return (
    <div className="page-wrap">
      <section className="ob glass">
        <div className="ob-progress" aria-label={`${step + 1}/${total}`}><i style={{ width: `${((step + 1) / total) * 100}%` }} /></div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} transition={{ duration: 0.2 }}>
            {step === 0 && (<>
              <h1>{t({ tr: 'Hangi alanları geliştirmek istersin?', en: 'Which areas do you want to improve?' })}</h1>
              <p className="muted">{t({ tr: 'İstediğin kadar seç. Günlük antrenmanın buna göre şekillenir.', en: 'Pick as many as you like. Your daily workout adapts to it.' })}</p>
              <div className="opts">{AREAS.map((a) => opt(areas.includes(a.id), t(a.label), () => toggle(a.id), t(a.hint)))}</div>
            </>)}
            {step === 1 && (<>
              <h1>{t({ tr: 'Günde ne kadar zaman ayırabilirsin?', en: 'How much time can you spend daily?' })}</h1>
              <p className="muted">{t({ tr: 'Antrenmandaki oyun sayısını buna göre ayarlarız.', en: 'We set the number of games in your workout from this.' })}</p>
              <div className="opts">{MINUTES.map((m) => opt(minutes === m.v, t(m.label), () => setMinutes(m.v)))}</div>
            </>)}
            {step === 2 && (<>
              <h1>{t({ tr: 'Günün hangi saatinde daha zinde hissedersin?', en: 'When do you feel sharpest?' })}</h1>
              <p className="muted">{t({ tr: 'İsteğe bağlı. Hatırlatma zamanı için kullanılır (bu demoda bildirim yok).', en: 'Optional. Used for reminder timing (no notifications in this demo).' })}</p>
              <div className="opts">{TIMES.map((x) => opt(time === x.v, t(x.label), () => setTime(x.v)))}</div>
            </>)}
          </motion.div>
        </AnimatePresence>
        <div className="ob-nav">
          <button className="btn ghost" onClick={() => (step === 0 ? finish(true) : setStep(step - 1))}>{step === 0 ? t({ tr: 'Atla', en: 'Skip' }) : t({ tr: '← Önceki', en: '← Previous' })}</button>
          <button className="btn primary" onClick={() => (step === total - 1 ? finish() : setStep(step + 1))}>{step === total - 1 ? t({ tr: 'Bitir → Fit Test', en: 'Finish → Fit Test' }) : t({ tr: 'İleri →', en: 'Next →' })}</button>
        </div>
      </section>
    </div>
  )
}
