import { Link, useNavigate } from 'react-router';
import { FaFileCirclePlus, FaArrowRight, FaEye, FaTrash } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import '../styles/TablaRequerimientos.css';

function formatearFecha(fechaHora) {
  if (!fechaHora) return '';
  const [fecha, hora] = fechaHora.split(' ');
  return (
    <>
      <div>{fecha}</div>
      <small className="text-muted">{hora}</small>
    </>
  );
}

function TablaRequerimientos({ requerimientos, onEliminar }) {
  const navigate = useNavigate();

  if (!Array.isArray(requerimientos) || requerimientos.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center text-muted py-5">
          <p className="mb-1 fw-medium">No hay requerimientos recientes</p>
          <small>Cuando se emita un nuevo requerimiento se mostrará aquí</small>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm d-none d-md-block">
        {/* Vista para compu */}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0 tabla-requerimientos">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Categoría</th>
                <th>Lugar</th>
                <th>Reportado por</th>
                <th>Fecha y hora</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requerimientos.map((r) => (
                <tr key={r.id}>
                  <td className="fw-bold" style={{ color: 'var(--color-principal)' }}>
                    REQ-{String(r.id).padStart(4, '0')}
                  </td>
                  <td className="small">{r.categoria || 'Sin categoría'}</td>
                  <td className="small">{r.lugar}</td>
                  <td className="small">
                    <div>{r.reportadoPor}</div>
                    <small className="text-muted">({r.rolReportante})</small>
                  </td>
                  <td className="small">{formatearFecha(r.fechaHora)}</td>
                  <td><Etiqueta estado={r.estado} /></td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => navigate(`/gestor/requerimientos/${r.id}`)}
                      title="Ver detalle"
                    >
                      <FaEye />
                    </button>
                    {onEliminar && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onEliminar(r.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista para celular con cards */}
        <div className="d-md-none">
          {requerimientos.map((r) => (
            <div className="requerimiento-panel-card" key={r.id}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold" style={{ color: 'var(--color-principal)' }}>
                  REQ-{String(r.id).padStart(4, '0')}
                </span>
                <span className={`badge rounded-pill ${
                  r.estado === 'pendiente' ? 'bg-warning-subtle text-warning-emphasis' :
                  r.estado === 'en-proceso' ? 'bg-info-subtle text-info-emphasis' :
                  r.estado === 'finalizada' ? 'bg-success-subtle text-success-emphasis' :
                  'bg-secondary-subtle text-secondary-emphasis'
                }`}>
                  {r.estado}
                </span>
              </div>

              <div className="requerimiento-panel-card__titulo mb-2">
                {r.categoria || 'Sin categoría'}
              </div>

              <div className="requerimiento-panel-card__detalle">
                <div className="requerimiento-panel-card__campo">
                  <span className="requerimiento-panel-card__label">Lugar</span>
                  <span className="requerimiento-panel-card__valor">{r.lugar}</span>
                </div>
                <div className="requerimiento-panel-card__campo">
                  <span className="requerimiento-panel-card__label">Reportado</span>
                  <span className="requerimiento-panel-card__valor">
                    {r.reportadoPor}
                    <small className="text-muted d-block">({r.rolReportante})</small>
                  </span>
                </div>
                <div className="requerimiento-panel-card__campo">
                  <span className="requerimiento-panel-card__label">Fecha</span>
                  <span className="requerimiento-panel-card__valor">{r.fechaHora}</span>
                </div>
                <div className="mt-2 text-end d-flex justify-content-end gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate(`/gestor/requerimientos/${r.id}`)}>
                    <FaEye />
                  </button>
                  {onEliminar && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onEliminar(r.id)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}

export default TablaRequerimientos;