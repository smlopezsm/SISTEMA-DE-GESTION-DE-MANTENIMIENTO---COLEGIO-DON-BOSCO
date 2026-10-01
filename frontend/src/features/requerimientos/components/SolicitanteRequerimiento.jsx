import { FaUser } from 'react-icons/fa6';
import '../styles/SolicitanteRequerimiento.css';

function iniciales(nombre) {
  if (!nombre) return '?';
  const partes = nombre.trim().split(' ');
  const primera = partes[0]?.[0] ?? '';
  const segunda = partes[1]?.[0] ?? '';
  return `${primera}${segunda}`.toUpperCase() || '?';
}

function SolicitanteRequerimiento({ requerimiento }) {
  return (
    <div className="card border-0 shadow-sm h-100 solicitante-requerimiento">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaUser /> Solicitante
        </h6>

        <div className="d-flex align-items-center gap-3">
          {/* iniciales */}
          <div className="solicitante-requerimiento__avatar">
            {iniciales(requerimiento.reportadoPor)}
          </div>

          <div className="min-w-0">
            <div className="solicitante-requerimiento__nombre">
              {requerimiento.reportadoPor}
            </div>
            <small className="text-muted d-block">
              {requerimiento.rolReportante}
            </small>
          </div>
        </div>

        {/* rol */}
        <div className="mt-3">
          <span className="solicitante-requerimiento__badge-rol">
            {requerimiento.rolReportante}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SolicitanteRequerimiento;