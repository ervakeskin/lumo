// Oyunlar arasında paylaşılan SVG şekiller (emoji/clipart yok).
export const GLYPH_PATHS: string[] = [
  'M50 12 A38 38 0 1 0 50.01 12Z', // daire
  'M14 14 H86 V86 H14Z', // kare
  'M50 10 L92 86 H8Z', // üçgen
  'M50 6 L94 50 L50 94 L6 50Z', // baklava
  'M50 8 L86 29 V71 L50 92 L14 71 V29Z', // altıgen
  'M50 8 L61 38 L93 40 L68 60 L77 92 L50 74 L23 92 L32 60 L7 40 L39 38Z', // yıldız
  'M50 92 C10 60 6 30 28 20 C40 14 48 22 50 30 C52 22 60 14 72 20 C94 30 90 60 50 92Z', // kalp
  'M35 8 H65 V35 H92 V65 H65 V92 H35 V65 H8 V35 H35Z', // artı
  'M50 6 C50 6 18 46 18 64 A32 32 0 0 0 82 64 C82 46 50 6 50 6Z', // damla
  'M62 8 A42 42 0 1 0 92 66 A34 34 0 0 1 62 8Z', // hilal
  'M50 8 L92 38 L76 90 H24 L8 38Z', // beşgen
  'M8 30 H56 L92 50 L56 70 H8 L30 50Z', // ok
]
export function Glyph({ i, color, size = 64, rot = 0 }: { i: number; color: string; size?: number; rot?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={rot ? { transform: `rotate(${rot}deg)` } : undefined}>
      <path d={GLYPH_PATHS[i % GLYPH_PATHS.length]} fill={color} strokeLinejoin="round" />
    </svg>
  )
}
export const hsl = (h: number, s = 70, l = 60) => `hsl(${h} ${s}% ${l}%)`
export const PALETTE = ['#FF6B6B', '#4C9AFF', '#2FD08F', '#FFC145', '#B79BFF', '#FF8FC7', '#FF8A3D', '#3DD5F3']
