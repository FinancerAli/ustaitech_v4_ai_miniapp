import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function HeroPromoModal({ isOpen, onClose, onSave, products, initialData }) {
    const [formData, setFormData] = useState({
        productId: '',
        discount: '',
        text: '',
        cta: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const promo = {
            ...formData,
            productId: Number(formData.productId),
            discount: Number(formData.discount),
        };
        onSave(promo);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Hero Banni tahrirlash"
            actions={
                <>
                    <button className="btn-secondary" onClick={onClose}>Bekor qilish</button>
                    <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                </>
            }
        >
            <div className="modal-form-group">
                <label>Qaysi mahsulotga tegishli?</label>
                <select className="modal-input" name="productId" value={formData.productId} onChange={handleChange}>
                    <option value="">-- Tanlang --</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="modal-form-group">
                <label>Chegirma foizi (%)</label>
                <input
                    type="number"
                    className="modal-input"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="Masalan: 30"
                    min="0"
                    max="100"
                />
            </div>

            <div className="modal-form-group">
                <label>Marketing Matni</label>
                <input
                    type="text"
                    className="modal-input"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Faqat bugun -30% chegirma bilan obuna bo'ling!"
                />
            </div>

            <div className="modal-form-group">
                <label>Tugma Yozuvi (CTA)</label>
                <input
                    type="text"
                    className="modal-input"
                    name="cta"
                    value={formData.cta}
                    onChange={handleChange}
                    placeholder="Hozir olish"
                />
            </div>
        </Modal>
    );
}
