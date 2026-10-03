import { useEffect, useRef } from 'react'

/**
 * Lumo: parlayan küçük ateş böceği. Gözleri imleci takip eder, göz kırpar, kanatları çırpar.
 * `track` kapalıysa (örn. navbar logosu) sabit bakar.
 */
export default function Mascot({ size = 200, track = false, mood = 'happy' }: { size?: number; track?: boolean; mood?: 'happy' | 'wow' }) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!track) return
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.55)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 220)
      el.style.setProperty('--px', `${(dx / d) * 5 * k}px`)
      el.style.setProperty('--py', `${(dy / d) * 4 * k}px`)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [track])

  return (
    <svg ref={ref} className="mascot" viewBox="0 0 200 200" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="mascot-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE27A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFE27A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="m-glow" cx="100" cy="112" r="92" fill="url(#mascot-glow)" />
      <g className="m-wing l"><ellipse cx="52" cy="82" rx="34" ry="20" transform="rotate(-24 52 82)" /></g>
      <g className="m-wing r"><ellipse cx="148" cy="82" rx="34" ry="20" transform="rotate(24 148 82)" /></g>
      <path className="m-ant" d="M80 62 C74 38 64 30 56 26" />
      <path className="m-ant" d="M120 62 C126 38 136 30 144 26" />
      <circle className="m-bulb" cx="55" cy="25" r="8" />
      <circle className="m-bulb b2" cx="145" cy="25" r="8" />
      <ellipse className="m-foot" cx="82" cy="170" rx="12" ry="7" />
      <ellipse className="m-foot" cx="118" cy="170" rx="12" ry="7" />
      <g className="m-body">
        <circle cx="100" cy="112" r="58" />
        <ellipse className="m-shine" cx="78" cy="84" rx="16" ry="9" transform="rotate(-30 78 84)" />
        <g className="m-eyes">
          <g className="m-eye"><circle className="m-sclera" cx="78" cy="108" r="13" /><circle className="m-pupil" cx="78" cy="108" r="6.5" /></g>
          <g className="m-eye"><circle className="m-sclera" cx="122" cy="108" r="13" /><circle className="m-pupil" cx="122" cy="108" r="6.5" /></g>
        </g>
        <circle className="m-cheek" cx="60" cy="128" r="8" />
        <circle className="m-cheek" cx="140" cy="128" r="8" />
        {mood === 'wow'
          ? <ellipse className="m-mouth wow" cx="100" cy="136" rx="8" ry="10" />
          : <path className="m-mouth" d="M84 129 Q100 148 116 129" />}
      </g>
    </svg>
  )
}
