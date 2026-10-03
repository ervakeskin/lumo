import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import type { GameProps } from '../engine/types'
import { makeRng } from '../core/rng'
import { makeCustomers, makeQuestions, ORDER_NAME, type Customer, type Order, type Question } from '../core/faces'
import { sfx } from '../core/audio'
import { useLang, useT } from '../core/store'
import { FaceSvg, OrderIcon } from '../components/Faces'
import { Feed, SHAKE, type Msg, useLater } from '../components/GameBits'

const kFor = (round: number) => Math.min(6, 2 + Math.floor(round / 2))

export default function FamiliarFaces({ session, paused, seed, startLevel }: GameProps) {
  const t = useT()
  const later = useLater(paused)
  const lang = useLang()
  const rng = useRef(makeRng(seed)).current
  const S = useRef({ round: startLevel >= 3 ? Math.min(8, (startLevel - 2) * 2) : 0, qi: 0, shownAt: 0, msgId: 0, answered: false })
  const [customers, setCustomers] = useState<Customer[]>(() => makeCustomers(kFor(S.current.round), rng))
  const [qs, setQs] = useState<Question[]>([])
  const [phase, setPhase] = useState<'study' | 'test'>('study')
  const [qi, setQi] = useState(0)
  const [msg, setMsg] = useState<Msg | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const shake = useAnimationControls()

  // Çalışma süresi: müşteri başına 1.6 sn + 1.2 sn; ileri sayar, duraklatınca durur.
  const studyMs = customers.length * 1600 + 1200
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (phase !== 'study' || paused) return
    const id = setInterval(() => setElapsed((e) => e + 100), 100)
    return () => clearInterval(id)
  }, [phase, paused])
  useEffect(() => { if (phase === 'study' && elapsed >= studyMs) startTest() }, [elapsed, phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const startTest = () => {
    const q = makeQuestions(customers, rng)
    setQs(q); setQi(0); setPicked(null)
    S.current.qi = 0; S.current.shownAt = performance.now(); S.current.answered = false
    setPhase('test')
  }
  const nextRound = () => {
    const r = S.current.round + 1
    S.current.round = r
    session.setLevel(kFor(r))
    setCustomers(makeCustomers(kFor(r), rng))
    setElapsed(0)
    setPhase('study')
  }
  const choose = (opt: string) => {
    const s = S.current
    if (paused || s.answered) return
    s.answered = true
    const q = qs[s.qi]
    const correct = opt === q.answer
    const rt = performance.now() - s.shownAt
    session.record({ correct, rt, points: 140, tag: q.kind })
    setPicked(opt)
    if (!correct) void shake.start(SHAKE)
    setMsg({ text: correct ? `${Math.round(rt)} ms` : t({ tr: 'Doğrusu vurgulandı', en: 'Correct one highlighted' }), good: correct, id: ++s.msgId })
    later(() => {
      if (s.qi + 1 >= qs.length) { sfx.levelUp(); nextRound(); return }
      s.qi += 1; s.answered = false; s.shownAt = performance.now()
      setQi(s.qi); setPicked(null)
    }, correct ? 350 : 1000)
  }

  if (phase === 'study') {
    return (
      <div className="ff">
        <span className="chip lvl">{t({ tr: `${customers.length} müşteri · ezberle`, en: `${customers.length} customers · memorize` })}</span>
        <p className="muted small">{t({ tr: 'Her müşterinin yüzünü, adını ve siparişini eşleştir.', en: 'Link each customer’s face, name and order.' })}</p>
        <div className="ff-grid">
          {customers.map((c, i) => (
            <motion.div key={i} className="ff-card glass" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
              <FaceSvg f={c.face} size={84} />
              <b>{c.name}</b>
              <div className="ff-order"><OrderIcon o={c.order} size={30} /><span className="muted small">{ORDER_NAME[c.order][lang]}</span></div>
            </motion.div>
          ))}
        </div>
        <div className="lim-clock ff-clock"><i style={{ width: `${Math.max(0, 100 - (elapsed / studyMs) * 100)}%`, animation: 'none' }} /></div>
        <button className="btn ghost sm" onClick={startTest}>{t({ tr: 'Hazırım, teste geç →', en: 'Ready, start test →' })}</button>
      </div>
    )
  }
  const q = qs[qi]
  const c = customers[q.customer]
  return (
    <div className="ff">
      <span className="chip lvl">{t({ tr: `Soru ${qi + 1}/${qs.length}`, en: `Question ${qi + 1}/${qs.length}` })}</span>
      <motion.div className="ff-ask glass" animate={shake}>
        <FaceSvg f={c.face} size={120} />
        <b>{q.kind === 'order' ? t({ tr: 'Bu müşteri ne sipariş etmişti?', en: 'What did this customer order?' }) : t({ tr: 'Bu müşterinin adı neydi?', en: 'What was this customer’s name?' })}</b>
      </motion.div>
      <div className="ff-opts">
        {q.options.map((o) => (
          <motion.button key={o} whileTap={{ scale: 0.95 }} className={`btn choice lim-btn ${picked ? (o === q.answer ? 'ok' : o === picked ? 'bad' : '') : ''}`} onClick={() => choose(o)}>
            {q.kind === 'order' ? <><OrderIcon o={o as Order} size={40} /><span>{ORDER_NAME[o as Order][lang]}</span></> : <span>{o}</span>}
          </motion.button>
        ))}
      </div>
      <Feed msg={msg} />
    </div>
  )
}
