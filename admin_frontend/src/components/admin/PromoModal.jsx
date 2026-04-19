import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function PromoModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        status: 'active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData
            });
        } else {
            setFormData({
                code: '',
                discount: '',
                status: 'active'
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
            discount: Number(formData.discount),
        };
        onSave(promo);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? "Promokodni tahrirlash" : "Yangi promokod"}
            actions={
                <>
                    <button className="btn-secondary" onClick={onClose}>Bekor qilish</button>
                    <button className="btn-primary" onClick={handleSave}>Saqlash</button>
                </>
            }
        >
            <div className="modal-form-group">
                <label>Promokod (Code)</label>
                <input
                    type="text"
                    className="modal-input"
                    style={{ textTransform: 'uppercase' }}
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="YANGIYIL2025"
                />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className="modal-form-group" style={{ flex: 1 }}>
                    <label>Chegirma foizi (%)</label>
                    <input
                        type="number"
                        className="modal-input"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="Masalan: 20"
                        min="0"
                        max="100"
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
