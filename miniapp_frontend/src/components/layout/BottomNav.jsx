import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'

const tabs = [
  { path: '/', icon: 'home', label: 'Asosiy' },
  { path: '/catalog', icon: 'smart_toy', label: 'Modellar' },
  { path: '/subscriptions', icon: 'workspace_premium', label: 'Obuna' },
  { path: '/profile', icon: 'person', label: 'Profil' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide on checkout/processing/success flows
  const hideOn = ['/product', '/checkout', '/processing', '/success']
  if (hideOn.some(p => location.pathname.startsWith(p))) return null

  const currentPath = location.pathname

  return (
    <nav className="bottom-nav safe-area-bottom">
      {tabs.map(tab => {
        const isActive = tab.path === '/'
          ? currentPath === '/'
          : currentPath.startsWith(tab.path)

        return (
          <button
            key={tab.path}
            className={`bottom-nav__tab tap-target ${isActive ? 'bottom-nav__tab--active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>
              {tab.icon}
            </span>
            <span className="bottom-nav__label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
