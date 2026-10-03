import { useStore, useT } from '../core/store'

/** Ses / dil / tema kısayolları: navbar'da ve oyun HUD'unda aynı bileşen. */
export default function Toggles({ theme = true }: { theme?: boolean }) {
  const t = useT()
  const { lang, setLang, muted, setMuted, theme: th, setTheme } = useStore()
  return (
    <>
      <button className="btn icon" onClick={() => setMuted(!muted)} aria-pressed={muted} aria-label={t({ tr: 'Sesi aç/kapat', en: 'Toggle sound' })} title={muted ? t({ tr: 'Ses kapalı', en: 'Sound off' }) : t({ tr: 'Ses açık', en: 'Sound on' })}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          {muted ? <path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M16 8a5 5 0 010 8m2-11a9 9 0 010 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
        </svg>
      </button>
      <button className="btn icon txt" onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} aria-label={t({ tr: 'Dili değiştir', en: 'Switch language' })}>{lang === 'tr' ? 'EN' : 'TR'}</button>
      {theme && (
        <button className="btn icon" onClick={() => setTheme(th === 'dark' ? 'light' : 'dark')} aria-label={t({ tr: 'Temayı değiştir', en: 'Switch theme' })} title={th === 'dark' ? t({ tr: 'Aydınlık tema', en: 'Light theme' }) : t({ tr: 'Koyu tema', en: 'Dark theme' })}>
          {th === 'dark'
            ? <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><circle cx="12" cy="12" r="4.2" fill="currentColor" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z" fill="currentColor" /></svg>}
        </button>
      )}
    </>
  )
}
