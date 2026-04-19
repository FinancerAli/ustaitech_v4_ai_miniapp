import { useLocation, useNavigate } from 'react-router-dom'
import './TopAppBar.css'

export default function TopAppBar({ title, showBack = false, rightAction = null }) {
  const navigate = useNavigate()

  return (
    <header className="top-app-bar">
      <div className="top-app-bar__left">
        {showBack ? (
          <button className="top-app-bar__back tap-target" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
        ) : (
          <div className="top-app-bar__avatar">
            <span className="material-symbols-outlined filled" style={{ fontSize: 16 }}>person</span>
          </div>
        )}
        <span className="top-app-bar__logo gradient-text">{title || 'UstaiTech'}</span>
      </div>
      <div className="top-app-bar__right">
        {rightAction || (
          <button className="top-app-bar__action tap-target">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)' }}>bolt</span>
          </button>
        )}
      </div>
    </header>
  )
}
