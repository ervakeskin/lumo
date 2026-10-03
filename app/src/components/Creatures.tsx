import type { Cell, Theme } from '../core/flanker'

// Tüm sprite'lar SAĞA bakacak şekilde çizilir; yön CSS dönüşümüyle verilir.
const ROT: Record<string, string> = { right: 'none', left: 'scaleX(-1)', up: 'rotate(-90deg)', down: 'rotate(90deg)' }

function Bird({ d }: { d: number }) {
  return (
    <>
      <g className="fin back" style={{ animationDelay: `${d}ms` }}><path d="M30 30 C26 12 38 4 52 6 C44 14 42 22 42 30Z" /></g>
      <path className="body" d="M8 36 C14 22 34 20 50 28 L72 33 L50 40 C34 50 14 50 8 36Z" />
      <path className="beak" d="M68 32 L78 34 L68 37Z" />
      <g className="fin" style={{ animationDelay: `${d}ms` }}><path d="M24 34 C20 52 34 60 48 58 C40 50 38 42 38 34Z" /></g>
      <circle cx="56" cy="31" r="2.2" className="eye" />
    </>
  )
}
function Fish({ d }: { d: number }) {
  return (
    <>
      <g className="fin tail" style={{ animationDelay: `${d}ms` }}><path d="M18 32 L2 18 L7 32 L2 46Z" /></g>
      <path className="body" d="M14 32 C24 12 52 12 68 32 C52 52 24 52 14 32Z" />
      <path className="fin top" d="M30 20 C34 10 44 10 48 19Z" />
      <path className="beak" d="M62 30 L74 32 L62 34Z" opacity="0" />
      <circle cx="56" cy="28" r="3" className="eye-w" />
      <circle cx="57" cy="28" r="1.6" className="eye" />
      <path d="M40 24 C44 30 44 36 40 42" stroke="rgba(0,0,0,.18)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  )
}
function Plane({ d }: { d: number }) {
  return (
    <>
      <g className="fin back" style={{ animationDelay: `${d}ms` }}><path d="M30 30 L16 10 L38 10 L52 30Z" /></g>
      <path className="body" d="M6 30 L58 28 C68 28 76 31 78 33 C76 35 68 38 58 38 L6 36Z" />
      <g className="fin" style={{ animationDelay: `${d}ms` }}><path d="M30 38 L16 58 L38 58 L52 38Z" /></g>
      <path className="beak" d="M6 30 L1 28 L1 38 L6 36Z" />
      <circle cx="58" cy="32" r="3" className="eye" />
    </>
  )
}
function Butterfly({ d }: { d: number }) {
  return (
    <>
      <g className="fin back" style={{ animationDelay: `${d}ms` }}><path d="M34 30 C26 6 50 2 52 26Z" /></g>
      <path className="body" d="M14 32 C22 28 54 28 66 32 C54 38 22 38 14 32Z" />
      <g className="fin" style={{ animationDelay: `${d}ms` }}><path d="M34 34 C24 60 50 62 52 38Z" /></g>
      <path d="M66 32 C72 24 76 22 78 20 M66 32 C72 30 76 30 79 28" stroke="#3b2a55" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="31" r="2" className="eye" />
    </>
  )
}
function Whale({ d }: { d: number }) {
  return (
    <>
      <g className="fin tail" style={{ animationDelay: `${d}ms` }}><path d="M16 34 C8 30 4 22 2 14 C10 16 16 20 22 28Z M16 34 C8 38 4 46 2 52 C10 50 16 46 22 38Z" /></g>
      <path className="body" d="M12 34 C14 14 56 10 70 30 C72 42 56 52 36 52 C22 52 12 46 12 34Z" />
      <path d="M26 46 C40 52 58 48 66 38" stroke="rgba(255,255,255,.35)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path className="fin top" d="M40 48 C44 58 54 58 56 52Z" />
      <circle cx="58" cy="30" r="2.4" className="eye" />
    </>
  )
}
function Bee({ d }: { d: number }) {
  return (
    <>
      <g className="fin back" style={{ animationDelay: `${d}ms` }}><ellipse cx="38" cy="22" rx="10" ry="8" /></g>
      <path className="body" d="M12 34 C14 20 56 18 66 30 C66 44 20 50 12 34Z" />
      <path d="M26 24 L22 44 M38 22 L34 46 M50 24 L46 44" stroke="#3b2a1a" strokeWidth="5" fill="none" />
      <path className="beak" d="M12 34 L4 36 L12 38Z" />
      <g className="fin" style={{ animationDelay: `${d}ms` }}><ellipse cx="44" cy="46" rx="9" ry="7" /></g>
      <circle cx="58" cy="29" r="2.4" className="eye" />
    </>
  )
}
function Rocket({ d }: { d: number }) {
  return (
    <>
      <g className="fin tail" style={{ animationDelay: `${d}ms` }}><path d="M12 32 L0 24 L0 40Z" /></g>
      <path className="body" d="M12 24 L52 22 C66 24 76 30 78 32 C76 34 66 40 52 42 L12 40Z" />
      <path className="fin top" d="M20 24 L10 10 L36 22Z M20 40 L10 54 L36 42Z" />
      <circle cx="50" cy="32" r="5.5" className="eye-w" />
      <circle cx="50" cy="32" r="3.2" fill="#4aa8ff" />
    </>
  )
}
function Turtle({ d }: { d: number }) {
  return (
    <>
      <g className="fin back" style={{ animationDelay: `${d}ms` }}><path d="M22 28 L10 18 L24 24Z M22 40 L10 50 L24 44Z" /></g>
      <path className="body" d="M12 34 C14 12 52 12 56 34Z" />
      <path d="M22 32 L28 18 M34 32 L34 16 M46 32 L40 18" stroke="rgba(0,0,0,.22)" strokeWidth="2" fill="none" />
      <path className="beak" d="M54 30 C62 26 72 28 74 34 C72 40 62 40 54 38Z" />
      <g className="fin" style={{ animationDelay: `${d}ms` }}><path d="M34 36 L44 52 L52 46 L48 36Z" /></g>
      <circle cx="68" cy="32" r="2.2" className="eye" />
    </>
  )
}
const SPRITES: Record<Theme, (p: { d: number }) => React.JSX.Element> = {
  bird: Bird, fish: Fish, plane: Plane, butterfly: Butterfly, whale: Whale, bee: Bee, rocket: Rocket, turtle: Turtle,
}
function Bubble() {
  return <><circle cx="40" cy="32" r="12" className="bubble" /><circle cx="35" cy="27" r="3" className="bubble-hi" /></>
}

export default function Creature({ theme, dir, lead, glow, delay }: { theme: Theme; dir: Cell; lead?: boolean; glow?: boolean; delay: number }) {
  return (
    <svg viewBox="0 0 80 64" width="100%" className={`cr ${theme} ${lead ? 'lead' : ''} ${lead && glow ? 'glow' : ''}`} style={{ transform: dir === 'none' ? undefined : ROT[dir] }} aria-hidden>
      {dir === 'none' ? <Bubble /> : (() => { const Sprite = SPRITES[theme]; return <Sprite d={delay} /> })()}
    </svg>
  )
}
