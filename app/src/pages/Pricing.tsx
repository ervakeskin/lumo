import { GAMES } from '../games/registry'
import { useT } from '../core/store'

export default function Pricing() {
  const t = useT()
  return (
    <section className="pricing">
      <div className="page-head"><h1>{t({ tr: 'Herkes için ücretsiz', en: 'Free for everyone' })}</h1></div>
      <div className="card glass">
        <div className="price">0 ₺</div>
        <ul>
          <li>{t({ tr: `${GAMES.length} oyunun hepsi açık, kilitli içerik yok`, en: `All ${GAMES.length} games are open, nothing is locked` })}</li>
          <li>{t({ tr: 'Reklam yok. Hiçbir zaman.', en: 'No ads. Ever.' })}</li>
          <li>{t({ tr: 'Abonelik ve ödeme yok.', en: 'No subscription, no payment.' })}</li>
        </ul>
      </div>
    </section>
  )
}
