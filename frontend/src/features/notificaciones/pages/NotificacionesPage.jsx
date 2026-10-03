import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { FaBell } from 'react-icons/fa6';
import '../styles/NotificacionesPage.css';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';
import { obtenerNotificaciones } from '../services/notificacionesService';
import TabsNotificaciones from '../components/TabsNotificaciones';
import ItemNotificacion from '../../../shared/components/ItemNotificacion';

function NotificacionesPage() {
  const usuario = useOutletContext();
  const rol = usuario?.rol ?? 'directivo';

  // notificaciones filtradas por rol
  const visibles = useMemo(() => obtenerNotificaciones(rol), [rol]);

  const [tabActivo, setTabActivo] = useState('todas');

  // filtrado por tab
  const notificacionesFiltradas = useMemo(() => {
    if (tabActivo === 'todas') return visibles;
    return visibles.filter((n) => n.tipo === tabActivo);
  }, [visibles, tabActivo]);

  // contadores por tab
  const contadores = useMemo(() => {
    const cuenta = { todas: visibles.length };
    visibles.forEach((n) => {
      cuenta[n.tipo] = (cuenta[n.tipo] ?? 0) + 1;
    });
    return cuenta;
  }, [visibles]);

  return (
    <div className="notificaciones-page">
      {/* encabezado */}
      <EncabezadoPagina
        icono={FaBell}
        titulo="Notificaciones"
        subtitulo="Notificaciones recientes"
        tono="secundario"
      />

      {/* tabs */}
      <div className="mb-3">
        <TabsNotificaciones rol={rol} activo={tabActivo} contadores={contadores} onCambiar={setTabActivo} />
      </div>

      {/* lista */}
      <div className="card border-0 shadow-sm">
        {notificacionesFiltradas.length === 0 ? (
          <div className="card-body text-center text-muted py-5">
            <p className="mb-1 fw-medium">No hay notificaciones para mostrar</p>
            <small>Cuando llegue aparecerán aquí</small>
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