// mock-db.js
// LocalStorage based mock database for the Admin Panel

const DB_KEY = 'ustaitech_admin_db';

const defaultData = {
    products: [
        { id: 1, name: 'ChatGPT Plus', subtitle: 'GPT-4 Turbo & DALL-E', price: 260000, category: 'text-ai', badge: 'HOT', status: 'active', icon: 'chat' },
        { id: 2, name: 'Claude 3 Opus', subtitle: 'Anthropic Flagship', price: 285000, category: 'text-ai', badge: 'PRO', status: 'active', icon: 'auto_fix_high' },
        { id: 3, name: 'Midjourney v6', subtitle: 'Professional Graphics', price: 145000, category: 'image-ai', badge: 'ART', status: 'active', icon: 'palette' }
    ],
    orders: [
        { id: 'UT-982410', customer: 'Azizbek Rakhimov', serviceName: 'ChatGPT Plus', finalPrice: 260000, status: 'confirmed', createdAt: '2024-03-15' },
        { id: 'UT-982388', customer: 'Olimjon', serviceName: 'Midjourney v6', finalPrice: 145000, status: 'confirmed', createdAt: '2024-03-10' },
        { id: 'UT-982301', customer: 'Nodir', serviceName: 'GitHub Copilot', finalPrice: 125000, status: 'pending', createdAt: '2024-03-08' },
    ],
    users: [
        { id: 1, tgId: '123456789', fullName: 'Azizbek Rakhimov', username: 'azizbek', balance: 4250000, joined: '2024-01-10' },
        { id: 2, tgId: '987654321', fullName: 'Sardor', username: 'sardorv', balance: 0, joined: '2024-02-15' }
    ],
    promos: [
        { id: 1, code: 'USTAI10', discount: 10, target: 'all', status: 'active', uses: 45 },
        { id: 2, code: 'NEWYEAR', discount: 20, target: 'all', status: 'inactive', uses: 120 }
    ],
    activeHeroPromo: {
        productId: 1,
        discount: 30,
        text: "Faqat bugun -30% chegirma bilan obuna bo'ling!",
        cta: 'Hozir olish',
    }
};

export function getDB() {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

export function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

export function getProducts() { return getDB().products; }
export function getOrders() { return getDB().orders; }
export function getUsers() { return getDB().users; }
export function getPromos() { return getDB().promos; }
export function getActivePromo() { return getDB().activeHeroPromo; }

// Mutators
export function saveProduct(product) {
    const db = getDB();
    if (product.id) {
        db.products = db.products.map(p => p.id === product.id ? product : p);
    } else {
        const nextId = Math.max(0, ...db.products.map(p => p.id)) + 1;
        db.products.push({ ...product, id: nextId });
    }
    saveDB(db);
}

export function deleteProduct(id) {
    const db = getDB();
    db.products = db.products.filter(p => p.id !== id);
    saveDB(db);
}

export function savePromo(promo) {
    const db = getDB();
    if (promo.id) {
        db.promos = db.promos.map(p => p.id === promo.id ? promo : p);
    } else {
        const nextId = Math.max(0, ...db.promos.map(p => p.id)) + 1;
        db.promos.push({ ...promo, id: nextId, uses: 0 });
    }
    saveDB(db);
}

export function deletePromo(id) {
    const db = getDB();
    db.promos = db.promos.filter(p => p.id !== id);
    saveDB(db);
}

export function updateHeroPromo(promo) {
    const db = getDB();
    db.activeHeroPromo = promo;
    saveDB(db);
}

// Utils
export function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
}
