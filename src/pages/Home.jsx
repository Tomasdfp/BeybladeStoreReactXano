// Importamos React para definir el componente
import React from 'react'
// Importamos el componente que muestra el nombre del usuario
import UserBar from '../components/UserBar.jsx'
// Importamos el componente de cuadrícula de productos
import ProductGrid from '../components/ProductGrid.jsx'
// Importamos el hook de autenticación para obtener el token
import { useAuth } from '../context/AuthContext.jsx'

// Componente de la página Home donde se muestran los productos registrados
export default function Home() {
  // Obtenemos token desde el contexto de autenticación
  const { token } = useAuth()
  // Renderizamos la página con la cuadrícula de productos
  return (
    // Contenedor principal con padding
    <div className="container py-3">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>¡Desata la Batalla con los Mejores Beyblades!</h1>
        <p>Encuentra los lanzadores, arenas y Beyblades más potentes en BeybladeStore</p>
      </section>

      {/* Barra con el nombre del usuario */}
      <UserBar />
      
      {/* Título de la sección */}
      <h2 className="mb-4">Beyblades Destacados</h2>
      
      {/* Sección de productos */}
      <section>
        {/* Componente de cuadrícula de productos */}
        <ProductGrid token={token} />
      </section>
    </div>
  )
}