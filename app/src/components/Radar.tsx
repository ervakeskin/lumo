import { motion } from 'framer-motion'
import type { Axis } from '../core/store'
import { AXES } from '../core/fit'

const SIZE = 320
const C = SIZE / 2
const R = 110

const point = (i: number, v: number) => {
  const a = (-Math.PI / 2) + (i * 2 * Math.PI) / AXES.length
  return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v] as const
}

/** 5 eksenli örümcek grafiği. values: 0-100. compare: önceki test (soluk). */
export default function Radar({ values, compare, labels, colors }: { values: Record<Axis, number>; compare?: Record<Axis, number>; labels: Record<Axis, string>; colors: Record<Axis, string> }) {
  const poly = (v: Record<Axis, number>) => AXES.map((ax, i) => point(i, Math.max(0.04, v[ax] / 100)).join(',')).join(' ')
  return (
    <svg viewBox={`-50 0 ${SIZE + 100} ${SIZE}`} className="radar" role="img" aria-label={AXES.map((a) => `${labels[a]} ${values[a]}`).join(', ')}>
      {[0.25, 0.5, 0.75, 1].map((lv) => (
        <polygon key={lv} points={AXES.map((_, i) => point(i, lv).join(',')).join(' ')} className="radar-ring" />
      ))}
      {AXES.map((_, i) => <line key={i} x1={C} y1={C} x2={point(i, 1)[0]} y2={point(i, 1)[1]} className="radar-spoke" />)}
      {compare && <polygon points={poly(compare)} className="radar-prev" />}
      <motion.g initial={{ scale: 0.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} style={{ transformOrigin: `${C}px ${C}px` }}>
        <polygon points={poly(values)} className="radar-area" />
        {AXES.map((ax, i) => {
          const [x, y] = point(i, Math.max(0.04, values[ax] / 100))
          return <circle key={ax} cx={x} cy={y} r="5" fill={colors[ax]} stroke="#0b1020" strokeWidth="2" />
        })}
      </motion.g>
      {AXES.map((ax, i) => {
        const [x, y] = point(i, 1.25)
        return (
          <text key={ax} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="radar-label" fill={colors[ax]}>{labels[ax]}</text>
        )
      })}
    </svg>
  )
}
