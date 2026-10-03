// Web Audio sentezleyici: harici dosya yok, sıfır gecikme.
let ctx: AudioContext | null = null
let muted = false
export const setMuted = (m: boolean) => {
  muted = m
}

function tone(freq: number, dur = 0.14, type: OscillatorType = 'sine', gain = 0.12, delay = 0) {
  if (muted) return
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx ??= new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    const t0 = ctx.currentTime + delay
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t0)
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    o.connect(g).connect(ctx.destination)
    o.start(t0)
    o.stop(t0 + dur + 0.02)
  } catch {
    /* ses desteklenmiyor */
  }
}
const C5 = 523.25
export const sfx = {
  /** Kombo arttıkça her doğruda yarım ton yükselir. */
  correct: (combo = 0) => tone(C5 * 2 ** (Math.min(combo, 12) / 12), 0.16, 'triangle'),
  wrong: () => tone(140, 0.22, 'sine', 0.16),
  tick: () => tone(880, 0.05, 'square', 0.04),
  /** 3-2-1 sayımı: her sayıda yükselen ton, "Başla!" da parlak ve uzun. */
  count: (n: number) => (n > 0 ? tone(392 * 2 ** ((3 - n) / 6), 0.18, 'sine', 0.14) : [659.25, 987.77].forEach((f, i) => tone(f, 0.32, 'triangle', 0.13, i * 0.07))),
  flip: () => tone(660, 0.06, 'sine', 0.06),
  levelUp: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.2, 'triangle', 0.1, i * 0.08)),
  fanfare: () => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, 0.3, 'triangle', 0.1, i * 0.1)),
}
