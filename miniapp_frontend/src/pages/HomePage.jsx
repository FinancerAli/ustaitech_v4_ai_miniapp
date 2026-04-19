import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import TrustStrip from '../components/ui/TrustStrip'
import heroBanner from '../assets/hero-banner.png'
import { products, activePromo, getProductById } from '../data/mock-products'
import './HomePage.css'

const steps = [
  { num: '1', icon: 'search', title: 'Xizmat tanlang', desc: "Kerakli AI vositasini ro'yxatdan toping." },
  { num: '2', icon: 'payments', title: "To'lov qiling", desc: 'Uzcard yoki Stars orqali tezkor to\'lovni amalga oshiring.' },
  { num: '3', icon: 'bolt', title: 'Foydalaning', desc: '5 daqiqa ichida faollashtiring va ishlating.' },
]

const testimonials = [
  {
    text: "ChatGPT Plus oldim, 3 daqiqada ulab berishdi. Ishlashida umuman muammo yo'q, hamma premium funksiyalar bor.",
    name: 'Anvar Rahimov',
    role: 'Dasturchi',
    rating: 5,
  },
  {
    text: "Canva Pro dizaynlarimizni osonlashtirdi. UstAiTech-ga rahmat, narxi ham juda ma'qul keldi.",
    name: 'Dilnoza Sodiqova',
    role: 'SMM Menejer',
    rating: 5,
  },
  {
    text: "Midjourney v6 orqali logolar yaratib berdim mijozlarga. Sifati ajoyib, xizmat tezkor!",
    name: 'Jasur Karimov',
    role: 'Frilanser',
    rating: 5,
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const reviewsRef = useRef(null)

  const promoProduct = activePromo ? getProductById(activePromo.productId) : null

  return (
    <div className="home-page page-enter">
      {/* Hero / Promo Banner */}
      {promoProduct ? (
        <section className="home-promo" onClick={() => navigate(`/product/${promoProduct.id}`)}>
          <div className="home-promo__left">
            <span className="home-promo__tag">CHEGIRMA</span>
            <h2 className="home-promo__name">{promoProduct.name}</h2>
            <p className="home-promo__text">{activePromo.text}</p>
            <button className="home-promo__cta">{activePromo.cta}</button>
          </div>
          <div className="home-promo__icon">
            <span className="material-symbols-outlined filled">{promoProduct.icon}</span>
          </div>
        </section>
      ) : (
        <section className="home-hero">
          <div className="home-hero__image-wrapper">
            <img className="home-hero__image" src={heroBanner} alt="AI Neural Network" />
            <div className="home-hero__overlay"></div>
            <div className="home-hero__content">
              <span className="home-hero__badge">PREMIUM</span>
              <h1 className="home-hero__title">Sun'iy Intellekt Dunyosiga Xush Kelibsiz</h1>
            </div>
          </div>
        </section>
      )}

      {/* Trust Signals */}
      <TrustStrip />

      {/* Popular Models */}
      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Ommabop Modellar</h2>
          <button className="home-section__link" onClick={() => navigate('/catalog')}>Hammasi</button>
        </div>
        <div className="home-products">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="home-section">
        <h2 className="home-section__title">Qanday ishlaydi?</h2>
        <div className="home-steps">
          {steps.map((step, i) => (
            <div key={i} className="home-step">
              <div className="home-step__icon">
                <span className="material-symbols-outlined filled">{step.icon}</span>
              </div>
              <div className="home-step__text">
                <h4 className="home-step__title">{step.title}</h4>
                <p className="home-step__desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="home-section">
        <h2 className="home-section__title">Mijozlarimiz fikri</h2>
        <div className="home-reviews" ref={reviewsRef}>
          {testimonials.map((t, i) => (
            <div key={i} className="home-review glass-card">
              <div className="home-review__stars">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="material-symbols-outlined filled home-review__star">star</span>
                ))}
              </div>
              <p className="home-review__text">"{t.text}"</p>
              <div className="home-review__author">
                <div className="home-review__avatar">
                  {t.name[0]}
                </div>
                <div>
                  <span className="home-review__name">{t.name}</span>
                  <span className="home-review__role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
