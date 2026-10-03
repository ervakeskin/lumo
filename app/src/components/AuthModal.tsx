import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoginForm, SignupForm, DemoNote } from '../pages/AuthPages'
import { useT } from '../core/store'

/**
 * İlk oyun bittikten sonra çıkan kayıt hatırlatma penceresi: Fit Test ve ilerleme takibi kişisel veri gerektirir.
 * Sayfadan ayrılmadan kayıt ya da giriş yapılabilir; "Şimdi değil" ile kapatılır.
 */
export default function AuthModal({ onClose }: { onClose: () => void }) {
  const t = useT()
  const [tab, setTab] = useState<'signup' | 'login'>('signup')
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div className="modal glass" role="dialog" aria-modal="true" aria-labelledby="am-title" initial={{ y: 30, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
        <button className="modal-x" onClick={onClose} aria-label={t({ tr: 'Kapat', en: 'Close' })}>×</button>
        {ok ? (
          <div className="modal-ok">
            <h2 id="am-title">{t({ tr: 'Hesabın hazır!', en: 'Your account is ready!' })}</h2>
            <p className="muted">{t({ tr: 'Artık sonuçların kaydediliyor. İstersen hemen Fit Test ile başlangıç seviyeni ölçelim.', en: 'Your results are now saved. Want to measure your starting level with the Fit Test right away?' })}</p>
            <div className="row">
              <Link to="/baslangic" className="btn primary big" onClick={onClose}>{t({ tr: 'Fit Test’e geç', en: 'Go to Fit Test' })}</Link>
              <button className="btn ghost big" onClick={onClose}>{t({ tr: 'Sonra', en: 'Later' })}</button>
            </div>
          </div>
        ) : (
          <>
            <span className="chip pill">{t({ tr: 'İlk oyunun tamam', en: 'First game done' })}</span>
            <h2 id="am-title">{t({ tr: 'İlerlemeni kaybetme', en: 'Don’t lose your progress' })}</h2>
            <p className="muted">{t({ tr: 'Fit Test ve gelişim raporun kişisel veri gerektirir: sonuçların bir hesaba bağlı olmalı ki zaman içinde kendinle karşılaştırabilesin.', en: 'The Fit Test and your progress report need personal data: results must belong to an account so you can compare with yourself over time.' })}</p>
            <ul className="modal-list">
              <li>{t({ tr: 'Skorların ve rekorların kayıtlı kalır', en: 'Your scores and records are kept' })}</li>
              <li>{t({ tr: 'Fit Test radarın ve Lumo Endeksin', en: 'Your Fit Test radar and Lumo Index' })}</li>
              <li>{t({ tr: '30 gün sonra kendi sonucunla karşılaştırma', en: 'Compare with your own result after 30 days' })}</li>
            </ul>
            <div className="tabs" role="tablist">
              <button role="tab" aria-selected={tab === 'signup'} className={tab === 'signup' ? 'on' : ''} onClick={() => setTab('signup')}>{t({ tr: 'Kayıt ol', en: 'Sign up' })}</button>
              <button role="tab" aria-selected={tab === 'login'} className={tab === 'login' ? 'on' : ''} onClick={() => setTab('login')}>{t({ tr: 'Giriş yap', en: 'Sign in' })}</button>
            </div>
            {tab === 'signup' ? <SignupForm onDone={() => setOk(true)} prefix="am-sg" /> : <LoginForm onDone={() => setOk(true)} prefix="am-lg" />}
            <button className="btn ghost block" onClick={onClose}>{t({ tr: 'Şimdi değil, oynamaya devam', en: 'Not now, keep playing' })}</button>
            <DemoNote />
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
