import { useNavigate } from 'react-router-dom'
import { useTelegram } from '../hooks/useTelegram'
import { mockProfile, formatPrice } from '../data/mock-products'
import './ProfilePage.css'

const menuItems = [
  { icon: 'receipt_long', label: 'Mening Buyurtmalarim', color: 'primary', path: '/subscriptions' },
  { icon: 'help', label: 'Yordam Markazi', color: 'secondary', path: null },
  { icon: 'quiz', label: 'FAQ', color: 'tertiary', path: null },
  { icon: 'settings', label: 'Sozlamalar', color: 'outline', path: null },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useTelegram()
  const profile = mockProfile

  // Use Telegram user name if available
  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : profile.fullName

  return (
    <div className="profile-page page-enter">
      {/* User Header */}
      <section className="profile-header">
        <div className="profile-avatar">
          <div className="profile-avatar__glow"></div>
          <div className="profile-avatar__image">
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-primary)' }}>person</span>
          </div>
          <div className="profile-avatar__badge">
            <span className="material-symbols-outlined filled" style={{ fontSize: 18 }}>verified</span>
          </div>
        </div>
        <div className="profile-header__info">
          <h1 className="profile-header__name">{displayName}</h1>
          {profile.isPremium && (
            <div className="profile-header__tier">
              <span>Premium Client</span>
            </div>
          )}
        </div>
      </section>

      {/* Wallet Card */}
      <section className="profile-wallet">
        <div className="profile-wallet__glow"></div>
        <div className="profile-wallet__inner glass-panel">
          <span className="profile-wallet__label">Mavjud balans</span>
          <div className="profile-wallet__balance">
            <span className="profile-wallet__amount">{formatPrice(profile.bonusBalance)}</span>
            <span className="profile-wallet__currency">UZS</span>
          </div>
          <div className="profile-wallet__divider"></div>
          <button className="profile-wallet__topup">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add_circle</span>
            Balansni to'ldirish
          </button>
        </div>
      </section>

      {/* Menu Actions */}
      <section className="profile-menu">
        {menuItems.map((item, i) => (
          <div
            key={i}
            className="profile-menu__item tap-target"
            onClick={() => item.path && navigate(item.path)}
          >
            <div className="profile-menu__left">
              <div className={`profile-menu__icon profile-menu__icon--${item.color}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="profile-menu__label">{item.label}</span>
            </div>
            <span className="material-symbols-outlined profile-menu__chevron">chevron_right</span>
          </div>
        ))}
      </section>

      {/* Support CTA */}
      <section className="profile-support">
        <button className="profile-support__btn gradient-cta tap-target">
          <div className="profile-support__overlay"></div>
          <span className="material-symbols-outlined filled" style={{ fontSize: 28 }}>headset_mic</span>
          <span>Admin bilan bog'lanish</span>
        </button>
        <p className="profile-support__note">Mutaxassislarimiz 5-10 daqiqa ichida javob berishadi</p>
      </section>
    </div>
  )
}
