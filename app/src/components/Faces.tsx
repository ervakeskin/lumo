import { HAIRS, SKINS, type Face, type Order } from '../core/faces'

export function FaceSvg({ f, size = 96 }: { f: Face; size?: number }) {
  const skin = SKINS[f.skin], hair = HAIRS[f.hair]
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      {f.hairStyle === 1 && <path d="M18 60 C10 20 30 8 50 8 C70 8 90 20 82 60 L82 78 L70 78 L70 44 L30 44 L30 78 L18 78Z" fill={hair} />}
      {f.hairStyle === 2 && <circle cx="50" cy="10" r="12" fill={hair} />}
      <circle cx="50" cy="52" r="32" fill={skin} />
      {f.hairStyle === 0 && <path d="M18 46 C18 16 82 16 82 46 C70 30 30 30 18 46Z" fill={hair} />}
      {f.hairStyle === 1 && <path d="M18 46 C18 16 82 16 82 46 C70 34 30 34 18 46Z" fill={hair} />}
      {f.hairStyle === 2 && <path d="M18 46 C20 22 80 22 82 46 C68 32 32 32 18 46Z" fill={hair} />}
      {f.hairStyle === 3 && <path d="M20 40 L30 18 L40 34 L50 14 L60 34 L70 18 L80 40 C64 30 36 30 20 40Z" fill={hair} />}
      {f.eyes === 0 && <><circle cx="38" cy="52" r="3.4" fill="#1b1024" /><circle cx="62" cy="52" r="3.4" fill="#1b1024" /></>}
      {f.eyes === 1 && <><ellipse cx="38" cy="52" r="4.6" ry="3" fill="#1b1024" /><ellipse cx="62" cy="52" r="4.6" ry="3" fill="#1b1024" /></>}
      {f.eyes === 2 && <><path d="M32 53 Q38 47 44 53" stroke="#1b1024" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M56 53 Q62 47 68 53" stroke="#1b1024" strokeWidth="3" fill="none" strokeLinecap="round" /></>}
      {f.mouth === 0 && <path d="M38 68 Q50 78 62 68" stroke="#7a2e2e" strokeWidth="3.4" fill="none" strokeLinecap="round" />}
      {f.mouth === 1 && <path d="M40 70 H60" stroke="#7a2e2e" strokeWidth="3.4" strokeLinecap="round" />}
      {f.mouth === 2 && <ellipse cx="50" cy="70" rx="7" ry="5" fill="#7a2e2e" />}
      {f.glasses && <g stroke="#1b1024" strokeWidth="2.4" fill="rgba(255,255,255,0.12)"><circle cx="38" cy="52" r="9" /><circle cx="62" cy="52" r="9" /><path d="M47 52 H53" /></g>}
    </svg>
  )
}

export function OrderIcon({ o, size = 44 }: { o: Order; size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden>
      {o === 'coffee' && <><path d="M8 18 H34 V30 C34 38 28 42 21 42 C14 42 8 38 8 30Z" fill="#c68b59" /><path d="M34 21 H40 A5 5 0 0 1 40 32 H33" fill="none" stroke="#c68b59" strokeWidth="3.5" /><path d="M14 8 Q17 12 14 15 M22 8 Q25 12 22 15" stroke="#eef1fb" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".7" /></>}
      {o === 'tea' && <><path d="M8 20 H34 V30 C34 37 28 41 21 41 C14 41 8 37 8 30Z" fill="#e9eefc" /><path d="M11 24 H31 V30 C31 34 27 37 21 37 C15 37 11 34 11 30Z" fill="#c95d3c" /><path d="M34 22 H39 A4.5 4.5 0 0 1 39 31 H33" fill="none" stroke="#e9eefc" strokeWidth="3" /></>}
      {o === 'cake' && <><path d="M6 40 V26 H42 V40Z" fill="#f4b6c8" /><path d="M6 26 C10 20 16 24 20 20 C26 24 32 20 36 24 C38 24 40 24 42 26Z" fill="#fff2f6" /><circle cx="24" cy="14" r="4" fill="#ff5f6d" /><path d="M24 8 V11" stroke="#8fd3ff" strokeWidth="2.4" /></>}
      {o === 'burger' && <><path d="M8 20 C8 8 40 8 40 20Z" fill="#e0a25a" /><rect x="7" y="22" width="34" height="5" rx="2.5" fill="#5fb85f" /><rect x="7" y="27" width="34" height="6" rx="3" fill="#7a3f22" /><path d="M8 35 H40 C40 42 8 42 8 35Z" fill="#e0a25a" /></>}
      {o === 'apple' && <><path d="M24 14 C10 8 6 26 12 36 C16 42 20 42 24 40 C28 42 32 42 36 36 C42 26 38 8 24 14Z" fill="#e5484d" /><path d="M24 14 C24 8 27 6 31 6" stroke="#5b3a29" strokeWidth="3" fill="none" strokeLinecap="round" /><path d="M28 10 C33 6 38 8 38 12 C33 14 29 13 28 10Z" fill="#4caf50" /></>}
      {o === 'cookie' && <><circle cx="24" cy="26" r="17" fill="#d9a066" /><circle cx="18" cy="21" r="2.6" fill="#5b3a29" /><circle cx="29" cy="20" r="2.6" fill="#5b3a29" /><circle cx="24" cy="31" r="2.6" fill="#5b3a29" /><circle cx="15" cy="31" r="2.2" fill="#5b3a29" /><circle cx="33" cy="30" r="2.2" fill="#5b3a29" /></>}
      {o === 'icecream' && <><path d="M14 24 L24 44 L34 24Z" fill="#e0a25a" /><circle cx="18" cy="20" r="7" fill="#ff9ec4" /><circle cx="30" cy="20" r="7" fill="#8fd3ff" /><circle cx="24" cy="13" r="7" fill="#fff2c9" /><circle cx="24" cy="6" r="2.6" fill="#e5484d" /></>}
      {o === 'juice' && <><path d="M11 12 H37 L33 42 H15Z" fill="#ffd9a0" opacity=".55" /><path d="M13 22 H35 L33 42 H15Z" fill="#ff9a3d" /><path d="M28 4 L24 20" stroke="#4caf50" strokeWidth="3" strokeLinecap="round" /><circle cx="37" cy="12" r="5" fill="#ffb347" /></>}
      {o === 'pizza' && <><path d="M6 12 C20 4 30 4 42 12 L24 44Z" fill="#f2c265" /><path d="M6 12 C20 4 30 4 42 12" stroke="#c98b3a" strokeWidth="3.6" fill="none" /><circle cx="18" cy="17" r="3" fill="#d1453b" /><circle cx="29" cy="16" r="3" fill="#d1453b" /><circle cx="24" cy="27" r="3" fill="#d1453b" /></>}
    </svg>
  )
}
