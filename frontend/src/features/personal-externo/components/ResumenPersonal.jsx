import { FaCalendarDays } from 'react-icons/fa6';
import '../styles/ResumenPersonal.css';

function iniciales(nombre, apellido) {
  const n = nombre?.[0] ?? '';
  const a = apellido?.[0] ?? '';
  return `${n}${a}`.toUpperCase() || '??';
}

function tiempoDesde(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  if (isNaN(d)) return '';
  const ahora = new Date();
  const meses =
    (ahora.getFullYear() - d.getFullYear()) * 12 +
    (ahora.getMonth() - d.getMonth());
  if (meses < 12) return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const años = Math.floor(meses / 12);
  return `Hace ${años} ${años === 1 ? 'año' : 'años'}`;
}

function ResumenPersonal({ persona }) {
  if (!persona) return null;

  return (
    <div className="card border-0 shadow-sm mb-4 resumen-personal-card">
      <div className="card-body text-center">
        <div className="resumen-personal-card__avatar">
          {iniciales(persona.nombre, persona.apellido)}
        </div>
        <h5 className="mb-1">
          {persona.nombre} {persona.apellido}
        </h5>
        <div className="text-muted small mb-3">{persona.especialidad}</div>

        <span
          className={`badge-personal-resumen badge-personal-resumen--${persona.activo ? 'activo' : 'inactivo'}`}
        >
          {persona.activo ? 'Activo' : 'Inactivo'}
        </span>

        {persona.fechaAlta && (
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex align-items-center justify-content-center gap-2 text-muted small mb-1">
              <FaCalendarDays size={12} />
              Fecha de alta
            </div>
            <div className="fw-semibold small">{persona.fechaAlta}</div>
            <small className="text-muted">{tiempoDesde(persona.fechaAlta)}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumenPersonal;