import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCatalogServices, fetchActivePromotions, fetchProfileSummary, fetchProfileOrders } from '../lib/api';

const CatalogContext = createContext();

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'Barchasi' }]);
  const [activePromo, setActivePromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: 'Aziz',
    username: '',
    bonusBalance: 0,
    confirmedOrdersCount: 0,
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
        const loadedProducts = (servicesRes.items || []).map(p => ({
          id: p.id,
          name: p.name,
          subtitle: p.description || 'Premium obuna', // Removed Russian description
          description: p.description || 'Ushbu xizmat orqali siz eng yaxshi imkoniyatlarga ega bo\'lasiz.',
          price: p.price,
          icon: p.image_file_id || 'star', // fallback icon
          badge: p.stars_price > 0 ? 'STARS' : 'HOT',
          badgeType: p.stars_price > 0 ? 'primary' : 'tertiary',
          category: p.category_id,
          features: generateFeatures(p.name),
          details: [
            p.delivery_content || "Tezkor yetkazib berish (5-10 daqiqa)"
          ],
          isActive: p.active === 1
        }));
        setProducts(loadedProducts);

        if (promoRes.items && promoRes.items.length > 0) {
          const promo = promoRes.items[0];
          setActivePromo({
            productId: promo.service_id || (loadedProducts.length > 0 ? loadedProducts[0].id : null),
            discount: 0,
            text: promo.text || promo.title,
            cta: 'Batafsil'
          });
        }

        if (profileRes) {
          setProfile(profileRes);
        }

        setOrders(ordersRes.items || []);

        // Build dynamic categories based on loaded products
        const uniqueCatIds = [...new Set(loadedProducts.map(p => p.category).filter(c => c))];
        const dynamicCats = uniqueCatIds.map(id => ({ id, label: `Kategoriya ${id}` })); // Simplified
        const finalCats = [{ id: 'all', label: 'Barchasi' }];
        // Add hardcoded mappings for a better UI if desired, else use dynamic
        finalCats.push({ id: 2, label: 'Matn AI' });
        finalCats.push({ id: 3, label: 'Biznes' });
        finalCats.push({ id: 8, label: 'Tasvir AI' });
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
  const getProductsByCategory = (catId) => catId === 'all' ? products : products.filter(p => p.category === catId);
  const searchProducts = (q) => {
    if (!q) return products;
    const lower = q.toLowerCase();
    return products.filter(p => p.name?.toLowerCase().includes(lower) || p.description?.toLowerCase().includes(lower));
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
