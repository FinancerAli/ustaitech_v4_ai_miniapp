import { useState, useEffect } from 'react';
import { getOrders, formatPrice } from '../data/mock-db';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(getOrders());
    }, []);

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Buyurtmalar</h1>
                    <p className="page-desc">To'lovlar, tasdiqlashlar va mijozlar tarixi</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="search" placeholder="ID yoki Ism orqali izlash" style={{ width: '300px' }} />
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Oorder ID</th>
                            <th>Mijoz</th>
                            <th>Xizmat</th>
                            <th>Sana</th>
                            <th>Summa</th>
                            <th>Status</th>
                            <th>Qaror</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td><strong>{order.id}</strong></td>
                                <td>{order.customer}</td>
                                <td>{order.serviceName}</td>
                                <td>{order.createdAt}</td>
                                <td>{formatPrice(order.finalPrice)}</td>
                                <td>
                                    <span className={`badge ${order.status === 'confirmed' ? 'success' : 'warning'}`}>
                                        {order.status === 'confirmed' ? 'Tasdiqlangan' : 'Kutilmoqda'}
                                    </span>
                                </td>
                                <td>
                                    {order.status === 'pending' ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Tasdiqlash</button>
                                            <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}>Rad etish</button>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--color-outline)' }}>Bajarilgan</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
