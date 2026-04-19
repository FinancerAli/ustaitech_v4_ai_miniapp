import { useState, useEffect } from 'react';
import { getOrders, getUsers, formatPrice } from '../data/mock-db';
import './DashboardPage.css';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });

    useEffect(() => {
        const orders = getOrders();
        const users = getUsers();

        const revenue = orders
            .filter(o => o.status === 'confirmed')
            .reduce((sum, o) => sum + o.finalPrice, 0);

        setStats({
            totalUsers: users.length,
            totalOrders: orders.length,
            totalRevenue: revenue,
            recentOrders: orders.slice(0, 5) // Last 5 orders
        });
    }, []);

    return (
        <div className="dashboard-page fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-desc">Tizimdagi umumiy statistika va so'nggi amallar</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon users">
                        <span className="material-symbols-outlined">group</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Jami foydalanuvchilar</span>
                        <span className="stat-value">{stats.totalUsers}</span>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon orders">
                        <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Barcha buyurtmalar</span>
                        <span className="stat-value">{stats.totalOrders}</span>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon revenue">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Umumiy daromad</span>
                        <span className="stat-value">{formatPrice(stats.totalRevenue)}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-orders glass-card">
                    <div className="card-header">
                        <h3>So'nggi buyurtmalar</h3>
                    </div>
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mijoz</th>
                                    <th>Xizmat</th>
                                    <th>Summa</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td><strong>{order.id}</strong></td>
                                        <td>{order.customer}</td>
                                        <td>{order.serviceName}</td>
                                        <td>{formatPrice(order.finalPrice)}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'confirmed' ? 'success' : 'warning'}`}>
                                                {order.status === 'confirmed' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
