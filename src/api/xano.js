// src/api/xano.js - Módulo para interactuar con la API de Xano
// Este archivo contiene todas las funciones necesarias para comunicarse con el backend de Xano
// AHORA DELEGA AL CLIENTE UNIFICADO (client.js) para evitar duplicación

import { xanoStore, makeAuthHeader as makeAuthHeaderBase } from './client.js';

// Re-exportamos makeAuthHeader para compatibilidad con código existente
export const makeAuthHeader = makeAuthHeaderBase;

// 1) Función para crear un nuevo producto (sin imágenes inicialmente)
// Parámetros:
// - token: JWT para autenticación
// - payload: objeto con los datos del producto (nombre, precio, etc.)
export async function createProduct(token, payload) {
  return xanoStore.createProduct(token, payload);
}

// 2) Función para subir múltiples imágenes al servidor
// Parámetros:
// - token: JWT para autenticación
// - files: array de archivos (objetos File del navegador)
export async function uploadImages(token, files) {
  const data = await xanoStore.uploadImages(token, files);
  // Si la respuesta es un objeto (imagen única), lo convertimos a array
  // Si es array, lo devolvemos tal cual
  const arr = Array.isArray(data) ? data : (data ? [data] : []);
  return arr;
}

// 3) Función para asociar imágenes a un producto existente
// Parámetros:
// - token: JWT para autenticación
// - productId: ID del producto al que asociar las imágenes
// - imagesFullArray: array completo con la información de las imágenes subidas
export async function attachImagesToProduct(token, productId, imagesFullArray) {
  // En Xano el campo es 'image_url' (singular), tomamos la primera imagen
  const imageUrl = imagesFullArray[0] || null;
  return xanoStore.updateProduct(token, productId, { image_url: imageUrl });
}

// 4) Función para listar productos con soporte para paginación y búsqueda
// Parámetros (objeto con propiedades opcionales):
// - token: JWT para autenticación (opcional)
// - limit: número máximo de productos a devolver (por defecto 12)
// - offset: número de productos a saltar (para paginación, por defecto 0)
// - q: término de búsqueda (por defecto vacío)
export async function listProducts({ token, limit = 12, offset = 0, q = "" } = {}) {
  const data = await xanoStore.listProducts({ token, limit, offset, q });
  // Normalizamos la respuesta para asegurar que siempre devolvemos un array
  return Array.isArray(data) ? data : (data?.items ?? []);
}

// ============================================================================
// EJEMPLOS DE USO ADICIONALES (usando el cliente unificado directamente)
// ============================================================================
// 
// Obtener un producto por ID:
//   import { xanoStore } from './client.js';
//   const product = await xanoStore.getProduct(123, { token });
// 
// Eliminar un producto:
//   await xanoStore.deleteProduct(token, productId);
// 
// Autenticación (desde AuthContext o cualquier componente):
//   import { xanoAuth } from './client.js';
//   const { authToken } = await xanoAuth.login({ email: 'user@example.com', password: '***' });
//   const userProfile = await xanoAuth.me(authToken);
// 
// Ver client.js para más métodos disponibles (orders, inventory, etc.)
// ============================================================================