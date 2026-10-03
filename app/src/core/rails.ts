// Train of Thought: bölünmüş dikkat. 3 hat, 2 makas katmanı; tren makasın durumuna göre hat değiştirir.
export const ROWS = 3
export const STATION_COLORS = ['#FF6B6B', '#4C9AFF', '#2FD08F']
export const STAGE_X = [0.34, 0.6]

/** Tren, geçtiği andaki makas durumlarına göre hatta ilerler: makas açıksa bir alt hatta (dairesel) geçer. */
export function finalRow(start: number, s1: boolean[], s2: boolean[] | null): number {
  let r = s1[start] ? (start + 1) % ROWS : start
  if (s2) r = s2[r] ? (r + 1) % ROWS : r
  return r
}
export const railStages = (level: number) => (level <= 1 ? 1 : 2)
/** Tren seyahat süresi (sn) ve doğma aralığı (sn): zamanla kısalır. */
export const trainTravelSec = (level: number, resolved: number) => Math.max(3.2, (level <= 1 ? 7 : 6) - resolved * 0.08)
export const trainSpawnSec = (level: number, resolved: number) => Math.max(1.3, (level <= 1 ? 3.2 : 2.6) - resolved * 0.05)
export const railLevel = (resolved: number) => (resolved < 8 ? 1 : resolved < 20 ? 2 : 3)
