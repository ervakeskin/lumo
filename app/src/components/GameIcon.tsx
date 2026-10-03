import type { ReactElement } from 'react'
import type { CategoryId } from '../games/registry'

const GLYPH: Record<CategoryId, ReactElement> = {
  memory: (<><rect x="10" y="10" width="11" height="11" rx="3" /><rect x="27" y="10" width="11" height="11" rx="3" opacity=".35" /><rect x="10" y="27" width="11" height="11" rx="3" opacity=".35" /><rect x="27" y="27" width="11" height="11" rx="3" /></>),
  attention: (<><circle cx="24" cy="24" r="13" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="24" cy="24" r="5" /><path d="M24 5v8M24 35v8M5 24h8M35 24h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></>),
  speed: <path d="M27 6L13 26h10l-2 16 14-21H25l2-15z" />,
  flexibility: (<><path d="M10 18h24m0 0l-7-7m7 7l-7 7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M38 32H14m0 0l7-7m-7 7l7 7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity=".55" /></>),
  problem: (<><circle cx="12" cy="34" r="4.5" /><circle cx="24" cy="14" r="4.5" /><circle cx="37" cy="30" r="4.5" /><path d="M14 30l8-12M27 17l8 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></>),
  math: <path d="M24 10v28M10 24h28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />,
  language: <path d="M12 38L24 10l12 28M17 29h14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
}

export default function GameIcon({ category, color, size = 52 }: { category: CategoryId; color: string; size?: number }) {
  return (
    <span className="gicon" style={{ width: size, height: size, '--c': color } as React.CSSProperties}>
      <svg viewBox="0 0 48 48" width={size * 0.62} height={size * 0.62} fill="currentColor" aria-hidden>{GLYPH[category]}</svg>
    </span>
  )
}
