import { useState, useEffect } from 'react';
import { getPromos, getActivePromo, getProducts, formatPrice, savePromo, deletePromo, updateHeroPromo } from '../data/mock-db';
import PromoModal from '../components/admin/PromoModal';
import HeroPromoModal from '../components/admin/HeroPromoModal';

export default function PromoPage() {
    const [promos, setPromos] = useState([]);
    const [heroPromo, setHeroPromo] = useState(null);
    const [products, setProducts] = useState([]);

    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState(null);

    const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

    const refreshData = async () => {
        setPromos(await getPromos());
        setHeroPromo(getActivePromo());
        setProducts(await getProducts());
    };

    useEffect(() => {
        refreshData();
    }, []);

    // Regular Promos Handlers
    const handleAddPromo = () => {
        setEditingPromo(null);
        setIsPromoModalOpen(true);
    };

    const handleEditPromo = (promo) => {
        setEditingPromo(promo);
        setIsPromoModalOpen(true);
    };

    const handleDeletePromo = async (id) => {
        if (confirm("Haqiqatan ham bu promokodni o'chirmoqchimisiz?")) {
            await deletePromo(id);
            refreshData();
        }
    };

    const handleSavePromo = async (promo) => {
        await savePromo(promo);
        setIsPromoModalOpen(false);
        refreshData();
    };

    // Hero Promo Handlers
    const handleEditHero = () => {
        setIsHeroModalOpen(true);
    };

    const handleSaveHero = async (promo) => {
        await updateHeroPromo(promo);
        setIsHeroModalOpen(false);
        refreshData();
    };

    const handleDeleteHero = () => {
        if (confirm("Hero bannerni o'chirmoqchimisiz?")) {
            updateHeroPromo(null);
            refreshData();
        }
    };

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="page-header" style={{ marginBottom: '0' }}>
                <div>
                    <h1 className="page-title">Marketing & Promokodlar</h1>
                    <p className="page-desc">Chegirmalar va reklama bannerlarini moslash</p>
                </div>
            </div>

            {/* Hero Banner boshqaruvi */}
            <div className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px' }}>Mini App Asosiy Banner (Hero Promo)</h2>
                    <button className="btn-secondary" onClick={handleEditHero}>Tahrirlash</button>
                </div>

                {heroPromo ? (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(87, 27, 193, 0.06))',
                        padding: '24px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(168, 232, 255, 0.12)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span className="badge success" style={{ marginBottom: '12px' }}>Faol Banner</span>
                            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                                Bog'langan Mahsulot: {products.find(p => p.id === heroPromo.productId)?.name || 'Topilmadi'}
                            </h3>
                            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}><strong>Matn:</strong> {heroPromo.text}</p>
                            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}><strong>Chegirma:</strong> {heroPromo.discount}%</p>
                            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px' }}><strong>Tugma yozuvi:</strong> {heroPromo.cta}</p>
                        </div>
                        <button className="btn-danger" onClick={handleDeleteHero}>O'chirish</button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface-container)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '16px' }}>Faqat oddiy Hero Banner ko'rsatilmoqda.</p>
                        <button className="btn-primary" onClick={handleEditHero}>Promo qo'shish</button>
                    </div>
                )}
            </div>

            {/* Promokodlar jadvali */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px' }}>Promokodlar Ro'yxati</h2>
                    <button className="btn-primary" onClick={handleAddPromo}>Yangi kod</button>
                </div>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Kod</th>
                                <th>Chegirma foizi</th>
                                <th>Necha marta ishlatilgan</th>
                                <th>Status</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.map(promo => (
                                <tr key={promo.id}>
                                    <td><strong style={{ letterSpacing: '0.05em', background: 'var(--bg-surface-container-high)', padding: '4px 8px', borderRadius: '4px' }}>{promo.code}</strong></td>
                                    <td>{promo.discount}%</td>
                                    <td>{promo.uses} ta</td>
                                    <td>
                                        <span className={`badge ${promo.status === 'active' ? 'success' : 'neutral'}`}>
                                            {promo.status === 'active' ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleEditPromo(promo)}>Tahrirlash</button>
                                            <button className="btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeletePromo(promo.id)}>O'chirish</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {promos.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                                        Promokodlar topilmadi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PromoModal
                isOpen={isPromoModalOpen}
                onClose={() => setIsPromoModalOpen(false)}
                onSave={handleSavePromo}
                initialData={editingPromo}
            />

            <HeroPromoModal
                isOpen={isHeroModalOpen}
                onClose={() => setIsHeroModalOpen(false)}
                onSave={handleSaveHero}
                products={products}
                initialData={heroPromo}
            />
        </div>
    );
}
