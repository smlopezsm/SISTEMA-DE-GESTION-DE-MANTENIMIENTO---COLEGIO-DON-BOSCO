import { Link } from 'react-router';
import { FaBell, FaArrowRight } from 'react-icons/fa6';
import '../styles/PanelNotificaciones.css';

const CLASE_POR_TIPO = {
  'nuevo-requerimiento': 'nuevo-requerimiento',
  'tarea-finalizada': 'tarea-finalizada',
  'tarea-rechazada': 'tarea-rechazada',
  'tarea-demorada': 'tarea-demorada',
};

function PanelNotificaciones({ notificaciones }) {
  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0 d-flex align-items-center gap-2">
            <FaBell /> Notificaciones
            {noLeidas > 0 && (
              <span className="badge rounded-pill bg-danger">{noLeidas}</span>
            )}
          </h6>
          <Link
            to="/gestor/notificaciones"
            className="small text-decoration-none d-flex align-items-center gap-1"
          >
            Ver todas <FaArrowRight size={12} />
          </Link>
        </div>

        {notificaciones.length === 0 ? (
          <p className="text-muted small mb-0 text-center py-3">
            No tenés notificaciones.
          </p>
        ) : (
          <ul className="list-unstyled mb-0">
            {notificaciones.map((n) => (
              <li key={n.id} className="panel-notif__item">
                <span
                  className={`panel-notif__dot panel-notif__dot--${CLASE_POR_TIPO[n.tipo] ?? 'default'}`}
                />
                <div className="flex-grow-1 small">
                  <div className="d-flex justify-content-between">
                    <strong>{n.titulo}</strong>
                    <small className="text-muted">{n.hora}</small>
                  </div>
                  <p className="mb-0 text-muted">{n.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PanelNotificaciones;