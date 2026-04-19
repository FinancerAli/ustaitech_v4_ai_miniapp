import './StickyFooterCTA.css'

export default function StickyFooterCTA({ children, priceLabel, priceValue, onClick, buttonText, loading = false }) {
  // Variant 1: Price + button side by side
  if (priceLabel) {
    return (
      <div className="sticky-cta safe-area-bottom">
        <div className="sticky-cta__inner sticky-cta__inner--split">
          <div className="sticky-cta__price-col">
            <span className="sticky-cta__price-label">{priceLabel}</span>
            <span className="sticky-cta__price-value">{priceValue}</span>
          </div>
          <button className="sticky-cta__button gradient-cta tap-target" onClick={onClick} disabled={loading}>
            {buttonText || "SOTIB OLISH"}
          </button>
        </div>
      </div>
    )
  }

  // Variant 2: Full width button
  return (
    <div className="sticky-cta safe-area-bottom">
      <div className="sticky-cta__inner">
        <button className="sticky-cta__button sticky-cta__button--full gradient-cta tap-target" onClick={onClick} disabled={loading}>
          {children || buttonText}
          {!loading && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>}
        </button>
      </div>
    </div>
  )
}
