import { useNavigate } from 'react-router-dom'
import { useT } from '../core/store'

/** Uygulama içi Geri: geçmiş varsa bir adım geri, yoksa ana sayfa. Her ekranda aynı yerde/biçimde. */
export default function BackButton({ to, replace = false, className = '' }: { to?: string; replace?: boolean; className?: string }) {
  const t = useT()
  const nav = useNavigate()
  const go = () => {
    if (to) return nav(to, { replace })
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) nav(-1)
    else nav('/', { replace: true })
  }
  return (
    <button type="button" className={`btn back ${className}`} onClick={go} aria-label={t({ tr: 'Geri dön', en: 'Go back' })}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {t({ tr: 'Geri', en: 'Back' })}
    </button>
  )
}
