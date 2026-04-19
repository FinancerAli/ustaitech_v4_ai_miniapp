import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StickyFooterCTA from '../components/ui/StickyFooterCTA'
import { getProductById, formatPrice, paymentMethods } from '../data/mock-products'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)
  const [selectedPayment, setSelectedPayment] = useState('uzcard')
  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState(null) // null | 'success' | 'error'
  const [discount, setDiscount] = useState(0)

  if (!product) {
    return <div className="checkout-page page-enter"><p>Mahsulot topilmadi</p></div>
  }

  const finalPrice = product.price - discount

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return
    // Demo: "USTAI10" gives 10% discount
    if (promoCode.trim().toUpperCase() === 'USTAI10') {
      const disc = Math.round(product.price * 0.1)
      setDiscount(disc)
      setPromoStatus('success')
    } else {
      setDiscount(0)
      setPromoStatus('error')
    }
  }

  const handleConfirm = () => {
    navigate(`/processing/${product.id}`, { state: { paymentMethod: selectedPayment } })
  }

  return (
    <div className="checkout-page page-enter">
      {/* Product Section */}
      <section>
        <h2 className="checkout-label">Mahsulot</h2>
        <div className="checkout-product glass-card">
          <div className="checkout-product__icon">
            <div className="checkout-product__icon-inner">
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-primary)' }}>{product.icon}</span>
            </div>
          </div>
          <div className="checkout-product__info">
            <h3 className="checkout-product__name">{product.name}</h3>
            <p className="checkout-product__desc">1 oylik individual obuna</p>
            <div className="checkout-product__price">{formatPrice(product.price)} so'm</div>
          </div>
        </div>
      </section>

      {/* Promo Code */}
      <section>
        <h2 className="checkout-label">Promokod</h2>
        <div className="checkout-promo">
          <input
            type="text"
            className="checkout-promo__input"
            placeholder="Kodni kiriting"
            value={promoCode}
            onChange={e => { setPromoCode(e.target.value); setPromoStatus(null); }}
          />
          <button className="checkout-promo__btn" onClick={handleApplyPromo}>Qo'llash</button>
        </div>
        {promoStatus === 'success' && (
          <div className="checkout-promo__feedback checkout-promo__feedback--success">
            <span className="material-symbols-outlined filled" style={{ fontSize: 16 }}>check_circle</span>
            10% chegirma qo'llanildi!
          </div>
        )}
        {promoStatus === 'error' && (
          <div className="checkout-promo__feedback checkout-promo__feedback--error">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
            Noto'g'ri promokod
          </div>
        )}
      </section>

      {/* Payment Methods */}
      <section>
        <h2 className="checkout-label">To'lov usuli</h2>
        <div className="checkout-payments">
          {paymentMethods.map(pm => (
            <div
              key={pm.id}
              className={`checkout-payment glass-card tap-target ${selectedPayment === pm.id ? 'active-ring' : ''}`}
              onClick={() => setSelectedPayment(pm.id)}
            >
              <div
                className="checkout-payment__icon"
                style={{ background: pm.color ? `${pm.color}20` : 'rgba(187, 201, 207, 0.1)' }}
              >
                <span
                  className={`material-symbols-outlined ${pm.id === 'stars' ? 'filled' : ''}`}
                  style={{ color: pm.color || 'var(--color-on-surface-variant)' }}
                >{pm.icon}</span>
              </div>
              <span className="checkout-payment__name">{pm.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="checkout-summary">
        <div className="checkout-summary__row">
          <span>Obuna narxi</span>
          <span>{formatPrice(product.price)} so'm</span>
        </div>
        <div className="checkout-summary__row">
          <span>Chegirma ({discount > 0 ? Math.round(discount / product.price * 100) : 0}%)</span>
          <span className="checkout-summary__discount">{formatPrice(discount)} so'm</span>
        </div>
        <div className="checkout-summary__total">
          <span>Jami summa</span>
          <span className="checkout-summary__total-value">{formatPrice(finalPrice)} so'm</span>
        </div>
      </section>

      {/* Trust Badge */}
      <div className="checkout-trust">
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
        <span>Barcha to'lovlar xavfsiz himoyalangan</span>
      </div>

      {/* CTA */}
      <StickyFooterCTA onClick={handleConfirm}>
        To'lovni tasdiqlash
      </StickyFooterCTA>
    </div>
  )
}
