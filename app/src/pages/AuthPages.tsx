import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { passwordScore, useAuth, type AuthError } from '../core/auth'
import { useT } from '../core/store'

const ERR: Record<AuthError, { tr: string; en: string }> = {
  'invalid-email': { tr: 'Geçerli bir e-posta adresi gir.', en: 'Enter a valid email address.' },
  'weak-password': { tr: 'Parola en az 8 karakter olmalı.', en: 'Password must be at least 8 characters.' },
  'name-required': { tr: 'Adını yazmalısın.', en: 'Please enter your name.' },
  exists: { tr: 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.', en: 'An account with this email exists. Try signing in.' },
  'bad-credentials': { tr: 'E-posta veya parola hatalı.', en: 'Incorrect email or password.' },
}

function PasswordField({ id, value, onChange, autoComplete, label }: { id: string; value: string; onChange: (v: string) => void; autoComplete: string; label: string }) {
  const t = useT()
  const [show, setShow] = useState(false)
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <div className="pw">
        <input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required />
        <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? t({ tr: 'Gizle', en: 'Hide' }) : t({ tr: 'Göster', en: 'Show' })}</button>
      </div>
    </label>
  )
}

/** Giriş formu: sayfada da, kayıt hatırlatma penceresinde de kullanılır. */
export function LoginForm({ onDone, prefix = 'lg' }: { onDone: () => void; prefix?: string }) {
  const t = useT()
  const signIn = useAuth((s) => s.signIn)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState<AuthError | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const r = await signIn(email, pw)
    setBusy(false)
    if (r.ok) onDone()
    else setErr(r.error)
  }
  return (
    <form onSubmit={submit} noValidate>
      <label className="field" htmlFor={`${prefix}-email`}>
        <span>{t({ tr: 'E-posta', en: 'Email' })}</span>
        <input id={`${prefix}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>
      <PasswordField id={`${prefix}-pw`} value={pw} onChange={setPw} autoComplete="current-password" label={t({ tr: 'Parola', en: 'Password' })} />
      {err && <div className="form-err" role="alert">{t(ERR[err])}</div>}
      <button className="btn primary big block" disabled={busy}>{busy ? '…' : t({ tr: 'Giriş yap', en: 'Sign in' })}</button>
    </form>
  )
}

export function SignupForm({ onDone, prefix = 'sg' }: { onDone: () => void; prefix?: string }) {
  const t = useT()
  const signUp = useAuth((s) => s.signUp)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState<AuthError | null>(null)
  const [busy, setBusy] = useState(false)
  const score = passwordScore(pw)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const r = await signUp(name, email, pw)
    setBusy(false)
    if (r.ok) onDone()
    else setErr(r.error)
  }
  return (
    <form onSubmit={submit} noValidate>
      <label className="field" htmlFor={`${prefix}-name`}>
        <span>{t({ tr: 'Adın', en: 'Your name' })}</span>
        <input id={`${prefix}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" required />
      </label>
      <label className="field" htmlFor={`${prefix}-email`}>
        <span>{t({ tr: 'E-posta', en: 'Email' })}</span>
        <input id={`${prefix}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </label>
      <PasswordField id={`${prefix}-pw`} value={pw} onChange={setPw} autoComplete="new-password" label={t({ tr: 'Parola (en az 8 karakter)', en: 'Password (min 8 characters)' })} />
      <div className="meter" aria-hidden>{[0, 1, 2].map((i) => <i key={i} className={i < score ? `on s${score}` : ''} />)}</div>
      {err && <div className="form-err" role="alert">{t(ERR[err])}</div>}
      <button className="btn primary big block" disabled={busy}>{busy ? '…' : t({ tr: 'Hesap oluştur', en: 'Create account' })}</button>
    </form>
  )
}

export const DemoNote = () => {
  const t = useT()
  return <p className="muted small auth-note" role="note">{t({ tr: "Demo: hesap yalnızca bu tarayıcıda saklanır; parolan hash'lenir, hiçbir yere gönderilmez.", en: 'Demo: your account is stored only in this browser; the password is hashed and never sent anywhere.' })}</p>
}

function Shell({ title, sub, children, foot }: { title: string; sub: string; children: React.ReactNode; foot: React.ReactNode }) {
  return (
    <motion.section className="auth" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <div className="auth-card glass">
        <h1>{title}</h1>
        <p className="muted">{sub}</p>
        {children}
        <p className="auth-foot">{foot}</p>
      </div>
      <DemoNote />
    </motion.section>
  )
}

function useAfterAuth(fallback = '/panel') {
  const nav = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? fallback
  return () => nav(from, { replace: true })
}

export function Login() {
  const t = useT()
  const guest = useAuth((s) => s.guest)
  const done = useAfterAuth()
  const state = useLocation().state
  return (
    <Shell
      title={t({ tr: 'Tekrar hoş geldin', en: 'Welcome back' })}
      sub={t({ tr: 'Antrenmanına kaldığın yerden devam et.', en: 'Pick up your training where you left off.' })}
      foot={<>{t({ tr: 'Hesabın yok mu?', en: 'No account?' })} <Link to="/kayit" state={state}>{t({ tr: 'Kayıt ol', en: 'Sign up' })}</Link></>}
    >
      <LoginForm onDone={done} />
      <div className="divider"><span>{t({ tr: 'veya', en: 'or' })}</span></div>
      <button className="btn ghost block" onClick={() => { guest(); done() }}>{t({ tr: 'Misafir olarak devam et', en: 'Continue as guest' })}</button>
    </Shell>
  )
}

export function Signup() {
  const t = useT()
  const guest = useAuth((s) => s.guest)
  const done = useAfterAuth('/baslangic')
  const state = useLocation().state
  return (
    <Shell
      title={t({ tr: 'Hesabını oluştur', en: 'Create your account' })}
      sub={t({ tr: 'Ücretsiz. Kart bilgisi yok, reklam yok.', en: 'Free. No card, no ads.' })}
      foot={<>{t({ tr: 'Zaten hesabın var mı?', en: 'Already have an account?' })} <Link to="/giris" state={state}>{t({ tr: 'Giriş yap', en: 'Sign in' })}</Link></>}
    >
      <SignupForm onDone={done} />
      <div className="divider"><span>{t({ tr: 'veya', en: 'or' })}</span></div>
      <button className="btn ghost block" onClick={() => { guest(); done() }}>{t({ tr: 'Şimdilik misafir olarak dene', en: 'Try as guest for now' })}</button>
    </Shell>
  )
}
