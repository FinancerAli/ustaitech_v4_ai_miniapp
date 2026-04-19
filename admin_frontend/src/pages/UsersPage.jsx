import { useState, useEffect } from 'react';
import { getUsers, formatPrice } from '../data/mock-db';

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Foydalanuvchilar</h1>
                    <p className="page-desc">Bot orqali kirgan mijozlar ro'yxati</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="search" placeholder="Ism yoki Username orqali qidirish..." style={{ width: '300px' }} />
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Telegram ID</th>
                            <th>To'liq Ismi</th>
                            <th>Username</th>
                            <th>Umumiy Xarid</th>
                            <th>Qo'shilgan sana</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td><strong>{user.id}</strong></td>
                                <td><span style={{ color: 'var(--color-primary-fixed-dim)', fontFamily: 'monospace' }}>{user.tgId}</span></td>
                                <td>{user.fullName}</td>
                                <td>@{user.username}</td>
                                <td>{formatPrice(user.balance)}</td>
                                <td>{user.joined}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Ko'rish</button>
                                        <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'transparent' }}>Bloklash</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
