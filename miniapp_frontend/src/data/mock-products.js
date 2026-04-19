/**
 * Mock data layer — Stitch dizaynidagi mahsulotlar
 * Backend API ulanganda bu fayl o'chiriladi
 */

export const categories = [
  { id: 'all', label: 'Barchasi' },
  { id: 'text-ai', label: 'Matn AI' },
  { id: 'image-ai', label: 'Tasvir AI' },
  { id: 'code-ai', label: 'Dasturlash' },
  { id: 'video-ai', label: 'Video AI' },
  { id: 'voice-ai', label: 'Ovoz AI' },
  { id: 'analytics', label: 'Analitika' },
]

export const products = [
  {
    id: 1,
    name: 'ChatGPT Plus',
    subtitle: 'GPT-4 Turbo & DALL-E',
    description: "Eng kuchli va aqlli til modeli, murakkab vazifalar uchun.",
    price: 260000,
    icon: 'chat',
    badge: 'HOT',
    badgeType: 'tertiary',
    category: 'text-ai',
    features: [
      { icon: 'palette', title: 'DALL-E 3', desc: 'Professional tasvirlar yaratish', color: 'secondary' },
      { icon: 'bolt', title: 'GPT-4o', desc: 'Tezkor va aqlli model', color: 'primary' },
      { icon: 'extension', title: 'Custom GPTs', desc: "Maxsus vazifalar uchun o'z agentingizni yarating", color: 'tint', wide: true },
    ],
    details: [
      "GPT-4, GPT-4o va GPT-3.5 modellariga to'liq kirish huquqi.",
      "Tig'iz vaqtlarda ham navbatsiz va tezkor javoblar olish.",
      "Web Browsing, Advanced Data Analysis va Vision funksiyalari.",
      "Yangi funksiyalardan birinchilardan bo'lib foydalanish (Early access).",
    ],
    isActive: true,
  },
  {
    id: 2,
    name: 'Claude 3 Opus',
    subtitle: 'Anthropic Flagship',
    description: "Katta hajmdagi matnlar va kod bilan ishlash ustasi.",
    price: 285000,
    icon: 'auto_fix_high',
    badge: 'PRO',
    badgeType: 'neutral',
    category: 'text-ai',
    features: [
      { icon: 'description', title: '200K Context', desc: 'Eng katta kontekst oynasi', color: 'primary' },
      { icon: 'code', title: 'Code Expert', desc: 'Murakkab kodlash imkoniyati', color: 'secondary' },
    ],
    details: [
      "200,000 tokenlik kontekst oynasi — eng kattasi.",
      "Murakkab kodlash va tahlil vazifalarida ustunlik.",
      "Yuqori darajadagi xavfsizlik va etiketka.",
      "Rasmlar bilan ishlash qobiliyati (Vision).",
    ],
    isActive: true,
  },
  {
    id: 3,
    name: 'Midjourney v6',
    subtitle: 'Professional Graphics',
    description: "Yuqori darajadagi san'at asarlari va fotorealistik tasvirlar.",
    price: 145000,
    icon: 'palette',
    badge: 'ART',
    badgeType: 'primary',
    category: 'image-ai',
    features: [
      { icon: 'brush', title: 'Ultra Quality', desc: '4K resolution tasvirlar', color: 'tertiary' },
      { icon: 'style', title: 'Style Transfer', desc: "Har qanday uslubda yaratish", color: 'primary' },
    ],
    details: [
      "Fotorealistik va badiiy tasvirlar yaratish.",
      "4K gacha bo'lgan yuqori sifatli natijalar.",
      "Turli uslublar va parametrlarni moslash.",
      "Tezkor generatsiya — 30 soniya ichida.",
    ],
    isActive: true,
  },
  {
    id: 4,
    name: 'GitHub Copilot',
    subtitle: 'AI Pair Programmer',
    description: "Kodni avtomatik yaratish va taklif qilish yordamchisi.",
    price: 125000,
    icon: 'code',
    badge: 'DEV',
    badgeType: 'neutral',
    category: 'code-ai',
    features: [
      { icon: 'terminal', title: 'Multi-IDE', desc: 'VSCode, JetBrains, Neovim', color: 'primary' },
      { icon: 'school', title: 'Code Review', desc: 'Avtomatik tekshirish', color: 'secondary' },
    ],
    details: [
      "Real-vaqtda kodlash takliflari.",
      "40+ dasturlash tili qo'llab-quvvatlanadi.",
      "Kontekstga asoslangan to'liq funksiyalar yaratish.",
      "IDE integratsiyasi — VSCode, JetBrains, Neovim.",
    ],
    isActive: true,
  },
  {
    id: 5,
    name: 'Perplexity Pro',
    subtitle: 'AI Search Engine',
    description: "Manbalar bilan aqlli qidiruv va tadqiqot tizimi.",
    price: 240000,
    icon: 'psychology',
    badge: 'NEW',
    badgeType: 'tertiary',
    category: 'analytics',
    features: [
      { icon: 'search', title: 'Deep Search', desc: "Internet bo'ylab chuqur qidirish", color: 'primary' },
      { icon: 'source', title: 'Citations', desc: 'Har bir javobga manba', color: 'secondary' },
    ],
    details: [
      "GPT-4 va Claude bilan kuchaytirilgan qidiruv.",
      "Har bir javob uchun manba havola ko'rsatiladi.",
      "Kuniga 300+ Pro qidiruvlar.",
      "Fayllar va rasmlar yuklash imkoniyati.",
    ],
    isActive: true,
  },
  {
    id: 6,
    name: 'Runway Gen-2',
    subtitle: 'AI Video Creation',
    description: "Matndan professional video generatsiya qilish vositasi.",
    price: 195000,
    icon: 'movie_edit',
    badge: 'VIDEO',
    badgeType: 'primary',
    category: 'video-ai',
    features: [
      { icon: 'videocam', title: 'Text to Video', desc: '4 soniyalik video yaratish', color: 'primary' },
      { icon: 'auto_fix', title: 'Edit Tools', desc: "Mavjud videoni o'zgartirish", color: 'secondary' },
    ],
    details: [
      "Matndan 4 soniyalik kinematografik video.",
      "Mavjud rasmdan animatsiya yaratish.",
      "Professional tahrirlash vositalari.",
      "4K eksport imkoniyati.",
    ],
    isActive: true,
  },
  {
    id: 7,
    name: 'ElevenLabs',
    subtitle: 'Advanced TTS',
    description: "Tabiiy ovozli sintez va dublyaj platformasi.",
    price: 95000,
    icon: 'record_voice_over',
    badge: 'VOICE',
    badgeType: 'neutral',
    category: 'voice-ai',
    features: [
      { icon: 'mic', title: 'Voice Clone', desc: "O'z ovozingizni klonlash", color: 'primary' },
      { icon: 'translate', title: '30+ Languages', desc: "Ko'p tilli sintez", color: 'tertiary' },
    ],
    details: [
      "Ultra-realistik ovoz sintezi.",
      "Shaxsiy ovoz klonlash texnologiyasi.",
      "30 dan ortiq tilda ishlaydi.",
      "API integratsiyasi mavjud.",
    ],
    isActive: true,
  },
  {
    id: 8,
    name: 'Jasper AI',
    subtitle: 'Content Marketing',
    description: "Marketing va kontent yaratish AI yordamchisi.",
    price: 320000,
    icon: 'description',
    badge: 'COPY',
    badgeType: 'primary',
    category: 'text-ai',
    features: [
      { icon: 'campaign', title: 'Brand Voice', desc: "Brend ohangini saqlash", color: 'secondary' },
      { icon: 'trending_up', title: 'SEO Tools', desc: 'Qidiruv optimizatsiyasi', color: 'primary' },
    ],
    details: [
      "50+ marketing shablon va freymwork.",
      "Brend ohangini o'rganish va saqlash.",
      "SEO-optimallashtirilgan kontent yaratish.",
      "Jamoaviy ishlash imkoniyatlari.",
    ],
    isActive: true,
  },
]

export const paymentMethods = [
  { id: 'uzcard', name: 'Uzcard / Humo', icon: 'credit_card', color: '#a8e8ff' },
  { id: 'stars', name: 'Telegram Stars', icon: 'star', color: '#ffc107' },
]

export const mockProfile = {
  fullName: 'Azizbek Rakhimov',
  username: 'azizbek',
  bonusBalance: 4250000,
  confirmedOrdersCount: 5,
  isPremium: true,
}

export const mockOrders = [
  { id: 'UT-982410', serviceName: 'ChatGPT Plus', finalPrice: 260000, status: 'confirmed', createdAt: '2024-03-15' },
  { id: 'UT-982388', serviceName: 'Midjourney v6', finalPrice: 145000, status: 'confirmed', createdAt: '2024-03-10' },
  { id: 'UT-982301', serviceName: 'GitHub Copilot', finalPrice: 125000, status: 'pending', createdAt: '2024-03-08' },
]

export function getProductById(id) {
  return products.find(p => p.id === Number(id))
}

export function getProductsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return products
  return products.filter(p => p.category === categoryId)
}

export function searchProducts(query) {
  if (!query) return products
  const q = query.toLowerCase()
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.subtitle.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  )
}

export function formatPrice(price) {
  return new Intl.NumberFormat('uz-UZ').format(price)
}

// Active promo — admin panel dan boshqariladi
// null bo'lsa, hero da oddiy banner ko'rinadi
export const activePromo = {
  productId: 1,
  discount: 30,
  text: "Faqat bugun -30% chegirma bilan obuna bo'ling!",
  cta: 'Hozir olish',
}
