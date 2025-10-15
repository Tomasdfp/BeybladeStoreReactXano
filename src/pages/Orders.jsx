// src/pages/Orders.jsx - Página de órdenes del usuario
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { xanoStore } from '../api/client.js';
import UserBar from '../components/UserBar.jsx';

// Formateador de moneda
const CLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await xanoStore.listOrders({ token });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token, loadOrders]);

  if (!token) {
    return (
      <div className="container py-3">
        <UserBar />
        <h1 className="mb-3">Mis Órdenes</h1>
        <div className="alert alert-warning">Debes iniciar sesión para ver tus órdenes.</div>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <UserBar />
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="m-0">Mis Órdenes</h1>
        <button onClick={loadOrders} disabled={loading} className="btn btn-outline-secondary">
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {orders.length === 0 && !loading && (
        <div className="alert alert-info">No tienes órdenes aún.</div>
      )}

      <div className="row g-3">
        {orders.map((order) => (
          <div className="col-12" key={order.id}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="card-title mb-1">Orden #{order.order_number || order.id}</h5>
                    <small className="text-muted">
                      {new Date(order.created_at * 1000).toLocaleDateString('es-CL')}
                    </small>
                  </div>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status || 'Pendiente'}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="row">
                    <div className="col-md-4">
                      <strong>Total:</strong> {CLP.format(order.total_amount || 0)}
                    </div>
                    <div className="col-md-4">
                      <strong>Pago:</strong> {order.payment_method || 'N/A'}
                    </div>
                    <div className="col-md-4">
                      <strong>Estado pago:</strong>{' '}
                      <span className={order.payment_status === 'paid' ? 'text-success' : 'text-warning'}>
                        {order.payment_status || 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  const badges = {
    pending: 'bg-warning',
    processing: 'bg-info',
    shipped: 'bg-primary',
    delivered: 'bg-success',
    cancelled: 'bg-danger',
  };
  return badges[status] || 'bg-secondary';
}
