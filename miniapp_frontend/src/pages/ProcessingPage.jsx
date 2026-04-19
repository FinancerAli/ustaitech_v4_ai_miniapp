import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/feedback/LoadingSpinner'
import { getProductById } from '../data/mock-products'
import './ProcessingPage.css'

export default function ProcessingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const product = getProductById(id)
  const paymentMethod = location.state?.paymentMethod || 'uzcard'

  // Simulate payment processing → success after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/success/${id}`, { replace: true, state: { paymentMethod } })
    }, 3000)
    return () => clearTimeout(timer)
  }, [id, navigate, paymentMethod])

  return (
    <div className="processing-page bg-radial-glow">
      {/* Decorative Background */}
      <div className="processing-page__bg-orb"></div>

      {/* Processing Content */}
      <div className="processing-page__content">
        <LoadingSpinner />

        <div className="processing-page__text">
          <h2 className="processing-page__title">To'lov tekshirilmoqda...</h2>
          <p className="processing-page__desc">
            Iltimos, kutib turing. Biz to'lov holatini xavfsiz tasdiqlayapmiz.
          </p>
        </div>

        {/* Security Status Card */}
        <div className="processing-page__status glass-card">
          <div className="processing-page__status-left">
            <div className="processing-page__status-icon">
              <span className="material-symbols-outlined filled" style={{ color: 'var(--color-secondary)' }}>security</span>
            </div>
            <div className="processing-page__status-info">
              <p className="processing-page__status-label">Xavfsizlik darajasi</p>
              <p className="processing-page__status-value">Shifrlangan 256-bit SSL</p>
            </div>
          </div>
          <div className="processing-page__progress-bar">
            <div className="processing-page__progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
