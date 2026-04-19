import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
// Placeholder pages to implement later
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import PromoPage from './pages/PromoPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/promos" element={<PromoPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
