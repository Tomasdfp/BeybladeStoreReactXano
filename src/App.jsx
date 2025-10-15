// src/App.jsx - Contenedor de rutas de la aplicación
// Este archivo define las rutas: /home, /login, /logout y /crear-productos

// Importamos componentes de React Router para definir el enrutado
import { Routes, Route, Navigate, Link } from 'react-router-dom'
// Importamos el hook de autenticación para conocer usuario y token
import { useAuth } from './context/AuthContext.jsx'
// Importamos las páginas que vamos a mostrar
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Logout from './pages/Logout.jsx'
import CreateProduct from './pages/CreateProduct.jsx'
import Orders from './pages/Orders.jsx'
import Categories from './pages/Categories.jsx'

// Componente principal que renderiza la barra superior y las rutas
export default function App() {
  // Obtenemos el contexto para saber si hay usuario
  const { user } = useAuth() // Leemos usuario actual

  // Renderizamos la estructura de navegación y las rutas
  return (
    // Contenedor general
    <div className="container py-4">
      {/* Barra de navegación mejorada */}
      <nav className="d-flex align-items-center gap-3 mb-4">
        {/* Logo/Título */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <h4 className="m-0" style={{ 
            background: 'linear-gradient(135deg, #007bff, #ff6b35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            BeybladeStore
          </h4>
        </Link>
        {/* Enlaces de navegación */}
        <Link to="/categorias">Categorías</Link>
        <Link to="/crear-productos">Crear Producto</Link>
        {user && <Link to="/ordenes">Mis Órdenes</Link>}
        {/* Usuario y Login/Logout */}
        <span className="ms-auto text-muted">{user?.name ? `👋 ${user.name}` : 'No conectado'}</span>
        {user ? (
          <Link to="/logout">Salir</Link>
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </nav>

      {/* Definición de rutas */}
      <Routes>
        {/* Redirección raíz a /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Página de Home: muestra productos */}
        <Route path="/home" element={<Home />} />
        {/* Página de Login: formulario de inicio de sesión */}
        <Route path="/login" element={<Login />} />
        {/* Página de Logout: cierra la sesión */}
        <Route path="/logout" element={<Logout />} />
        {/* Página de creación de productos: protegida por sesión en el propio componente */}
        <Route path="/crear-productos" element={<CreateProduct />} />
        {/* Página de órdenes: muestra las órdenes del usuario */}
        <Route path="/ordenes" element={<Orders />} />
        {/* Página de categorías: gestión de categorías */}
        <Route path="/categorias" element={<Categories />} />
        {/* Ruta comodín: si no existe, redirige a home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  )
}
