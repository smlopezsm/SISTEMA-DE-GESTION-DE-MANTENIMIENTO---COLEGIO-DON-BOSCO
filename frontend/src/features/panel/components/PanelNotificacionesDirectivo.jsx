// src/features/panel/components/PanelNotificacionesDirectivo.jsx
import { Link } from 'react-router';
import { FaBell } from 'react-icons/fa6';
import SeccionCard from '../../../shared/components/SeccionCard';
import ItemNotificacion from '../../../shared/components/ItemNotificacion';

function PanelNotificacionesDirectivo({ notificaciones = [], maximo = 4 }) {
  // Solo finalizadas y canceladas (lo que le corresponde al Directivo)
  const recientes = notificaciones
    .filter((n) => ['tarea-finalizada', 'tarea-cancelada'].includes(n.tipo))
    .sort((a, b) => b.hora.localeCompare(a.hora))
    .slice(0, maximo);

  return (
    <SeccionCard
      icono={FaBell}
      titulo="Notificaciones"
      accion={
        <Link to="/gestor/notificaciones" className="small">
          Ver todas
        </Link>
      }
    >
      {recientes.length === 0 ? (
        <p className="text-muted small text-center py-3 mb-0">
          No tenés notificaciones nuevas
        </p>
      ) : (
        <div className="lista-notificaciones-mini">
          {recientes.map((n) => (
            <ItemNotificacion key={n.id} notificacion={n} />
          ))}
        </div>
      )}
    </SeccionCard>
  );
}

export default PanelNotificacionesDirectivo;