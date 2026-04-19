import { BrowserRouter } from 'react-router-dom'
import TopAppBar from './components/layout/TopAppBar'
import BottomNav from './components/layout/BottomNav'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import ProcessingPage from './pages/ProcessingPage'
import SuccessPage from './pages/SuccessPage'
import ProfilePage from './pages/ProfilePage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import { useTelegram } from './hooks/useTelegram'
import { useLocation, Routes, Route } from 'react-router-dom'

function AppLayout() {
  const location = useLocation()
  const { isInTelegram } = useTelegram()

  // Pages where we show back button instead of avatar
  const backPages = ['/product', '/checkout', '/processing', '/success']
  const showBack = backPages.some(p => location.pathname.startsWith(p))

  // Pages where we hide the top bar completely
  const hideHeader = ['/processing', '/success']
  const shouldHideHeader = hideHeader.some(p => location.pathname.startsWith(p))

  return (
    <>
      {/* Ambient Glow Backgrounds */}
      <div className="ambient-glow-primary"></div>
      <div className="ambient-glow-secondary"></div>

      {/* Header */}
      {!shouldHideHeader && <TopAppBar showBack={showBack} />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/processing/:id" element={<ProcessingPage />} />
        <Route path="/success/:id" element={<SuccessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
      </Routes>

      {/* Bottom Navigation */}
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
