import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// DEMO: hesaplar yalnızca bu tarayıcıda (localStorage) tutulur, sunucu yoktur.
// Parola düz metin saklanmaz: PBKDF2-SHA256 + rastgele tuz.
interface User { email: string; name: string; salt: string; hash: string; createdAt: number }
export type AuthError = 'invalid-email' | 'weak-password' | 'name-required' | 'exists' | 'bad-credentials'

const enc = new TextEncoder()
const toHex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b as ArrayBuffer)].map((x) => x.toString(16).padStart(2, '0')).join('')

async function hashPw(pw: string, saltHex: string) {
  const salt = Uint8Array.from(saltHex.match(/../g)!.map((h) => parseInt(h, 16)))
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits'])
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 }, key, 256))
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const passwordScore = (pw: string) =>
  [pw.length >= 8, /[a-zçğıöşü]/i.test(pw) && /\d/.test(pw), pw.length >= 12 || /[^a-z0-9]/i.test(pw)].filter(Boolean).length

interface AuthState {
  users: User[]
  /** e-posta, 'guest' veya null */
  current: string | null
  /** kayıt hatırlatma penceresinin kaç kez gösterildiği */
  prompted: number
  markPrompted: () => void
  signUp: (name: string, email: string, pw: string) => Promise<{ ok: true } | { ok: false; error: AuthError }>
  signIn: (email: string, pw: string) => Promise<{ ok: true } | { ok: false; error: AuthError }>
  guest: () => void
  signOut: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      current: null,
      prompted: 0,
      markPrompted: () => set((s) => ({ prompted: s.prompted + 1 })),
      async signUp(name, email, pw) {
        const e = email.trim().toLowerCase()
        if (!name.trim()) return { ok: false, error: 'name-required' }
        if (!EMAIL_RE.test(e)) return { ok: false, error: 'invalid-email' }
        if (pw.length < 8) return { ok: false, error: 'weak-password' }
        if (get().users.some((u) => u.email === e)) return { ok: false, error: 'exists' }
        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
        const user: User = { email: e, name: name.trim(), salt, hash: await hashPw(pw, salt), createdAt: Date.now() }
        set((s) => ({ users: [...s.users, user], current: e }))
        return { ok: true }
      },
      async signIn(email, pw) {
        const e = email.trim().toLowerCase()
        if (!EMAIL_RE.test(e)) return { ok: false, error: 'invalid-email' }
        const u = get().users.find((x) => x.email === e)
        // Kullanıcı yoksa da hash hesapla: zamanlama farkıyla hesap varlığı sızmasın
        const h = await hashPw(pw, u?.salt ?? '00'.repeat(16))
        if (!u || u.hash !== h) return { ok: false, error: 'bad-credentials' }
        set({ current: e })
        return { ok: true }
      },
      guest: () => set({ current: 'guest' }),
      signOut: () => set({ current: null }),
    }),
    { name: 'lumo_auth_v1', version: 1 },
  ),
)

export function useUser() {
  const { users, current } = useAuth()
  if (!current) return null
  if (current === 'guest') return { guest: true as const, name: 'Misafir', email: '' }
  const u = users.find((x) => x.email === current)
  return u ? { guest: false as const, name: u.name, email: u.email } : null
}
