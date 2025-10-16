// src/components/ProductGrid.jsx - Componente para mostrar productos en una cuadrícula
// Este componente muestra una lista de productos con paginación, búsqueda y visualización en tarjetas

// Importamos los hooks necesarios de React y la función para obtener productos de la API
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProductImagesSlider from "./ProductImagesSlider.jsx";
import { listProducts } from "../api/xano";

// Creamos un formateador de moneda para mostrar precios en formato CLP (pesos chilenos)
const CLP = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// Componente principal que recibe el token de autenticación como prop
export default function ProductGrid({ token }) {
  const { user } = useAuth();
  // Estados para manejar los productos y la interfaz
  const [items, setItems] = useState([]); // Lista de productos
  const [loading, setLoading] = useState(false); // Estado de carga
  const [err, setErr] = useState(""); // Mensajes de error
  const [offset, setOffset] = useState(0); // Desplazamiento para paginación
  const [hasMore, setHasMore] = useState(true); // Indica si hay más productos para cargar
  const [q, setQ] = useState(""); // Término de búsqueda

  // Constante para el límite de productos por página
  const LIMIT = 12;

  // Hook de efecto para cargar los productos al montar el componente
  useEffect(() => {
    // Carga inicial de productos
    void fetchPage({ reset: true });
    // Desactivamos la advertencia de dependencias porque solo queremos que se ejecute al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función asíncrona para cargar una página de productos
  async function fetchPage({ reset = false } = {}) {
    try {
      // Actualizamos el estado para mostrar la carga y limpiar errores previos
      setLoading(true);
      setErr("");
      
      // Calculamos el offset para la siguiente página (0 si es reset)
      const nextOffset = reset ? 0 : offset;
      
      // Llamamos a la API para obtener los productos
      const batch = await listProducts({ token, limit: LIMIT, offset: nextOffset, q });
      
      // Determinamos si hay más productos disponibles
      setHasMore(batch.length === LIMIT); // Si trae menos que el límite, no hay más
      
      // Actualizamos el offset para la próxima carga
      setOffset(nextOffset + batch.length);
      
      // Actualizamos la lista de productos (reemplazando o añadiendo según reset)
      setItems((old) => (reset ? batch : [...old, ...batch]));
    } catch (e) {
      // Manejamos cualquier error que ocurra durante la carga
      setErr(e.message || "Error al cargar productos");
    } finally {
      // Finalizamos el estado de carga independientemente del resultado
      setLoading(false);
    }
  }

  // Filtramos los productos según el término de búsqueda (búsqueda local)
  // useMemo optimiza el rendimiento recalculando solo cuando items o q cambian
  const filtered = useMemo(() => {
    // Preparamos el término de búsqueda eliminando espacios y convirtiendo a minúsculas
    const needle = q.trim().toLowerCase();
    
    // Si no hay término de búsqueda, devolvemos todos los productos
    if (!needle) return items;
    
    // Filtramos los productos que coincidan con el término en cualquier campo relevante
    // Soporta tanto la estructura antigua (category) como la nueva (type)
    return items.filter((p) =>
      [p.name, p.brand, p.category, p.type, p.series, p.description].some((f) =>
        String(f || "").toLowerCase().includes(needle)
      )
    );
  }, [items, q]);

  // Renderizamos la interfaz del componente
  return (
    <div>
      {/* Barra de búsqueda y controles */}
      <div className="search-container">
        <div className="d-flex align-items-center gap-3">
          {/* Campo de búsqueda */}
          <input
            placeholder="🔍 Buscar por nombre, marca, categoría…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-control flex-grow-1"
          />
          {/* Botón para recargar productos */}
          <button
            onClick={() => fetchPage({ reset: true })}
            disabled={loading}
            title="Actualizar desde servidor"
            className="btn btn-secondary"
          >
            🔄 Recargar
          </button>
        </div>
      </div>

      {/* Mostrar mensaje de error si existe */}
      {err && (
        <div className="alert alert-danger mb-3">
          ⚠️ {err}
        </div>
      )}

      {/* Cuadrícula de productos con clases personalizadas */}
      <div className="product-grid">
        {/* Iteramos sobre los productos filtrados y renderizamos una tarjeta para cada uno */}
        {filtered.map((p) => (
          <Card product={p} key={p.id} />
        ))}
      </div>

      {/* Sección de paginación o mensaje de fin de lista */}
      <div className="pagination-controls">
        {hasMore ? (
          // Botón para cargar más productos si hay disponibles
          <button
            onClick={() => fetchPage({ reset: false })}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "⏳ Cargando…" : "📦 Cargar más productos"}
          </button>
        ) : (
          // Mensaje cuando no hay más productos para cargar
          <span className="text-muted">{loading ? "⏳ Cargando…" : "✅ No hay más productos"}</span>
        )}
      </div>
    </div>
  );
}

// Componente Card para mostrar la información de un producto individual
function Card({ product }) {
  // Adaptamos los campos de la API a la estructura esperada por el componente
  const stock = product.stock_quantity ?? product.stock ?? 0;
  // Preferimos nuevo campo 'images' (array). Aceptamos objetos {url,...} o strings con URL.
  let images = [];
  if (Array.isArray(product.images)) {
    images = product.images.map((it) => typeof it === 'string' ? { url: it } : it).filter(Boolean);
  } else if (product.image_url) {
    images = [typeof product.image_url === 'string' ? { url: product.image_url } : product.image_url];
  }
  const category = product.type || product.category || "";
  
  // Renderizamos la tarjeta del producto con estilos personalizados
  return (
    <div className="product-card">
      {/* Slider de imágenes mostrando todas las imágenes del producto */}
      <ProductImagesSlider images={images} alt={product.name} aspect={'4/3'} />
      
      {/* Nombre del producto */}
      <h5>{product.name}</h5>
      
      {/* Marca y categoría */}
      {product.brand && <p className="mb-1"><strong>Marca:</strong> {product.brand}</p>}
      {category && <span className="badge">{category}</span>}
      
      {/* Descripción si existe */}
      {product.description && (
        <p className="mt-2" style={{ fontSize: '0.85rem' }}>
          {product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description}
        </p>
      )}
      
      {/* Indicador de stock */}
      <p className="mb-2">
        <span className={stock > 0 ? 'text-success' : 'text-danger'}>
          {stock > 0 ? `✅ Stock: ${stock}` : "❌ Sin stock"}
        </span>
      </p>
      
      {/* Precio */}
      <div className="price">{CLP.format(Number(product.price || 0))}</div>
    </div>
  );
}
