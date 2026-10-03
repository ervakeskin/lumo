/** Oyun sözleşmesi: oyun mantığı GameShell'e sadece bu arayüzle konuşur. */
export interface TrialResult {
  correct: boolean
  /** ms cinsinden tepki süresi (varsa) */
  rt?: number
  /** ham puan (kombo çarpanı Shell'de uygulanır) */
  points?: number
  /** oyuna özgü etiket (ör. 'congruent' | 'incongruent') */
  tag?: string
}
export interface Session {
  record: (t: TrialResult) => void
  /** oyunun mevcut adaptif seviyesi (K, streak, n vb.) — sonuç ekranı ve cold-start için */
  setLevel: (n: number) => void
  /** oyun kendi kuralıyla erken biter (ör. Raindrops'ta su seviyesi dolunca) */
  end: () => void
  /** kombo sayacı (doğru serisi) */
  readonly combo: number
}
export interface GameProps {
  session: Session
  paused: boolean
  /** oturumun kalan süresi (sn) — Shell sahiplenir */
  timeLeft: number
  seed: number
  /** cold-start: önceki oturumdan gelen seviye */
  startLevel: number
}
