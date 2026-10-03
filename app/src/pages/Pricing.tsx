import { GAMES } from '../games/registry'
import { useT } from '../core/store'

export default function Pricing() {
  const t = useT()
  const free = GAMES.filter((g) => !g.premium).length
  const pro = GAMES.length - free
  return (
    <section className="pricing">
      <div className="page-head"><h1>{t({ tr: 'Şeffaf fiyatlandırma', en: 'Transparent pricing' })}</h1></div>
      <div className="grid two">
        <div className="card glass">
          <h3>{t({ tr: 'Ücretsiz', en: 'Free' })}</h3>
          <div className="price">0 ₺</div>
          <ul>
            <li>{t({ tr: `${free} oyun, her kategoriden en az 2`, en: `${free} games, at least 2 per category` })}</li>
            <li>{t({ tr: 'Reklam yok. Hiçbir zaman.', en: 'No ads. Ever.' })}</li>
            <li>{t({ tr: 'Ücretsiz kapsam sonradan daraltılmaz.', en: 'The free scope will never be reduced later.' })}</li>
          </ul>
        </div>
        <div className="card glass">
          <h3>Pro</h3>
          <div className="price">{t({ tr: 'Demo — ödeme yok', en: 'Demo — no payment' })}</div>
          <ul>
            <li>{t({ tr: `Kalan ${pro} oyun`, en: `The remaining ${pro} games` })}</li>
            <li>{t({ tr: 'Tek fiyat, gizli koşul yok.', en: 'One price, no hidden terms.' })}</li>
            <li>{t({ tr: 'İptal: Hesap → İptal Et, tek tık + onay.', en: 'Cancel: Account → Cancel, one click + confirm.' })}</li>
          </ul>
        </div>
      </div>
      <p className="muted small">{t({ tr: 'Gerçek fiyat ve ödeme bu demoda yoktur; bu ekran ürün sözünü gösterir.', en: 'No real pricing or payment exists in this demo; this screen shows the product promise.' })}</p>
    </section>
  )
}
