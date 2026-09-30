import { useState, useMemo } from 'react';
import { FaBell } from 'react-icons/fa6';
import '../styles/NotificacionesPage.css';

import { obtenerNotificaciones } from '../services/notificacionesService';
import TabsNotificaciones from '../components/TabsNotificaciones';
import ItemNotificacion from '../components/ItemNotificacion';

const TIPOS_POR_TAB = { todas: null, requerimiento: ['requerimiento'], aprobacion: ['aprobacion'], rechazo: ['rechazo'], };

function NotificacionesPage() {
  const todasLasNotificaciones = obtenerNotificaciones();

  const [tabActivo, setTabActivo] = useState('todas');

  // noti filtradas
  const notificacionesFiltradas = useMemo(() => {
    const tipos = TIPOS_POR_TAB[tabActivo];
    if (!tipos) return todasLasNotificaciones;
    return todasLasNotificaciones.filter((n) => tipos.includes(n.tipo));
  }, [todasLasNotificaciones, tabActivo]);

  // contenedores
  const contadores = useMemo(() => {
    const cuenta = { todas: todasLasNotificaciones.length, requerimiento: 0, tarea: 0, aprobacion: 0, rechazo: 0, };

    todasLasNotificaciones.forEach((n) => {
      if (cuenta[n.tipo] !== undefined) cuenta[n.tipo]++;
    });

    return cuenta;
  }, [todasLasNotificaciones]);

  return (
    <div className="notificaciones-page">
      {/* Encabezado */}
      <div className="d-flex gap-3 mb-4">
        <div className="icono-titulo">
          <FaBell size={22} />
        </div>
        <div>
          <h1 className="h3 mb-1">Notificaciones</h1>
          <p className="text-muted mb-0">
            Notificaciones recientes
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="mb-3">
        <TabsNotificaciones
          activo={tabActivo}
          contadores={contadores}
          onCambiar={setTabActivo}
        />
      </div>

      {/* lista */}
      <div className="card border-0 shadow-sm">
        {notificacionesFiltradas.length === 0 ? (
          <div className="card-body text-center text-muted py-5">
            <p className="mb-1 fw-medium">No hay notificaciones para mostrar</p>
            <small>Cuando llegue apareceran aqui</small>
          </div>
        ) : (
          notificacionesFiltradas.map((n) => (
            <ItemNotificacion key={n.id} notificacion={n} />
          ))
        )}
      </div>
    </div>
  );
}

export default NotificacionesPage;