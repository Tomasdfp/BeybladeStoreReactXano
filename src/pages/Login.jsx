// Importamos React y hooks necesarios para formularios y navegación
import React, { useState } from 'react'
// Importamos el hook de autenticación para ejecutar login por Axios y Fetch
import { useAuth } from '../context/AuthContext.jsx'
// Importamos el componente que muestra el nombre del usuario
import UserBar from '../components/UserBar.jsx'
// Importamos useNavigate para redirigir tras iniciar sesión
import { useNavigate } from 'react-router-dom'

// Componente de la página de inicio de sesión
export default function Login() {
  // Obtenemos función de login desde el contexto
  const { login } = useAuth()
  // Creamos estado local para email y password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Estado para manejar errores y carga
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  // Hook de navegación para redirigir al usuario
  const navigate = useNavigate()

  // Handler para login
  async function handleLogin(e) {
    // Prevenimos el submit por defecto
    e?.preventDefault?.()
    // Limpiamos errores y marcamos carga
    setErr('')
    setLoading(true)
    try {
      // Ejecutamos login
      await login({ email, password })
      // Redirigimos al Home tras login exitoso
      navigate('/home')
    } catch (error) {
      // Mostramos mensaje de error
      setErr(error?.message || 'Error al iniciar sesión')
    } finally {
      // Finalizamos la carga
      setLoading(false)
    }
  }

  // Renderizamos la interfaz de login con diseño mejorado
  return (
    // Contenedor principal con padding
    <div className="container py-3">
      {/* Barra con el nombre del usuario */}
      <UserBar />
      
      {/* Contenedor de formulario estilizado */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="product-card">
            {/* Título de la página */}
            <h2 className="mb-4 text-center">🔐 Inicio de Sesión</h2>
            
            {/* Formulario de credenciales */}
            <form className="d-grid gap-3" onSubmit={handleLogin}>
              {/* Campo de email */}
              <div>
                {/* Etiqueta */}
                <label className="form-label" htmlFor="email">📧 Email</label>
                {/* Input controlado */}
                <input 
                  id="email" 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              {/* Campo de contraseña */}
              <div>
                {/* Etiqueta */}
                <label className="form-label" htmlFor="password">🔑 Contraseña</label>
                {/* Input controlado */}
                <input 
                  id="password" 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {/* Botón de login */}
              <div className="mt-2">
                <button className="btn btn-primary w-100" disabled={loading} type="submit">
                  {loading ? '⏳ Iniciando...' : '✨ Iniciar Sesión'}
                </button>
              </div>
            </form>
            
            {/* Mostrar error si existe */}
            {err && (
              // Alerta Bootstrap para errores
              <div className="alert alert-danger mt-3">⚠️ {err}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}