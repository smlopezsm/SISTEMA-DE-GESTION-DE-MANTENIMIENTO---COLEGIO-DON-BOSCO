import { Link } from 'react-router';
import { FaPenToSquare, FaEye } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import '../styles/TablaTareas.css';

function TablaTareas({ tareas, usuario }) {
  if (!Array.isArray(tareas) || tareas.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center text-muted py-5">
          <p className="mb-1 fw-medium">No hay tareas</p>
          <small>Cuando inicies una tarea desde un requerimiento, se vera aqui</small>
        </div>
      </div>
    );
  }

  const esJefe = usuario?.rol === 'jefeMantenimiento';

  return (
    <>
      {/*vista compu */}
      <div className="card border-0 shadow-sm d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 tabla-tareas">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Requerimiento asociado</th>
                <th>Título</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Responsable</th>
                <th>Fecha de creación</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((t) => (
                <tr key={t.id}>
                  <td className="ps-4 fw-bold">{t.id}</td>
                  <td>
                    <div className="fw-semibold small">{t.requerimientoId}</div>
                    <small className="text-muted">{t.requerimientoTitulo}</small>
                  </td>
                  <td className="small">{t.titulo}</td>
                  <td><Etiqueta estado={t.prioridad} /></td>
                  <td><Etiqueta estado={t.estado} /></td>
                  <td className="small">
                    {t.responsable ? (
                      <>
                        <div>{t.responsable.nombre}</div>
                        <small className="text-muted">({t.responsable.tipo})</small>
                      </>
                    ) : (
                      <span className="text-muted">–</span>
                    )}
                  </td>
                  <td className="small text-nowrap">{t.fechaCreacion}</td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-1">
                      {/* ver detalle para los dos roles */}
                      <Link to={`/gestor/tareas/${t.id}`} className="btn btn-sm btn-outline-secondary" title="Ver detalle de la tarea" >
                        <FaEye />
                      </Link>

                      {/* editar solo jefe */}
                      {esJefe && (
                        <Link to={`/gestor/tareas/${t.id}/editar`} className="btn btn-sm btn-outline-primary" >
                          <FaPenToSquare className="me-1" />
                          Editar
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* para celu */}
      <div className="d-md-none">
        {tareas.map((t) => (
          <div className="card border-0 shadow-sm mb-2 tarea-card" key={t.id}>
            <div className="card-body">
              {/* heder */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="tarea-card__id">{t.id}</span>
                <Etiqueta estado={t.estado} />
              </div>

              {/* titulo */}
              <div className="tarea-card__titulo mb-1">{t.titulo}</div>

              {/* requerimiento */}
              <small className="text-muted d-block mb-2">
                {t.requerimientoId} · {t.requerimientoTitulo}
              </small>

              <div className="tarea-card__divisor" />

              {/* detalles */}
              <div className="tarea-card__detalle">
                <div className="tarea-card__campo">
                  <span className="tarea-card__label">Prioridad</span>
                  <span className="tarea-card__valor">
                    <Etiqueta estado={t.prioridad} />
                  </span>
                </div>

                <div className="tarea-card__campo">
                  <span className="tarea-card__label">Responsable</span>
                  <span className="tarea-card__valor">
                    {t.responsable?.nombre ?? '–'}
                    {t.responsable && (
                      <small className="text-muted d-block">
                        ({t.responsable.tipo})
                      </small>
                    )}
                  </span>
                </div>

                <div className="tarea-card__campo">
                  <span className="tarea-card__label">Fecha</span>
                  <span className="tarea-card__valor">{t.fechaCreacion}</span>
                </div>
              </div>

              {/* botones */}
              <div className="d-flex gap-2 mt-3">
                {/* ver detalle para todoss */}
                <Link to={`/gestor/tareas/${t.id}`} className="btn btn-outline-secondary btn-sm flex-grow-1" >
                  <FaEye className="me-1" />
                  Ver detalle
                </Link>

                {/*editar solo jefe */}
                {esJefe && (
                  <Link to={`/gestor/tareas/${t.id}/editar`} className="btn btn-primary btn-sm flex-grow-1" >
                    <FaPenToSquare className="me-1" />
                    Editar
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TablaTareas;