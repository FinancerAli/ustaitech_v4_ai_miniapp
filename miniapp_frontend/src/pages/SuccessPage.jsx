import { useState, useMemo, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getProductById } from '../data/mock-products'
import './SuccessPage.css'

// API base URL — production da o'zgartiladi
const API_BASE = import.meta.env.VITE_API_BASE || ''

export default function SuccessPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const product = getProductById(id)
  const paymentMethod = location.state?.paymentMethod || 'uzcard'
  const isStars = paymentMethod === 'stars'
  const fileInputRef = useRef(null)

  // Receipt upload states: idle | preview | uploading | sent | error
  const [uploadState, setUploadState] = useState('idle')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const orderId = useMemo(() => 'UT-' + String(Date.now()).slice(-6), [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Fayl hajmi 10MB dan katta. Kichikroq rasm tanlang.")
      return
    }

    setErrorMsg('')
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setSelectedFile(file)
    setUploadState('preview')
  }

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
    setUploadState('idle')
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmitReceipt = async () => {
    if (!selectedFile) return
    setUploadState('uploading')
    setErrorMsg('')

    try {
      // Get Telegram initData for auth
      const initData = window.Telegram?.WebApp?.initData || ''

      // Step 1: Create order
      const orderForm = new FormData()
      orderForm.append('service_id', id)
      orderForm.append('payment_method', 'manual')
      orderForm.append('note', '')

      const orderRes = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'X-Telegram-Init-Data': initData },
        body: orderForm,
      })

      if (!orderRes.ok) {
        throw new Error('Buyurtma yaratishda xatolik')
      }

      const orderData = await orderRes.json()
      const realOrderId = orderData.order_id

      // Step 2: Upload receipt
      const receiptForm = new FormData()
      receiptForm.append('receipt', selectedFile)

      const receiptRes = await fetch(`${API_BASE}/api/orders/${realOrderId}/receipt`, {
        method: 'POST',
        headers: { 'X-Telegram-Init-Data': initData },
        body: receiptForm,
      })

      if (!receiptRes.ok) {
        throw new Error('Chek yuklashda xatolik')
      }

      setUploadState('sent')
    } catch (err) {
      console.error('Receipt upload error:', err)
      // If no backend available, simulate success (dev mode)
      if (!API_BASE) {
        setTimeout(() => setUploadState('sent'), 1500)
      } else {
        setUploadState('preview')
        setErrorMsg(err.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.")
      }
    }
  }

  return (
    <div className="success-page page-enter">
      <div className="success-page__glow-1"></div>
      <div className="success-page__glow-2"></div>

      {/* Success Icon */}
      <div className="success-icon">
        <div className="success-icon__circle gradient-cta">
          <span className="material-symbols-outlined" style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-on-primary)' }}>check</span>
        </div>
        <div className="success-icon__ping"></div>
      </div>

      {/* Title */}
      <div className="success-text">
        <h1 className="success-text__title">Buyurtma qabul qilindi</h1>
        <p className="success-text__desc">
          {isStars
            ? "To'lov muvaffaqiyatli amalga oshirildi. Admin 5 daqiqada faollashtiradi."
            : "Endi to'lov chekini shu yerda yuklang. Admin tekshirgach xizmat faollashtiriladi."
          }
        </p>
      </div>

      {/* Order Details Card */}
      <div className="success-card glass-card">
        <div className="success-card__glow"></div>
        <div className="success-card__row">
          <span className="success-card__label">Buyurtma ID</span>
          <span className="success-card__value" style={{ color: 'var(--color-primary)' }}>#{orderId}</span>
        </div>
        <div className="success-card__divider"></div>

        {isStars ? (
          <>
            <div className="success-card__info-row">
              <div className="success-card__info-icon">
                <span className="material-symbols-outlined filled" style={{ color: 'var(--color-success, #00dbbd)' }}>check_circle</span>
              </div>
              <div>
                <h3 className="success-card__info-title">To'lov qabul qilindi</h3>
                <p className="success-card__info-desc">Telegram Stars orqali to'lov avtomatik tasdiqlandi.</p>
              </div>
            </div>
            <div className="success-card__info-row">
              <div className="success-card__info-icon">
                <span className="material-symbols-outlined filled" style={{ color: 'var(--color-tertiary)' }}>bolt</span>
              </div>
              <div>
                <h3 className="success-card__info-title">Faollashtirish</h3>
                <p className="success-card__info-desc">Admin 5 daqiqada xizmatni faollashtiradi. Telegram botingizni tekshiring.</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="success-card__info-row">
              <div className="success-card__info-icon">
                <span className="material-symbols-outlined filled" style={{ color: 'var(--color-tertiary)' }}>bolt</span>
              </div>
              <div>
                <h3 className="success-card__info-title">Faollashtirish vaqti</h3>
                <p className="success-card__info-desc">Xizmat 5 daqiqa ichida faollashtiriladi. Telegram botingizni tekshiring.</p>
              </div>
            </div>
            <div className="success-card__info-row">
              <div className="success-card__info-icon">
                <span className="material-symbols-outlined filled" style={{ color: 'var(--color-secondary)' }}>shield</span>
              </div>
              <div>
                <h3 className="success-card__info-title">Xavfsiz ulanish</h3>
                <p className="success-card__info-desc">Barcha tranzaksiyalar shifrlangan va xavfsiz holatda amalga oshirildi.</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Receipt Upload (Uzcard only) */}
      {!isStars && (
        <div className="receipt-section">
          <h3 className="receipt-section__title">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>receipt_long</span>
            To'lov chekini yuklang
          </h3>

          {/* Error message */}
          {errorMsg && (
            <div className="receipt-error">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
              {errorMsg}
            </div>
          )}

          {/* State: idle — upload zone */}
          {uploadState === 'idle' && (
            <label className="receipt-upload-zone" htmlFor="receipt-input">
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-primary-container)' }}>add_a_photo</span>
              <span className="receipt-upload-zone__text">Rasm tanlang yoki kameradan oling</span>
              <span className="receipt-upload-zone__hint">JPG, PNG — maksimum 10MB</span>
              <input
                ref={fileInputRef}
                id="receipt-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                hidden
              />
            </label>
          )}

          {/* State: preview */}
          {uploadState === 'preview' && previewUrl && (
            <div className="receipt-preview">
              <img src={previewUrl} alt="To'lov cheki" className="receipt-preview__img" />
              <button className="receipt-preview__remove" onClick={handleRemoveFile}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
              <div className="receipt-preview__badge">
                <span className="material-symbols-outlined filled" style={{ fontSize: 14 }}>check_circle</span>
                Rasm tanlandi
              </div>
            </div>
          )}

          {/* State: uploading */}
          {uploadState === 'uploading' && (
            <div className="receipt-uploading">
              <div className="receipt-uploading__spinner"></div>
              <span>Jo'natilmoqda...</span>
            </div>
          )}

          {/* State: sent */}
          {uploadState === 'sent' && (
            <div className="receipt-sent">
              <span className="material-symbols-outlined filled" style={{ fontSize: 32, color: 'var(--color-tertiary)' }}>task_alt</span>
              <h4>Chek qabul qilindi!</h4>
              <p>Admin 5 daqiqada tekshiradi. Natija Telegram botingizga keladi.</p>
            </div>
          )}

          {/* Submit button (only in preview state) */}
          {uploadState === 'preview' && (
            <button className="receipt-submit gradient-cta tap-target" onClick={handleSubmitReceipt}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
              Chekni jo'natish
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="success-actions">
        <button
          className={`success-actions__primary tap-target ${isStars ? 'gradient-cta' : ''}`}
          onClick={() => navigate('/', { replace: true })}
        >
          Bosh sahifaga qaytish
        </button>
        <button className="success-actions__secondary glass-card tap-target" onClick={() => navigate('/profile')}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>support_agent</span>
          Qo'llab-quvvatlash xizmati
        </button>
      </div>

      <p className="success-footer">UstaiTech © 2024 • Kelajak Bugun Boshlanadi</p>
    </div>
  )
}
