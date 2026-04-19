// This file has been replaced by CatalogContext to support API integration.
// Imports to mock-products will be redirected to the context locally in each component.
// Exporting empty objects to prevent sudden crashes if a file hasn't been updated yet.

export const products = [];
export const categories = [];
export const activePromo = null;
export const paymentMethods = [];
export const mockProfile = {};
export const mockOrders = [];

export function getProductById(id) { return null; }
export function getProductsByCategory(id) { return []; }
export function searchProducts(q) { return []; }
export function formatPrice(price) { return new Intl.NumberFormat('uz-UZ').format(price || 0); }
