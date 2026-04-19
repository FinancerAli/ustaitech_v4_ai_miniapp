import { useState, useMemo } from 'react'
import ProductCard from '../components/ui/ProductCard'
import FilterChip from '../components/ui/FilterChip'
import { products, categories, searchProducts, getProductsByCategory } from '../data/mock-products'
import './CatalogPage.css'

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let result = getProductsByCategory(activeCategory)
    if (searchQuery) {
      const searched = searchProducts(searchQuery)
      result = result.filter(p => searched.some(s => s.id === p.id))
    }
    return result
  }, [activeCategory, searchQuery])

  return (
    <div className="catalog-page page-enter">
      {/* Hero Title */}
      <section className="catalog-hero">
        <span className="catalog-hero__label">AI KATALOG</span>
        <h2 className="catalog-hero__title">Eng yaxshi AI modellarini kashf eting</h2>
      </section>

      {/* Search & Filter */}
      <div className="catalog-controls">
        <div className="catalog-search">
          <span className="material-symbols-outlined catalog-search__icon">search</span>
          <input
            type="text"
            className="catalog-search__input"
            placeholder="Qidirish..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="catalog-filters">
          {categories.map(cat => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="catalog-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} variant="full" />
          ))
        ) : (
          <div className="catalog-empty">
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', marginBottom: 16 }}>search_off</span>
            <p>Hech narsa topilmadi</p>
          </div>
        )}
      </div>
    </div>
  )
}
