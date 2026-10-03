import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useT } from '../core/store'
import { useUser } from '../core/auth'
import BackButton from '../components/BackButton'
import Toggles from '../components/Toggles'

export default function Layout({ children }: { children: ReactNode }) {
  const t = useT()
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
          <Link to="/" className="logo"><span className="logo-orb" aria-hidden />Lumo</Link>
          <nav className="nav-links" aria-label="main">
            <NavLink to="/panel">{t({ tr: 'Panel', en: 'Dashboard' })}</NavLink>
            <NavLink to="/oyunlar">{t({ tr: 'Oyunlar', en: 'Games' })}</NavLink>
            <NavLink to="/fiyat">{t({ tr: 'Fiyat', en: 'Pricing' })}</NavLink>
          </nav>
          <div className="nav-tools">
            <Toggles />
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
        <div className="foot-mark"><span className="logo-orb" aria-hidden />Lumo</div>
        <span className="muted">{t({ tr: 'Demo proje · tıbbi iddia taşımaz · reklam yok · verin cihazında', en: 'Demo project · no medical claims · no ads · your data stays on your device' })}</span>
      </footer>
    </>
  )
}
