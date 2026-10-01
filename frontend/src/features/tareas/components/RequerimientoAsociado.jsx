import { FaClipboardList, FaCalendarDays, FaLocationDot, } from 'react-icons/fa6';
import '../styles/RequerimientoAsociado.css';

function RequerimientoAsociado({ tarea }) {

  return (
    <div className="card border-0 shadow-sm requerimiento-asociado">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaClipboardList /> Requerimiento asociado
        </h6>

        {/* id del requerimiento */}
        <div className="mb-3">
          <small className="text-muted d-block mb-1">N° de requerimiento</small>
          <span className="requerimiento-asociado__id">
            {tarea.requerimientoId}
          </span>
        </div>

        {/* titulo */}
        <h5 className="mb-2 requerimiento-asociado__titulo">
          {tarea.requerimientoTitulo}
        </h5>

        {/* descripcion */}
        <p className="text-muted mb-4 requerimiento-asociado__descripcion">
          {tarea.descripcion}
        </p>

        {/* fecha y sector */}
        <div className="row g-3">
          {/* fecha de emision */}
          <div className="col-12 col-sm-6">
            <div className="requerimiento-asociado__meta">
              <span className="requerimiento-asociado__meta-icono">
                <FaCalendarDays size={16} />
              </span>
              <div>
                <small className="text-muted d-block">Fecha de emision</small>
                <span className="fw-medium">{tarea.fechaCreacion}</span>
              </div>
            </div>
          </div>

          {/* sector */}
          <div className="col-12 col-sm-6">
            <div className="requerimiento-asociado__meta">
              <span className="requerimiento-asociado__meta-icono">
                <FaLocationDot size={16} />
              </span>
              <div>
                <small className="text-muted d-block">Sector</small>
                <span className="fw-medium">{tarea.lugar}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequerimientoAsociado;