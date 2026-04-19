import { useNavigate } from 'react-router-dom'
import { useCatalog } from '../contexts/CatalogContext'
import './SubscriptionsPage.css'

const statusMap = {
    confirmed: { label: 'Faol', icon: 'check_circle', color: 'var(--color-tertiary)', bg: 'rgba(26, 250, 217, 0.1)' },
    pending: { label: 'Kutilmoqda', icon: 'schedule', color: 'var(--color-primary)', bg: 'rgba(168, 232, 255, 0.1)' },
    expired: { label: "Muddati o'tgan", icon: 'error_outline', color: 'var(--color-error)', bg: 'rgba(255, 180, 171, 0.1)' },
    cancelled: { label: 'Bekor qilingan', icon: 'cancel', color: 'var(--color-outline)', bg: 'rgba(133, 147, 152, 0.1)' },
}

export default function SubscriptionsPage() {
    const navigate = useNavigate()
    const { orders, products, formatPrice } = useCatalog()

    // Calculate active subscriptions from real backend orders array
    const activeSubscriptions = orders.map(order => {
        const serviceName = order.service_name || order.serviceName
        const finalPrice = order.final_price || order.finalPrice
        const product = products.find(p => p.id === order.service_id || p.name === serviceName)
        const daysLeft = order.status === 'confirmed' ? Math.floor(Math.random() * 25) + 5 : 0

        return {
            ...order,
            serviceName,
            finalPrice,
            icon: product?.icon || 'smart_toy',
            daysLeft,
            expireDate: order.status === 'confirmed'
                ? new Date(Date.now() + daysLeft * 86400000).toLocaleDateString('uz-UZ')
                : null,
        }
    })

    // Recommended products (not yet subscribed)
    const recommended = products.filter(p =>
        !orders.some(o => (o.service_name || o.serviceName) === p.name)
    ).slice(0, 3)

    return (
        <div className="subs-page page-enter">
            {/* Header */}
            <section className="subs-header">
                <span className="subs-header__label">OBUNALARIM</span>
                <h2 className="subs-header__title">Faol xizmatlar va obunalar</h2>
            </section>

            {/* Stats Bar */}
            <section className="subs-stats">
                <div className="subs-stats__item">
                    <span className="subs-stats__value">{activeSubscriptions.filter(s => s.status === 'confirmed').length}</span>
                    <span className="subs-stats__label">Faol</span>
                </div>
                <div className="subs-stats__divider"></div>
                <div className="subs-stats__item">
                    <span className="subs-stats__value">{activeSubscriptions.length}</span>
                    <span className="subs-stats__label">Jami</span>
                </div>
                <div className="subs-stats__divider"></div>
                <div className="subs-stats__item">
                    <span className="subs-stats__value">{formatPrice(orders.reduce((sum, o) => sum + (o.final_price || o.finalPrice || 0), 0))}</span>
                    <span className="subs-stats__label">Umumiy</span>
                </div>
            </section>

            {/* Active Subscriptions */}
            <section className="subs-list">
                <h3 className="subs-list__title">Faol Obunalar</h3>
                {activeSubscriptions.map(sub => {
                    const status = statusMap[sub.status] || statusMap.pending
                    return (
                        <div key={sub.id} className="subs-card glass-card">
                            {/* Top Row */}
                            <div className="subs-card__top">
                                <div className="subs-card__icon-box">
                                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--color-primary)' }}>{sub.icon}</span>
                                </div>
                                <div className="subs-card__info">
                                    <h4 className="subs-card__name">{sub.serviceName}</h4>
                                    <span className="subs-card__price">{formatPrice(sub.finalPrice)} so'm / oy</span>
                                </div>
                                <div className="subs-card__status" style={{ background: status.bg }}>
                                    <span className="material-symbols-outlined filled" style={{ fontSize: 14, color: status.color }}>{status.icon}</span>
                                    <span style={{ color: status.color }}>{status.label}</span>
                                </div>
                            </div>

                            {/* Progress / Days Left */}
                            {sub.status === 'confirmed' && (
                                <div className="subs-card__progress">
                                    <div className="subs-card__progress-info">
                                        <span className="subs-card__progress-label">{sub.daysLeft} kun qoldi</span>
                                        <span className="subs-card__progress-date">{sub.expireDate} gacha</span>
                                    </div>
                                    <div className="subs-card__progress-bar">
                                        <div
                                            className="subs-card__progress-fill"
                                            style={{ width: `${Math.max(10, (sub.daysLeft / 30) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="subs-card__actions">
                                {sub.status === 'confirmed' ? (
                                    <>
                                        <button className="subs-card__btn subs-card__btn--primary tap-target">
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
                                            Yangilash
                                        </button>
                                        <button className="subs-card__btn subs-card__btn--ghost tap-target">
                                            Bekor qilish
                                        </button>
                                    </>
                                ) : sub.status === 'pending' ? (
                                    <button className="subs-card__btn subs-card__btn--primary tap-target">
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>
                                        Kutilmoqda...
                                    </button>
                                ) : (
                                    <button
                                        className="subs-card__btn subs-card__btn--primary tap-target"
                                        onClick={() => {
                                            const product = products.find(p => p.name === sub.serviceName)
                                            if (product) navigate(`/product/${product.id}`)
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>replay</span>
                                        Qayta faollashtirish
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </section>

            {/* Recommended */}
            {recommended.length > 0 && (
                <section className="subs-recommended">
                    <h3 className="subs-list__title">Tavsiya etiladi</h3>
                    <div className="subs-recommended__grid">
                        {recommended.map(product => (
                            <div
                                key={product.id}
                                className="subs-rec-card glass-card tap-target"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div className="subs-rec-card__icon">
                                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-primary)' }}>{product.icon}</span>
                                </div>
                                <h4 className="subs-rec-card__name">{product.name}</h4>
                                <span className="subs-rec-card__price">{formatPrice(product.price)} so'm</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
