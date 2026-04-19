import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function ProductModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        price: '',
        icon: 'chat',
        stock: '',
        status: 'active',
        category: 'text-ai',
        badge: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                stock: initialData.stock === undefined || initialData.stock === null ? '' : initialData.stock
            });
        } else {
            setFormData({
                name: '',
                subtitle: '',
                price: '',
                icon: 'chat',
                stock: '',
                status: 'active',
                category: 'text-ai',
                badge: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const product = {
            ...formData,
            price: Number(formData.price),
            stock: formData.stock === '' ? null : Number(formData.stock)
        };
        onSave(product);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
            actions={
                <>
                    <button className="btn-secondary" onClick={onClose}>Bekor qilish</button>
                    <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                </>
            }
        >
            <div className="modal-form-group">
                <label>Nom (Name)</label>
                <input
                    type="text"
                    className="modal-input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masalan: ChatGPT Plus"
                />
            </div>

            <div className="modal-form-group">
                <label>Tarif (Subtitle)</label>
                <input
                    type="text"
                    className="modal-input"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Masalan: GPT-4 Turbo & DALL-E"
                />
            </div>

            <div className="modal-form-group">
                <label>Narx (so'm)</label>
                <input
                    type="number"
                    className="modal-input"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="260000"
                />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className="modal-form-group" style={{ flex: 1 }}>
                    <label>Icon (Google Icons)</label>
                    <input
                        type="text"
                        className="modal-input"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="chat"
                    />
                </div>
                <div className="modal-form-group" style={{ flex: 1 }}>
                    <label>Zaxira (ixtiyoriy)</label>
                    <input
                        type="number"
                        className="modal-input"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Cheksiz"
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className="modal-form-group" style={{ flex: 1 }}>
                    <label>Badge (Qizil belgi)</label>
                    <input
                        type="text"
                        className="modal-input"
                        name="badge"
                        value={formData.badge}
                        onChange={handleChange}
                        placeholder="HOT, PRO..."
                    />
                </div>
                <div className="modal-form-group" style={{ flex: 1 }}>
                    <label>Status</label>
                    <select className="modal-input" name="status" value={formData.status} onChange={handleChange}>
                        <option value="active">Faol</option>
                        <option value="inactive">Nofaol</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
}
