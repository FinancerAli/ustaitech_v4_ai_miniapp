import './LoadingSpinner.css'

export default function LoadingSpinner({ text = "Yuklanmoqda..." }) {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__rings">
        <div className="loading-spinner__ring loading-spinner__ring--1"></div>
        <div className="loading-spinner__ring loading-spinner__ring--2"></div>
        <div className="loading-spinner__vessel">
          <span className="material-symbols-outlined filled" style={{ fontSize: 48, color: 'var(--color-primary)' }}>
            verified_user
          </span>
        </div>
      </div>
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  )
}
