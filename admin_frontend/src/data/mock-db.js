// API-based mock-db for Admin Panel

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '/api';

// Fallback logic for Orders and Users (mocked)
const DB_KEY = 'ustaitech_admin_db_temp';
function getTempDB() {
    const data = localStorage.getItem(DB_KEY);
    if (!data) return { orders: [], users: [] };
    return JSON.parse(data);
}

// ─── PRODUCTS (SERVICES) ────────────────────────────────────────────────────────
export async function getProducts() {
    try {
        const res = await fetch(`${API_BASE}/catalog/services?limit=100`);
        const data = await res.json();
        return (data.items || []).map(p => ({
            id: p.id,
            name: p.name,
            subtitle: p.description_ru || '',
            price: p.price,
            category: p.category_id || 'text-ai',
            badge: p.stars_price > 0 ? 'STARS' : 'HOT',
            status: p.active ? 'active' : 'inactive',
            icon: p.image_file_id || 'star'
        }));
    } catch { return []; }
}

export async function saveProduct(product) {
    const payload = {
        name: product.name,
        description: "Admin panel description",
        price: parseInt(product.price) || 0,
        category_id: parseInt(product.category) || null,
        image_file_id: product.icon || 'star',
        description_ru: product.subtitle || '',
        stars_price: product.badge === 'STARS' ? 100 : 0,
        supports_stars: product.badge === 'STARS' ? 1 : 0
    };

    if (product.id) {
        await fetch(`${API_BASE}/admin/services/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch(`${API_BASE}/admin/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
}

export async function deleteProduct(id) {
    await fetch(`${API_BASE}/admin/services/${id}`, { method: 'DELETE' });
}

// ─── PROMOS & BULK DISCOUNTS ──────────────────────────────────────────────────
export async function getPromos() {
    try {
        const res = await fetch(`${API_BASE}/admin/coupons`);
        const data = await res.json();
        return (data || []).map(c => ({
            id: c.id,
            code: c.code,
            discount: c.discount_percent,
            target: c.service_id ? c.service_id.toString() : 'all',
            status: c.is_active ? 'active' : 'inactive',
            uses: c.used_count || 0,
            max_uses: c.max_uses
        }));
    } catch { return []; }
}

export async function savePromo(promo) {
    const payload = {
        code: promo.code,
        discount_percent: parseInt(promo.discount) || 0,
        max_uses: parseInt(promo.uses) || 100,
        max_per_user: 1,
        service_id: promo.target === 'all' ? null : parseInt(promo.target)
    };
    if (promo.id) {
        await fetch(`${API_BASE}/admin/coupons/${promo.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch(`${API_BASE}/admin/coupons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
}

export async function deletePromo(id) {
    await fetch(`${API_BASE}/admin/coupons/${id}`, { method: 'DELETE' });
}

// ─── HERO PROMO (BANNER) ──────────────────────────────────────────────────────
export async function getActivePromo() {
    try {
        const res = await fetch(`${API_BASE}/admin/promos`);
        const data = await res.json();
        if (data && data.length > 0) {
            const h = data[0];
            return {
                id: h.id, // we'll use this ID to update
                productId: h.service_id || 1, // backend might not have service_id linked strictly if url is used
                discount: 0,
                text: h.text,
                cta: "Batafsil"
            };
        }
        return { productId: 1, discount: 0, text: "Aksiyani sozlang", cta: "Sotib olish" };
    } catch { return null; }
}

export async function updateHeroPromo(promo) {
    const existing = await fetch(`${API_BASE}/admin/promos`).then(r => r.json());

    // We assume the first promo is the hero
    const payload = {
        title: "Maxsus Aksiya",
        text: promo.text,
        image_file_id: "banner_1", // dummy
        url: null
    };

    if (existing && existing.length > 0) {
        await fetch(`${API_BASE}/admin/promos/${existing[0].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch(`${API_BASE}/admin/promos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }
}

// ─── MOCKED DATA ──────────────────────────────────────────────────────────────
export async function getOrders() { return getTempDB().orders; }
export async function getUsers() { return getTempDB().users; }

export function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}

