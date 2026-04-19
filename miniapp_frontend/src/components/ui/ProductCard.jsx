import { useNavigate } from 'react-router-dom'
import Badge from './Badge'
import { formatPrice } from '../../data/mock-products'
import './ProductCard.css'

export default function ProductCard({ product, variant = 'compact' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${product.id}`)
  }

  if (variant === 'full') {
    return (
      <div className="product-card product-card--full hover-lift" onClick={handleClick}>
        <div className="product-card__icon-box product-card__icon-box--large">
          <span className="material-symbols-outlined" style={{ fontSize: 32 }}>{product.icon}</span>
        </div>
        <div className="product-card__body">
          <div>
            <div className="product-card__title-row">
              <h3 className="product-card__name product-card__name--large">{product.name}</h3>
              {product.badge && <Badge text={product.badge} type={product.badgeType} />}
            </div>
            <span className="product-card__subtitle">{product.subtitle}</span>
            <p className="product-card__desc">{product.description}</p>
          </div>
          <div className="product-card__footer">
            <span className="product-card__price">{formatPrice(product.price)} so'm</span>
            <button className="product-card__view-btn product-card__view-btn--gradient" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
              KO'RISH
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Compact variant (Home page)
  return (
    <div className="product-card glass-card-component tap-target" onClick={handleClick}>
      <div className="product-card__icon-box">
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{product.icon}</span>
      </div>
      <div className="product-card__info">
        <div className="product-card__header">
          <span className="product-card__name">{product.name}</span>
          {product.badge && <Badge text={product.badge} type={product.badgeType} />}
        </div>
        <span className="product-card__subtitle">{product.subtitle}</span>
        <span className="product-card__price">
          {formatPrice(product.price)} so'm
          <span className="product-card__period"> / oy</span>
        </span>
      </div>
    </div>
  )
}
