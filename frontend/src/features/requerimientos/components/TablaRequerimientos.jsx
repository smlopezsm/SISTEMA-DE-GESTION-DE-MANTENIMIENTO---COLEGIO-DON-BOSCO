import { Link } from 'react-router';
import { FaEye, FaTrash } from 'react-icons/fa6';
import '../styles/TablaRequerimientos.css'; // Por si tenés estilos ahí

function TablaRequerimientos({ requerimientos, onEliminar }) {
  const formatearFecha = (fechaHora) => {
    if (!fechaHora) return '';
    return fechaHora.split(' ')[0]; // Solo la fecha
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Título / Categoría</th>
            <th className="d-none d-md-table-cell">Lugar</th>
            <th className="d-none d-lg-table-cell">Reportado por</th>
            <th className="d-none d-md-table-cell">Fecha</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requerimientos.map((req) => (
            <tr key={req.id}>
              <td className="fw-medium">REQ-{String(req.id).padStart(4, '0')}</td>
              <td>
                <div>{req.titulo}</div>
                {req.categoria && <small className="text-muted">{req.categoria}</small>}
              </td>
              <td className="d-none d-md-table-cell">{req.lugar}</td>
              <td className="d-none d-lg-table-cell">
                <div>{req.reportadoPor}</div>
                <small className="text-muted">{req.rolReportante}</small>
              </td>
              <td className="d-none d-md-table-cell">{formatearFecha(req.fechaHora)}</td>
              <td>
                <span className={`badge ${
                  req.estado === 'pendiente' ? 'bg-warning text-dark' :
                  req.estado === 'en-proceso' ? 'bg-info text-dark' :
                  req.estado === 'finalizada' ? 'bg-success' :
                  'bg-secondary'
                }`}>
                  {req.estado}
                </span>
              </td>
              <td className="text-end">
                <Link
                  to={`/gestor/requerimientos/${req.id}`}
                  className="btn btn-sm btn-outline-primary me-2"
                  title="Ver detalle"
                >
                  <FaEye /> <span className="d-none d-sm-inline">Ver</span>
                </Link>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onEliminar(req.id)}
                  title="Eliminar"
                >
                  <FaTrash /> <span className="d-none d-sm-inline">Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaRequerimientos;