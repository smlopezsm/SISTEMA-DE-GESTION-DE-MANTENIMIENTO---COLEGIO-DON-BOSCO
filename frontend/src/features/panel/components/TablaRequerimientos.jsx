import { Link } from 'react-router';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa6';
import Badge from '../../../shared/components/Etiqueta';
import '../styles/TablaRequerimientos.css';

const ETIQUETA_ESTADO = {
  pendiente: 'Pendiente',
  'con-tarea': 'Con tarea',
  'en-proceso': 'En proceso',
  demorada: 'Demorada',
  cancelada: 'Cancelada',
  finalizada: 'Finalizada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

function formatearFecha(iso) {
  const d = new Date(iso);
  return (
    <>
      <div>{d.toLocaleDateString('es-AR')}</div>
      <small className="text-muted">
        {d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
      </small>
    </>
  );
}

function TablaRequerimientos({ requerimientos }) {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="mb-0 d-flex align-items-center gap-2">
            <FaClipboardList /> Requerimientos recientes
          </h6>
          <Link
            to="/gestor/requerimientos"
            className="small text-decoration-none d-flex align-items-center gap-1"
          >
            Ver todos <FaArrowRight size={12} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 tabla-requerimientos">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th className="d-none d-md-table-cell">Lugar</th>
                <th className="d-none d-lg-table-cell">Emitido por</th>
                <th className="d-none d-md-table-cell">Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {requerimientos.map((r) => (
                <tr key={r.id}>
                  <td className="fw-medium small">{r.id}</td>
                  <td className="small">{r.titulo}</td>
                  <td className="small d-none d-md-table-cell">{r.lugar}</td>
                  <td className="small d-none d-lg-table-cell">
                    <div>{r.emitidoPor}</div>
                    <small className="text-muted">({r.rolEmisor})</small>
                  </td>
                  <td className="small d-none d-md-table-cell">
                    {formatearFecha(r.fechaEmision)}
                  </td>
                  <td>
                    <Badge estado={r.estado}>
                      {ETIQUETA_ESTADO[r.estado] ?? r.estado}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TablaRequerimientos;