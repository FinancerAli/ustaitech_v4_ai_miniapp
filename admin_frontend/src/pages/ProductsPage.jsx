import { useState, useEffect } from 'react';
import { getProducts, formatPrice, saveProduct, deleteProduct } from '../data/mock-db';
import ProductModal from '../components/admin/ProductModal';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const refreshData = () => {
        setProducts(getProducts());
    };

    useEffect(() => {
        refreshData();
    }, []);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) {
            deleteProduct(id);
            refreshData();
        }
    };

    const handleSave = (product) => {
        saveProduct(product);
        setIsModalOpen(false);
        refreshData();
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mahsulotlar</h1>
                    <p className="page-desc">Xizmatlar, narxlar va statusni boshqarish</p>
                </div>
                <button className="btn-primary" onClick={handleAdd}>
                    <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: 8 }}>add</span>
                    Qo'shish
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Tarif</th>
                            <th>Narx</th>
                            <th>Status</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.id}</strong></td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className="material-symbols-outlined">{p.icon}</span>
                                        {p.name}
                                        {p.badge && <span className="badge" style={{ background: 'var(--color-primary-dark)', fontSize: '10px' }}>{p.badge}</span>}
                                    </div>
                                </td>
                                <td>{p.subtitle}</td>
                                <td>{formatPrice(p.price)}</td>
                                <td>
                                    <span className={`badge ${p.status === 'active' ? 'success' : 'danger'}`}>
                                        {p.status === 'active' ? 'Faol' : 'Nofaol'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn-secondary" style={{ padding: '8px' }} title="Tahrirlash" onClick={() => handleEdit(p)}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                        </button>
                                        <button className="btn-danger" style={{ padding: '8px' }} title="O'chirish" onClick={() => handleDelete(p.id)}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                                    Mahsulotlar topilmadi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingProduct}
            />
        </div>
    );
}
