const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') ||
  '/api'

function getTelegramInitData() {
  try {
    return window.Telegram?.WebApp?.initData || ''
  } catch {
    return ''
  }
}

async function apiGet(path) {
  const headers = {
    Accept: 'application/json',
  }

  const initData = getTelegramInitData()
  if (initData) {
    headers['X-Telegram-Init-Data'] = initData
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { headers })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API ${response.status}: ${text}`)
  }

  return response.json()
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export async function fetchCatalogServices(params = {}) {
  const search = new URLSearchParams()

  if (params.only_active !== undefined) {
    search.set('only_active', String(params.only_active))
  }
  if (params.category_id !== undefined && params.category_id !== null) {
    search.set('category_id', String(params.category_id))
  }
  if (params.query) {
    search.set('query', params.query)
  }
  if (params.limit !== undefined && params.limit !== null) {
    search.set('limit', String(params.limit))
  }
  if (params.offset !== undefined && params.offset !== null) {
    search.set('offset', String(params.offset))
  }

  const qs = search.toString()
  return apiGet(`/catalog/services${qs ? `?${qs}` : ''}`)
}

export async function fetchCatalogServiceDetail(serviceId) {
  return apiGet(`/catalog/services/${serviceId}`)
}

export async function fetchActivePromotions() {
  return apiGet('/catalog/promotions/active')
}

export async function fetchProfileSummary() {
  return apiGet('/profile/me/summary')
}

export async function fetchProfileOrders() {
  return apiGet('/profile/me/orders')
}

