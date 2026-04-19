import { useParams, useNavigate } from 'react-router-dom'
import StickyFooterCTA from '../components/ui/StickyFooterCTA'
import { useCatalog } from '../contexts/CatalogContext'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, formatPrice } = useCatalog()
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="detail-page page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <p style={{ color: 'var(--color-on-surface-variant)' }}>Mahsulot topilmadi</p>
      </div>
    )
  }

  return (
    <div className="detail-page page-enter">
      {/* Product Header */}
      <section className="detail-header">
        <div className="detail-header__glow"></div>
        <div className="detail-header__icon-wrapper">
          <div className="detail-header__icon-border">
            <div className="detail-header__icon-box">
              <span className="material-symbols-outlined" style={{ fontSize: 64 }}>{product.icon}</span>
            </div>
          </div>
        </div>
        <h2 className="detail-header__name">{product.name}</h2>
        <span className="detail-header__period">1 oylik obuna</span>
      </section>

      {/* Benefits Bento Grid */}
      {product.features && product.features.length > 0 && (
        <section className="detail-bento">
          {product.features.map((f, i) => (
            <div key={i} className={`detail-bento__card glass-panel ${f.wide ? 'detail-bento__card--wide' : ''}`}>
              <div className={`detail-bento__icon-box detail-bento__icon-box--${f.color}`}>
                <span className="material-symbols-outlined filled">{f.icon}</span>
              </div>
              <div>
                <h3 className="detail-bento__title">{f.title}</h3>
                <p className="detail-bento__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Product Description */}
      <section className="detail-description" style={{ padding: '0 20px', marginBottom: '24px' }}>
        <h4 className="detail-features__label" style={{ marginBottom: '12px' }}>Tavsif</h4>
        <div className="glass-panel" style={{
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(145deg, rgba(168, 232, 255, 0.05), rgba(60, 73, 78, 0.1))',
          border: '1px solid rgba(168, 232, 255, 0.1)'
        }}>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {product.description || product.subtitle || "Premium sifatli xizmat"}
          </p>
        </div>
      </section>

      {/* Features List */}
      {product.details && (
        <section className="detail-features">
          <h4 className="detail-features__label">Xususiyatlar haqida</h4>
          <div className="detail-features__list">
            {product.details.map((d, i) => (
              <div key={i} className="detail-features__item">
                <div className="detail-features__dot"></div>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Warranty Block */}
      <section className="detail-warranty">
        <div className="detail-warranty__inner">
          <div className="detail-warranty__left">
            <div className="detail-warranty__shield">
              <span className="material-symbols-outlined filled" style={{ fontSize: 28 }}>verified_user</span>
            </div>
            <div>
              <p className="detail-warranty__badge">Rasmiy Xizmat</p>
              <h5 className="detail-warranty__title">100% Kafolatli</h5>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ color: 'rgba(187, 201, 207, 0.3)' }}>shield_lock</span>
        </div>
      </section>

      {/* Sticky CTA */}
      <StickyFooterCTA
        priceLabel="Umumiy narx"
        priceValue={<>{formatPrice(product.price)} <span>so'm</span></>}
        onClick={() => navigate(`/checkout/${product.id}`)}
        buttonText="SOTIB OLISH"
      />
    </div>
  )
}
