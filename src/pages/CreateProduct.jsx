// Importamos React y hooks necesarios para formularios y estado
import React, { useState } from 'react'
// Importamos el hook de autenticación para obtener token y usuario
import { useAuth } from '../context/AuthContext.jsx'
// Importamos el componente que muestra el nombre del usuario
import UserBar from '../components/UserBar.jsx'
// Importamos funciones de API
import { createProduct, uploadImages, attachImagesToProduct } from '../api/xano.js'

// Componente de la página de creación de productos
export default function CreateProduct() {
  // Obtenemos token y usuario del contexto
  const { token } = useAuth()
  // Estado del formulario de producto
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, brand: '', category: '' })
  // Estado para archivos de imágenes seleccionados
  const [files, setFiles] = useState([])
  // Estado para mostrar errores
  const [error, setError] = useState('')
  // Estado para mostrar resultado del producto creado
  const [result, setResult] = useState(null)
  // Estado de carga durante la creación
  const [creating, setCreating] = useState(false)
  // Leemos la base de la API desde variables de entorno
  const STORE_BASE = import.meta.env.VITE_XANO_STORE_BASE

  // Handler para cambios en inputs del formulario
  function onChange(e) {
    // Actualizamos el estado del formulario usando el nombre del campo como clave
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handler para selección de archivos
  function onFiles(e) {
    // Convertimos FileList a array para manejarlo más fácilmente
    const list = Array.from(e.target.files || [])
    // Guardamos archivos seleccionados
    setFiles(list)
  }



  // Handler del submit del formulario de creación
  async function onSubmit(e) {
    // Prevenimos comportamiento por defecto
    e.preventDefault()
    // Limpiamos errores y marcamos carga
    setError('')
    setCreating(true)
    setResult(null)
    try {
      // Si no hay token, impedimos crear y lanzamos error
      if (!token) throw new Error('Debes iniciar sesión para crear productos.')
      
      // Creamos el producto
      const created = await createProduct(token, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock_quantity: Number(form.stock),
        brand: form.brand,
        category: form.category,
      })
      // Subimos imágenes si hay
      const images = files.length > 0 ? await uploadImages(token, files) : []
      // Adjuntamos si corresponde
      const updated = images.length > 0 ? await attachImagesToProduct(token, created.id, images) : created
      
      // Guardamos el resultado
      setResult(updated)
    } catch (err) {
      // Mostramos el error amigable
      setError(err?.message || 'Error desconocido')
    } finally {
      // Quitamos estado de carga
      setCreating(false)
    }
  }

  // Renderizamos la UI de creación de productos
  return (
    // Contenedor principal con padding
    <div className="container py-3">
      {/* Barra con el nombre del usuario */}
      <UserBar />
      {/* Título de la página */}
      <h2 className="mb-4">➕ Crear Nuevo Producto</h2>
      {/* Nota de restricción por sesión */}
      {!token && (
        // Alerta que impide creación sin sesión
        <div className="alert alert-warning">⚠️ No puedes crear productos sin iniciar sesión.</div>
      )}

      {/* Formulario de creación con estilos mejorados */}
      <div className="product-card">
        <form className="d-grid gap-3" onSubmit={onSubmit}>
          {/* Fila de inputs con grid */}
          <div className="row g-3">
            {/* Campo nombre */}
            <div className="col-md-6">
              {/* Etiqueta e input controlado */}
              <label className="form-label" htmlFor="name">🎯 Nombre del Producto</label>
              {/* Input */}
              <input id="name" name="name" className="form-control" value={form.name} onChange={onChange} placeholder="Ej: Valtryek V2" required />
            </div>
            {/* Campo marca */}
            <div className="col-md-6">
              {/* Etiqueta */}
              <label className="form-label" htmlFor="brand">🏷️ Marca</label>
              {/* Input */}
              <input id="brand" name="brand" className="form-control" value={form.brand} onChange={onChange} placeholder="Ej: Hasbro" />
            </div>
            {/* Campo categoría */}
            <div className="col-md-6">
              {/* Etiqueta */}
              <label className="form-label" htmlFor="category">📁 Categoría</label>
              {/* Input */}
              <input id="category" name="category" className="form-control" value={form.category} onChange={onChange} placeholder="Ej: Attack Type" />
            </div>
            {/* Campo precio */}
            <div className="col-md-6">
              {/* Etiqueta */}
              <label className="form-label" htmlFor="price">💰 Precio (CLP)</label>
              {/* Input numérico */}
              <input id="price" type="number" name="price" className="form-control" value={form.price} onChange={onChange} placeholder="12990" required />
            </div>
            {/* Campo stock */}
            <div className="col-md-6">
              {/* Etiqueta */}
              <label className="form-label" htmlFor="stock">📦 Stock</label>
              {/* Input numérico */}
              <input id="stock" type="number" name="stock" className="form-control" value={form.stock} onChange={onChange} placeholder="10" required />
            </div>
            {/* Campo descripción */}
            <div className="col-12">
              {/* Etiqueta */}
              <label className="form-label" htmlFor="description">📝 Descripción</label>
              {/* Textarea */}
              <textarea id="description" name="description" rows={3} className="form-control" value={form.description} onChange={onChange} placeholder="Describe las características del producto..." />
            </div>
          </div>
          {/* Sección de subida de imágenes */}
          <div style={{ border: '2px dashed rgba(255,255,255,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
            {/* Etiqueta */}
            <label className="form-label">🖼️ Imágenes (puedes seleccionar varias)</label>
            {/* Input de archivos múltiples */}
            <input type="file" multiple accept="image/*" onChange={onFiles} className="form-control mt-2" />
            {/* Previsualización */}
            {files.length > 0 && (
              // Contenedor de imágenes seleccionadas
              <div className="d-flex flex-wrap gap-2 mt-3">
                {/* Mapeo de archivos a imágenes */}
                {files.map((f, i) => (
                  // Imagen con miniatura
                  <img key={i} src={URL.createObjectURL(f)} alt={f.name} className="img-thumbnail" style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '8px' }} />
                ))}
              </div>
            )}
          </div>
          {/* Botón de envío */}
          <button disabled={creating || !token} className="btn btn-primary w-100">
            {/* Texto del botón */}
            {creating ? '⏳ Creando producto...' : '✨ Crear Producto'}
          </button>
        </form>
      </div>
      {/* Error si existe */}
      {error && (
        // Alerta de error
        <div className="alert alert-danger mt-4">⚠️ {error}</div>
      )}
      {/* Resultado si existe */}
      {result && (
        // Contenedor con detalles del resultado con estilos mejorados
        <div className="product-card mt-4">
          {/* Título */}
          <h3 className="mt-0">✅ Producto Creado Exitosamente</h3>
          {/* Información del producto */}
          <div className="mt-3">
            <p><strong>Nombre:</strong> {result.name}</p>
            <p><strong>Precio:</strong> ${result.price?.toLocaleString('es-CL')}</p>
            <p><strong>Stock:</strong> {result.stock_quantity}</p>
            {result.brand && <p><strong>Marca:</strong> {result.brand}</p>}
            {result.category && <p><strong>Categoría:</strong> {result.category}</p>}
          </div>
          {/* Imágenes del producto si existen */}
          {result.image_url && (
            // Contenedor de imágenes del resultado
            <div className="mt-3">
              <strong>Imagen:</strong>
              <div className="mt-2">
                <img src={result.image_url.url} alt={result.name} className="img-thumbnail" style={{ maxWidth: '200px', borderRadius: '8px' }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}