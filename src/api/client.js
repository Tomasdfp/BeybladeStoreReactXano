// src/api/client.js
// Cliente unificado para las APIs de Xano (Auth y Store) usando fetch
// Tipos disponibles en src/types/api.ts para referencia

const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE;
// Usar proxy local en desarrollo, URL real en producción
const isDev = typeof window !== 'undefined' && window.location && window.location.origin.includes('localhost');
const STORE_BASE = isDev ? '/api' : import.meta.env.VITE_XANO_STORE_BASE;

function jsonOrNull(res) {
  if (res.status === 204) return null;
  const len = res.headers.get('content-length');
  if (len === '0') return null;
  return res.json();
}

async function request(base, path, { method = 'GET', headers = {}, query, body, token, isFormData = false } = {}) {

  // Permitir base relativa (proxy local) o absoluta (producción)
  let url;
  if (base.startsWith('http')) {
    url = new URL(path, base);
  } else {
    // base es '/api', path es '/product' → '/api/product'
    url = new URL(base + path, window.location.origin);
  }
  if (query) Object.entries(query).forEach(([k, v]) => v != null && url.searchParams.append(k, String(v)));

  const h = new Headers(headers);
  if (token) h.set('Authorization', `Bearer ${token}`);
  if (!isFormData && body != null && !(body instanceof Blob)) h.set('Content-Type', 'application/json');

  const res = await fetch(url, {
    method,
    headers: h,
    body: body == null ? undefined : (isFormData ? body : JSON.stringify(body))
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }
  return jsonOrNull(res);
}

export const xanoAuth = {
  login: ({ email, password }) => request(AUTH_BASE, '/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request(AUTH_BASE, '/auth/me', { token }),
  signup: ({ name, email, password }) => request(AUTH_BASE, '/auth/signup', { method: 'POST', body: { name, email, password } }),
};

export const xanoStore = {
  // ============ Productos ============
  listProducts: ({ token, limit, offset, q } = {}) => request(STORE_BASE, '/product', { token, query: { limit, offset, q } }),
  getProduct: (id, { token } = {}) => request(STORE_BASE, `/product/${id}`, { token }),
  createProduct: (token, payload) => request(STORE_BASE, '/product', { method: 'POST', token, body: payload }),
  updateProduct: (token, id, payload) => request(STORE_BASE, `/product/${id}`, { method: 'PATCH', token, body: payload }),
  deleteProduct: (token, id) => request(STORE_BASE, `/product/${id}`, { method: 'DELETE', token }),
  
  // ============ Imágenes ============
  uploadImages: (token, files) => {
    const fd = new FormData();
    for (const f of files) fd.append('content', f);
    return request(STORE_BASE, '/upload/image', { method: 'POST', token, body: fd, isFormData: true });
  },
  
  // ============ Categorías ============
  listCategories: ({ token } = {}) => request(STORE_BASE, '/product_category', { token }),
  getCategory: (id, { token } = {}) => request(STORE_BASE, `/product_category/${id}`, { token }),
  createCategory: (token, payload) => request(STORE_BASE, '/product_category', { method: 'POST', token, body: payload }),
  updateCategory: (token, id, payload) => request(STORE_BASE, `/product_category/${id}`, { method: 'PATCH', token, body: payload }),
  deleteCategory: (token, id) => request(STORE_BASE, `/product_category/${id}`, { method: 'DELETE', token }),
  
  // ============ Relaciones Producto-Categoría ============
  listProductCategoryRelations: ({ token } = {}) => request(STORE_BASE, '/product_category_relation', { token }),
  getProductCategoryRelation: (id, { token } = {}) => request(STORE_BASE, `/product_category_relation/${id}`, { token }),
  createProductCategoryRelation: (token, payload) => request(STORE_BASE, '/product_category_relation', { method: 'POST', token, body: payload }),
  updateProductCategoryRelation: (token, id, payload) => request(STORE_BASE, `/product_category_relation/${id}`, { method: 'PATCH', token, body: payload }),
  deleteProductCategoryRelation: (token, id) => request(STORE_BASE, `/product_category_relation/${id}`, { method: 'DELETE', token }),
  
  // ============ Órdenes ============
  listOrders: ({ token } = {}) => request(STORE_BASE, '/order', { token }),
  getOrder: (id, { token } = {}) => request(STORE_BASE, `/order/${id}`, { token }),
  createOrder: (token, payload) => request(STORE_BASE, '/order', { method: 'POST', token, body: payload }),
  updateOrder: (token, id, payload) => request(STORE_BASE, `/order/${id}`, { method: 'PATCH', token, body: payload }),
  deleteOrder: (token, id) => request(STORE_BASE, `/order/${id}`, { method: 'DELETE', token }),
  
  // ============ Items de Orden ============
  listOrderItems: ({ token } = {}) => request(STORE_BASE, '/order_item', { token }),
  getOrderItem: (id, { token } = {}) => request(STORE_BASE, `/order_item/${id}`, { token }),
  createOrderItem: (token, payload) => request(STORE_BASE, '/order_item', { method: 'POST', token, body: payload }),
  updateOrderItem: (token, id, payload) => request(STORE_BASE, `/order_item/${id}`, { method: 'PATCH', token, body: payload }),
  deleteOrderItem: (token, id) => request(STORE_BASE, `/order_item/${id}`, { method: 'DELETE', token }),
  
  // ============ Inventario ============
  listInventory: ({ token } = {}) => request(STORE_BASE, '/inventory', { token }),
  getInventory: (id, { token } = {}) => request(STORE_BASE, `/inventory/${id}`, { token }),
  createInventory: (token, payload) => request(STORE_BASE, '/inventory', { method: 'POST', token, body: payload }),
  updateInventory: (token, id, payload) => request(STORE_BASE, `/inventory/${id}`, { method: 'PATCH', token, body: payload }),
  deleteInventory: (token, id) => request(STORE_BASE, `/inventory/${id}`, { method: 'DELETE', token }),
  
  // ============ Direcciones ============
  listAddresses: ({ token } = {}) => request(STORE_BASE, '/address', { token }),
  getAddress: (id, { token } = {}) => request(STORE_BASE, `/address/${id}`, { token }),
  createAddress: (token, payload) => request(STORE_BASE, '/address', { method: 'POST', token, body: payload }),
  updateAddress: (token, id, payload) => request(STORE_BASE, `/address/${id}`, { method: 'PATCH', token, body: payload }),
  deleteAddress: (token, id) => request(STORE_BASE, `/address/${id}`, { method: 'DELETE', token }),
  
  // ============ Reseñas ============
  listReviews: ({ token } = {}) => request(STORE_BASE, '/review', { token }),
  getReview: (id, { token } = {}) => request(STORE_BASE, `/review/${id}`, { token }),
  createReview: (token, payload) => request(STORE_BASE, '/review', { method: 'POST', token, body: payload }),
  updateReview: (token, id, payload) => request(STORE_BASE, `/review/${id}`, { method: 'PATCH', token, body: payload }),
  deleteReview: (token, id) => request(STORE_BASE, `/review/${id}`, { method: 'DELETE', token }),
};

export function makeAuthHeader(token) {
  return { Authorization: `Bearer ${token}` };
}
