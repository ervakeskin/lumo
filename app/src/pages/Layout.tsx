import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore, useT } from '../core/store'
import { useUser } from '../core/auth'
import BackButton from '../components/BackButton'

export default function Layout({ children }: { children: ReactNode }) {
  const t = useT()
  const { lang, setLang, muted, setMuted } = useStore()
  const user = useUser()
  const path = useLocation().pathname
  // Oyun ve Fit Test akışı tam ekran (kendi Geri butonları var)
  if (path.startsWith('/oyun/') || path === '/fit-test') return <>{children}</>
  const isHome = path === '/'
  return (
    <>
      <header className="nav">
        <div className="nav-in">
          {isHome ? <span className="nav-spacer" /> : <BackButton />}
          <Link to="/" className="logo"><span className="logo-mark" aria-hidden />Lumo</Link>
          <nav className="nav-links" aria-label="main">
            <NavLink to="/panel">{t({ tr: 'Panel', en: 'Dashboard' })}</NavLink>
            <NavLink to="/oyunlar">{t({ tr: 'Oyunlar', en: 'Games' })}</NavLink>
            <NavLink to="/fiyat">{t({ tr: 'Fiyat', en: 'Pricing' })}</NavLink>
          </nav>
          <div className="nav-tools">
            <button className="btn icon" onClick={() => setMuted(!muted)} aria-pressed={muted} aria-label={t({ tr: 'Sesi aç/kapat', en: 'Toggle sound' })} title={muted ? 'Sound off' : 'Sound on'}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
                {muted ? <path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M16 8a5 5 0 010 8m2-11a9 9 0 010 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
            </button>
            <button className="btn icon txt" onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} aria-label="Language">{lang === 'tr' ? 'EN' : 'TR'}</button>
            {user ? (
              <Link to="/profil" className="avatar" aria-label={t({ tr: 'Profil', en: 'Profile' })}>{user.name.slice(0, 1).toUpperCase()}</Link>
            ) : (
              <>
                <Link to="/giris" className="btn ghost sm hide-sm">{t({ tr: 'Giriş', en: 'Sign in' })}</Link>
                <Link to="/kayit" className="btn primary sm">{t({ tr: 'Ücretsiz Başla', en: 'Get started' })}</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <footer className="foot">
        <span>© Lumo</span>
        <span className="muted">{t({ tr: 'Demo proje · tıbbi iddia taşımaz · reklam yok', en: 'Demo project · no medical claims · no ads' })}</span>
      </footer>
    </>
  )
}
