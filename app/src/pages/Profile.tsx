import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '../core/auth'
import { useStore, useT } from '../core/store'

export default function Profile() {
  const t = useT()
  const nav = useNavigate()
  const user = useUser()!
  const signOut = useAuth((s) => s.signOut)
  const { lang, setLang, muted, setMuted, plays } = useStore()
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user: { name: user.name, email: user.email }, plays }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'lumo-verilerim.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const wipe = () => {
    if (!confirm(t({ tr: 'Tüm oyun geçmişin silinecek. Emin misin?', en: 'All your game history will be deleted. Sure?' }))) return
    localStorage.removeItem('lumo_v4_state')
    location.reload()
  }
  return (
    <section className="narrow">
      <div className="page-head"><h1>{t({ tr: 'Profil', en: 'Profile' })}</h1></div>
      <div className="glass box">
        <div className="who">
          <span className="avatar big">{user.name.slice(0, 1).toUpperCase()}</span>
          <div><b>{user.name}</b><div className="muted">{user.guest ? t({ tr: 'Misafir hesap', en: 'Guest account' }) : user.email}</div></div>
        </div>
        {user.guest && <p className="muted small">{t({ tr: 'Misafir verileri bu tarayıcıda durur. Hesap açarak profilini adına bağlayabilirsin.', en: 'Guest data stays in this browser. Create an account to tie it to your name.' })}</p>}
      </div>
      <div className="glass box">
        <h3>{t({ tr: 'Tercihler', en: 'Preferences' })}</h3>
        <div className="pref"><span>{t({ tr: 'Dil', en: 'Language' })}</span><button className="btn ghost sm" onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}>{lang === 'tr' ? 'Türkçe → English' : 'English → Türkçe'}</button></div>
        <div className="pref"><span>{t({ tr: 'Ses efektleri', en: 'Sound effects' })}</span><button className="btn ghost sm" onClick={() => setMuted(!muted)}>{muted ? t({ tr: 'Kapalı', en: 'Off' }) : t({ tr: 'Açık', en: 'On' })}</button></div>
      </div>
      <div className="glass box">
        <h3>{t({ tr: 'Verilerin', en: 'Your data' })}</h3>
        <div className="pref"><span>{t({ tr: 'Oyun geçmişini dışa aktar (JSON)', en: 'Export game history (JSON)' })}</span><button className="btn ghost sm" onClick={exportData}>{t({ tr: 'İndir', en: 'Download' })}</button></div>
        <div className="pref"><span>{t({ tr: 'Oyun geçmişini sil', en: 'Delete game history' })}</span><button className="btn danger sm" onClick={wipe}>{t({ tr: 'Sil', en: 'Delete' })}</button></div>
      </div>
      <button className="btn ghost block" onClick={() => { signOut(); nav('/', { replace: true }) }}>{t({ tr: 'Çıkış yap', en: 'Sign out' })}</button>
    </section>
  )
}
