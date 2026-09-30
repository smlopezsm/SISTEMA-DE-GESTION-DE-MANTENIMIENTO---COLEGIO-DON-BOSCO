import { Link } from 'react-router';
import { FaCalendarDays, FaArrowRight } from 'react-icons/fa6';
import Badge from '../../../shared/components/Etiqueta';
import '../styles/ProximasTareas.css';

const ETIQUETA_PRIORIDAD = { alta: 'Alta', media: 'Media', baja: 'Baja' };

function formatearFecha(fecha) {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR');
}

function ProximasTareas({ tareas }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0 d-flex align-items-center gap-2">
            <FaCalendarDays /> Próximas tareas
          </h6>
          <Link
            to="/gestor/tareas"
            className="small text-decoration-none d-flex align-items-center gap-1"
          >
            Ver todas <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0 proximas-tareas">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Tarea</th>
                <th>Prioridad</th>
                <th className="d-none d-sm-table-cell">Fecha prevista</th>
              </tr>
            </thead>
            <tbody>
              {tareas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted small py-3">
                    No hay tareas próximas.
                  </td>
                </tr>
              ) : (
                tareas.map((t) => (
                  <tr key={t.id}>
                    <td className="small fw-medium">{t.id}</td>
                    <td className="small">{t.titulo}</td>
                    <td>
                      <Badge estado={t.prioridad}>
                        {ETIQUETA_PRIORIDAD[t.prioridad] ?? t.prioridad}
                      </Badge>
                    </td>
                    <td className="small d-none d-sm-table-cell">
                      {formatearFecha(t.fechaPrevista)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProximasTareas;