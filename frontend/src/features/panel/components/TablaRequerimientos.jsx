import { Link } from 'react-router';
import { FaArrowRight, FaFileCirclePlus } from 'react-icons/fa6';
import '../styles/TablaRequerimientos.css';


//funcion de js que devuelve jsx
function formatearFecha(fechaHora) {
  if (!fechaHora) return '';
  const [fecha, hora] = fechaHora.split(' '); //te da la fecha y hora en un arreglo
  return (
    <>
      <div>{fecha}</div>
      <small className="text-muted">{hora}</small>
    </>
  );
}

function TablaRequerimientos({ requerimientos }) {
  
  if (!Array.isArray(requerimientos) || requerimientos.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center text-muted py-5">
          <p className="mb-1 fw-medium">No hay requerimientos recientes</p>
          <small>Cuando se emita un nuevo requerimiento se mostrara aqui</small>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        {/* Encabezado */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0 d-flex align-items-center gap-3 tabla-titulo">
            <FaFileCirclePlus size={25} /> Requerimientos recientes
          </h5>
          <Link
            to="/gestor/requerimientos"
            className="small text-decoration-none d-flex align-items-center gap-1 link-ver-todos"
          >
            Ver todos <FaArrowRight size={12} />
          </Link>
        </div>

        {/* vista para compu*/}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0 tabla-requerimientos">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Titulo</th>
                <th>Lugar</th>
                <th>Reportado por</th>
                <th>Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              {requerimientos.map((r) => (
                <tr key={r.id}>
                  <td className="fw-medium small">{r.id}</td>
                  <td className="small">{r.titulo}</td>
                  <td className="small">{r.lugar}</td>
                  <td className="small">
                    <div>{r.reportadoPor}</div>
                    <small className="text-muted">({r.rolReportante})</small>
                  </td>
                  <td className="small">{formatearFecha(r.fechaHora)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* vista para celular con cards */}
        <div className="d-md-none">
          {requerimientos.map((r) => (
            <div className="requerimiento-panel-card" key={r.id}>
              {/* ID */}
              <div className="requerimiento-panel-card__id mb-1">{r.id}</div>

              {/* Titulo */}
              <div className="requerimiento-panel-card__titulo mb-2">
                {r.titulo}
              </div>

              {/* Detalles */}
              <div className="requerimiento-panel-card__detalle">
                <div className="requerimiento-panel-card__campo">
                  <span className="requerimiento-panel-card__label">Lugar</span>
                  <span className="requerimiento-panel-card__valor">{r.lugar}</span>
                </div>
                <div className="requerimiento-panel-card__campo">
                  <span className="requerimiento-panel-card__label">Reportado</span>
                  <span className="requerimiento-panel-card__valor">
                    {r.reportadoPor}
                    <small className="text-muted d-block">
                      ({r.rolReportante})
                    </small>
                  </span>
                </div>
                <div className="requerimiento-panel-card__campo">
                  <span className="requerimiento-panel-card__label">Fecha</span>
                  <span className="requerimiento-panel-card__valor">
                    {r.fechaHora}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TablaRequerimientos;