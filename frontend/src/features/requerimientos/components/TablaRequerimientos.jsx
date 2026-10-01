import { Link } from 'react-router';
import { FaWrench, FaEye } from 'react-icons/fa6';
import '../styles/TablaRequerimientos.css';

function TablaRequerimientos({ requerimientos }) {
  if (!Array.isArray(requerimientos) || requerimientos.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center text-muted py-5">
          <p className="mb-1 fw-medium">No hay requerimientos pendientes</p>
          <small>Cuando alguien emita un nuevo requerimiento, aparecerá acá.</small>
        </div>
      </div>
    );
  }

  return (
    <>
      {/*vista compu */}
      <div className="card border-0 shadow-sm d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 tabla-requerimientos">
            <thead>
              <tr>
                <th className="ps-4">ID</th>
                <th>Titulo</th>
                <th>Lugar</th>
                <th>Reportado por</th>
                <th>Fecha y hora</th>
                <th className="text-center pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requerimientos.map((req) => (
                <tr key={req.id}>
                  <td className="ps-4 fw-bold">{req.id}</td>
                  <td>
                    <div className="fw-semibold">{req.titulo}</div>
                    <small className="text-muted d-block text-truncate" style={{ maxWidth: 320 }}>
                      {req.descripcion}
                    </small>
                  </td>
                  <td>{req.lugar}</td>
                  <td>
                    <div>{req.reportadoPor}</div>
                    <small className="text-muted">({req.rolReportante})</small>
                  </td>
                  <td className="text-nowrap">{req.fechaHora}</td>
                  <td className="text-end pe-4">
                    <Link to={`/gestor/tareas/nueva?requerimiento=${req.id}`} className="btn btn-sm btn-primary me-1" >
                      <FaWrench className="me-1" />
                      Iniciar tarea
                    </Link>
                    <Link to={`/gestor/requerimientos/${req.id}`} className="btn btn-sm btn-outline-secondary" title="Ver detalle del requerimiento" >
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* vista celu */}
      <div className="d-md-none">
        {requerimientos.map((req) => (
          <div className="card border-0 shadow-sm mb-2 requerimiento-card" key={req.id}>
            <div className="card-body">
              {/* id */}
              <div className="requerimiento-card__id mb-2">{req.id}</div>

              {/* titulo */}
              <div className="requerimiento-card__titulo mb-1">{req.titulo}</div>

              {/* descripcion */}
              <p className="requerimiento-card__descripcion text-muted mb-2">
                {req.descripcion}
              </p>

              <div className="requerimiento-card__divisor" />

              {/* detalles */}
              <div className="requerimiento-card__detalle">
                <div className="requerimiento-card__campo">
                  <span className="requerimiento-card__label">Lugar</span>
                  <span className="requerimiento-card__valor">{req.lugar}</span>
                </div>

                <div className="requerimiento-card__campo">
                  <span className="requerimiento-card__label">Reportado por</span>
                  <span className="requerimiento-card__valor">
                    {req.reportadoPor}
                    <small className="text-muted d-block">({req.rolReportante})</small>
                  </span>
                </div>

                <div className="requerimiento-card__campo">
                  <span className="requerimiento-card__label">Fecha</span>
                  <span className="requerimiento-card__valor">{req.fechaHora}</span>
                </div>
              </div>

              {/* botones */}
              <div className="d-flex gap-2 mt-3">
                <Link to={`/gestor/tareas/nueva?requerimiento=${req.id}`} className="btn btn-primary btn-sm flex-grow-1" >
                  <FaWrench className="me-1" />
                  Iniciar tarea
                </Link>
                <Link to={`/gestor/requerimientos/${req.id}`} className="btn btn-outline-secondary btn-sm" title="Ver detalle" >
                  <FaEye />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TablaRequerimientos;