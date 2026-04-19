import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
    const menu = [
        { name: 'Dashboard', icon: 'dashboard', path: '/' },
        { name: 'Mahsulotlar', icon: 'inventory_2', path: '/products' },
        { name: 'Buyurtmalar', icon: 'shopping_cart', path: '/orders' },
        { name: 'Promokodlar', icon: 'local_offer', path: '/promos' },
        { name: 'Foydalanuvchilar', icon: 'group', path: '/users' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <span className="material-symbols-outlined filled brand-icon">bolt</span>
                <h1 className="brand-name">UstaiTech</h1>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {menu.map((item, idx) => (
                        <li key={idx}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                                end={item.path === '/'}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="sidebar-link-text">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="admin-user-card">
                    <div className="admin-avatar">A</div>
                    <div className="admin-info">
                        <span className="admin-name">Admin</span>
                        <span className="admin-role">Super Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
