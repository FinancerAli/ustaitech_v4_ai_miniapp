import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCatalogServices, fetchActivePromotions, fetchProfileSummary, fetchProfileOrders } from '../lib/api';

const CatalogContext = createContext();
const DEFAULT_DESCRIPTION = "Ushbu xizmat orqali siz eng yaxshi imkoniyatlarga ega bo'lasiz.";
const FALLBACK_ICON = 'smart_toy';
const CATEGORY_LABELS = {
  2: 'Matn AI',
  3: 'Biznes',
  8: 'Tasvir AI',
};

function compactText(rawValue) {
  return String(rawValue || '')
    .replace(/\r?\n+/g, ' • ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeBulletSegments(text) {
  const parts = String(text || '')
    .split('•')
    .map(part => part.trim())
    .filter(Boolean);

  const seen = new Set();
  const unique = [];

  for (const part of parts) {
    const normalized = part.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    unique.push(part);
  }

  return unique.join(' • ');
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function normalizeDescription(rawDescription) {
  const cleaned = compactText(rawDescription);
  if (!cleaned) return DEFAULT_DESCRIPTION;
  return truncateText(dedupeBulletSegments(cleaned) || cleaned, 280);
}

function buildSubtitle(descriptionText) {
  const deduped = dedupeBulletSegments(descriptionText);
  return truncateText(deduped || descriptionText, 120);
}

function resolveServiceIcon(service = {}) {
  const safeIcon = value =>
    typeof value === 'string' &&
    /^[a-z0-9_]+$/i.test(value) &&
    value.length <= 24;

  if (safeIcon(service.icon)) return service.icon.toLowerCase();
  if (safeIcon(service.material_icon)) return service.material_icon.toLowerCase();

  const name = String(service.name || '').toLowerCase();
  const iconRules = [
    { pattern: /(chatgpt|gpt[-\s]?4|openai)/, icon: 'smart_toy' },
    { pattern: /(gemini|deep\s*research)/, icon: 'auto_awesome' },
    { pattern: /(claude|anthropic)/, icon: 'psychology' },
    { pattern: /(midjourney|image|rasm|tasvir|sora|video)/, icon: 'image' },
    { pattern: /(canva|design|figma|capcut)/, icon: 'palette' },
    { pattern: /(grok|xai|x\.ai)/, icon: 'bolt' },
    { pattern: /(notion|docs|document)/, icon: 'edit_note' },
    { pattern: /(github|code|developer)/, icon: 'code' },
    { pattern: /(business|team|enterprise)/, icon: 'business_center' },
  ];

  for (const rule of iconRules) {
    if (rule.pattern.test(name)) return rule.icon;
  }

  const categoryId = Number(service.category_id);
  if (categoryId === 8) return 'image';
  if (categoryId === 3) return 'business_center';
  if (categoryId === 2) return 'auto_awesome';

  return FALLBACK_ICON;
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'Barchasi' }]);
  const [activePromo, setActivePromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    id: null,
    fullName: 'Aziz',
    full_name: 'Aziz',
    username: '',
    bonusBalance: 0,
    bonus_balance: 0,
    confirmedOrdersCount: 0,
    confirmed_orders_count: 0,
    total_spent: 0,
    isPremium: false
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, promoRes, profileRes, ordersRes] = await Promise.all([
          fetchCatalogServices().catch(() => ({ items: [] })),
          fetchActivePromotions().catch(() => ({ items: [] })),
          fetchProfileSummary().catch(() => null),
          fetchProfileOrders().catch(() => ({ items: [] }))
        ]);

        // Generate context-aware features based on product name
        const generateFeatures = (name) => {
          const lower = name.toLowerCase();
          if (lower.includes('gpt') || lower.includes('chatgpt')) {
            return [
              { icon: 'smart_toy', title: 'GPT-4 kuchi', desc: 'Eng aqlli AI modeli', color: 'primary' },
              { icon: 'speed', title: 'Cheklovsiz', desc: 'Tez va uzluksiz ishlash', color: 'secondary' }
            ];
          }
          if (lower.includes('canva') || lower.includes('pro')) {
            return [
              { icon: 'palette', title: 'Premium shablonlar', desc: 'Barcha dizaynlar ochiq', color: 'tertiary' },
              { icon: 'magic_button', title: 'AI vositalar', desc: 'Barcha moslamalar', color: 'primary' }
            ];
          }
          if (lower.includes('midjourney') || lower.includes('tasvir')) {
            return [
              { icon: 'image', title: 'Yuqori Sifat', desc: 'Photorealistic rasmlar', color: 'secondary' },
              { icon: 'fast_forward', title: 'Fast soatlari', desc: 'Tezkor generatsiya', color: 'primary' }
            ];
          }
          return [
            { icon: 'verified', title: 'Kafolatlangan', desc: '100% ishonchli xizmat', color: 'primary' },
            { icon: 'support_agent', title: "Qo'llab-quvvatlash", desc: "Tezkor yordam", color: 'secondary' }
          ];
        };

        // Map backend products to frontend format
        const loadedProducts = (servicesRes.items || [])
          .map(service => {
            const serviceId = Number(service.id);
            if (!Number.isFinite(serviceId)) return null;

            const description = normalizeDescription(service.description || service.description_uz || service.description_ru);
            const subtitle = buildSubtitle(description);
            const delivery = compactText(service.delivery_content);
            const price = Number(service.price) || 0;
            const category = Number(service.category_id) || null;
            const hasPromo = Boolean(service.promo_active) || Number(service.cashback_percent || service.promo_cashback_percent || 0) > 0;

            return {
              id: serviceId,
              name: service.name || `Xizmat #${serviceId}`,
              subtitle: subtitle || 'Premium obuna',
              description,
              price,
              icon: resolveServiceIcon(service),
              badge: hasPromo ? 'HOT' : 'TOP',
              badgeType: hasPromo ? 'tertiary' : 'primary',
              category,
              features: generateFeatures(service.name || ''),
              details: [
                delivery || 'Tezkor yetkazib berish (5-10 daqiqa)'
              ],
              isActive: Boolean(service.active),
              imageFileId: service.image_file_id || null,
            };
          })
          .filter(Boolean);
        setProducts(loadedProducts);

        if (promoRes.items && promoRes.items.length > 0) {
          const promo = promoRes.items[0];
          const promoServiceId = Number(promo.service_id);
          setActivePromo({
            productId: Number.isFinite(promoServiceId) ? promoServiceId : (loadedProducts[0]?.id ?? null),
            discount: 0,
            text: promo.text || promo.title || 'Chegirma aksiyasi',
            cta: 'Batafsil'
          });
        }

        if (profileRes) {
          const normalizedProfile = {
            ...profileRes,
            id: Number(profileRes.id) || null,
            full_name: profileRes.full_name || profileRes.fullName || 'Foydalanuvchi',
            fullName: profileRes.full_name || profileRes.fullName || 'Foydalanuvchi',
            username: profileRes.username || '',
            bonus_balance: Number(profileRes.bonus_balance ?? profileRes.bonusBalance ?? 0),
            bonusBalance: Number(profileRes.bonus_balance ?? profileRes.bonusBalance ?? 0),
            confirmed_orders_count: Number(profileRes.confirmed_orders_count ?? profileRes.confirmedOrdersCount ?? 0),
            confirmedOrdersCount: Number(profileRes.confirmed_orders_count ?? profileRes.confirmedOrdersCount ?? 0),
            total_spent: Number(profileRes.total_spent || 0),
            isPremium: Boolean(profileRes.is_premium ?? profileRes.isPremium ?? profileRes.is_confirmed_customer),
          };
          setProfile(normalizedProfile);
        }

        const normalizedOrders = (ordersRes.items || []).map(order => ({
          ...order,
          service_id: Number(order.service_id ?? order.serviceId ?? 0) || null,
          final_price: Number(order.final_price ?? order.finalPrice ?? 0) || 0,
        }));
        setOrders(normalizedOrders);

        // Build dynamic categories based on loaded products
        const uniqueCatIds = [...new Set(loadedProducts.map(p => p.category).filter(c => Number.isFinite(c)))].sort((a, b) => a - b);
        const finalCats = [{ id: 'all', label: 'Barchasi' }].concat(
          uniqueCatIds.map(id => ({
            id,
            label: CATEGORY_LABELS[id] || `Kategoriya ${id}`,
          }))
        );
        setCategories(finalCats);

      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getProductById = (id) => products.find(p => p.id === Number(id));
  const getProductsByCategory = (catId) => {
    if (catId === 'all') return products;
    const normalizedCategory = Number(catId);
    return products.filter(p => p.category === normalizedCategory);
  };
  const searchProducts = (q) => {
    if (!q) return products;
    const lower = q.toLowerCase();
    return products.filter(p =>
      p.name?.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.subtitle?.toLowerCase().includes(lower)
    );
  };
  const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

  const value = {
    products,
    categories,
    activePromo,
    loading,
    profile,
    orders,
    getProductById,
    getProductsByCategory,
    searchProducts,
    formatPrice,
    paymentMethods: [
      { id: 'uzcard', name: 'Uzcard / Humo', icon: 'credit_card', color: '#a8e8ff' },
      { id: 'stars', name: 'Telegram Stars', icon: 'star', color: '#ffc107' }
    ]
  };

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  return useContext(CatalogContext);
}
