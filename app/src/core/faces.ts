import type { Rng } from './rng'

// Familiar Faces: prosedürel yüz + isim + sipariş (ilişkisel hafıza). Saf mantık.
export interface Face { skin: number; hair: number; hairStyle: number; eyes: number; mouth: number; glasses: boolean }
export const SKINS = ['#f6d5b8', '#e8b98d', '#c68b59', '#8d5a3b', '#5b3a29']
export const HAIRS = ['#2b1b12', '#6b3f1d', '#c98b3a', '#d9d9d9', '#a02c2c', '#1f2a44']
export const NAMES = ['Ayşe', 'Mehmet', 'Elif', 'Can', 'Zeynep', 'Burak', 'Selin', 'Emre', 'Deniz', 'Kaan', 'Merve', 'Ege', 'Ceren', 'Onur', 'Defne', 'Barış', 'Aslı', 'Tolga', 'Naz', 'Cem', 'İpek', 'Arda', 'Sena', 'Yiğit', 'Mert', 'Gizem', 'Kerem', 'Pelin', 'Alp', 'Duygu', 'Oğuz', 'Ece', 'Berk', 'Yaren', 'Umut', 'Derya']
export const ORDERS = ['coffee', 'cake', 'burger', 'apple', 'pizza', 'tea', 'cookie', 'icecream', 'juice'] as const
export type Order = (typeof ORDERS)[number]
export const ORDER_NAME: Record<Order, { tr: string; en: string }> = {
  coffee: { tr: 'Kahve', en: 'Coffee' }, cake: { tr: 'Pasta', en: 'Cake' }, burger: { tr: 'Burger', en: 'Burger' },
  apple: { tr: 'Elma', en: 'Apple' }, pizza: { tr: 'Pizza', en: 'Pizza' }, tea: { tr: 'Çay', en: 'Tea' },
  cookie: { tr: 'Kurabiye', en: 'Cookie' }, icecream: { tr: 'Dondurma', en: 'Ice cream' }, juice: { tr: 'Meyve suyu', en: 'Juice' },
}
export interface Customer { face: Face; name: string; order: Order }
export interface Question { customer: number; kind: 'order' | 'name'; options: string[]; answer: string }

export const makeFace = (rng: Rng): Face => ({
  skin: rng.int(0, SKINS.length - 1), hair: rng.int(0, HAIRS.length - 1), hairStyle: rng.int(0, 3),
  eyes: rng.int(0, 2), mouth: rng.int(0, 2), glasses: rng.next() < 0.35,
})
const faceKey = (f: Face) => JSON.stringify(f)

/** k müşteri (k ≤ 6): yüzler, isimler ve siparişler birbirinden farklı; cevaplar belirsiz kalmaz. */
export function makeCustomers(k: number, rng: Rng): Customer[] {
  const names = rng.shuffle(NAMES).slice(0, k)
  const orders = rng.shuffle([...ORDERS]).slice(0, k)
  const seen = new Set<string>()
  return names.map((name, i) => {
    let face = makeFace(rng)
    for (let g = 0; seen.has(faceKey(face)) && g < 50; g++) face = makeFace(rng)
    seen.add(faceKey(face))
    return { face, name, order: orders[i] }
  })
}

/** Her müşteri için bir soru (sipariş ya da isim); 4 şık, doğru cevap şıklar arasında. */
export function makeQuestions(cs: Customer[], rng: Rng): Question[] {
  return rng.shuffle(cs.map((_, i) => i)).map((i) => {
    const kind: Question['kind'] = rng.next() < 0.5 ? 'order' : 'name'
    const answer = kind === 'order' ? cs[i].order : cs[i].name
    const pool: string[] = kind === 'order' ? [...ORDERS] : [...NAMES]
    const wrong = rng.shuffle(pool.filter((x) => x !== answer)).slice(0, 3)
    return { customer: i, kind, answer, options: rng.shuffle([answer, ...wrong]) }
  })
}
