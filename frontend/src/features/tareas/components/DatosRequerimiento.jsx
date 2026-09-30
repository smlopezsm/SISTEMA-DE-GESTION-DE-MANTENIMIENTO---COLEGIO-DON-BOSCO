import { FaClipboardList, FaLocationDot, FaUser, FaCalendarDays, } from 'react-icons/fa6';
import '../styles/DatosRequerimiento.css';

function DatosRequerimiento({ requerimiento }) {
  if (!requerimiento) return null;

  return (
    <div className="card border-0 shadow-sm mb-4 datos-requerimiento">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaClipboardList /> Requerimiento asociado
        </h6>

        {/* titulo */}
        <div className="mb-3">
          <small className="text-muted d-block mb-1">Título</small>
          <div className="fw-semibold">{requerimiento.titulo}</div>
        </div>

        {/* descripcion */}
        <div className="mb-3">
          <small className="text-muted d-block mb-1">Descripción</small>
          <p className="mb-0 text-muted">{requerimiento.descripcion}</p>
        </div>

        {/* lugar, quien reporto y fecha*/}
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <small className="text-muted d-block mb-1">Lugar</small>
            <div className="d-flex align-items-center gap-2">
              <FaLocationDot className="text-muted small" />
              <span>{requerimiento.lugar}</span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <small className="text-muted d-block mb-1">Reportado por</small>
            <div className="d-flex align-items-center gap-2">
              <FaUser className="text-muted small" />
              <div>
                <div>{requerimiento.reportadoPor}</div>
                <small className="text-muted">
                  ({requerimiento.rolReportante})
                </small>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <small className="text-muted d-block mb-1">Fecha y hora</small>
            <div className="d-flex align-items-center gap-2">
              <FaCalendarDays className="text-muted small" />
              <span>{requerimiento.fechaHora}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatosRequerimiento;