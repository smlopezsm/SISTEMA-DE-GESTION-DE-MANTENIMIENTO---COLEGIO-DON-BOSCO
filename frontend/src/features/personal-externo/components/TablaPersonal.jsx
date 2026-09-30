import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6';
import '../styles/TablaPersonal.css';
import { Link } from "react-router";

function TablaPersonal({ personal, onEliminar }) {
  if (!Array.isArray(personal) || personal.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center text-muted py-5">
          No se encontró personal con estos filtros.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* para compu */}
      <div className="card border-0 shadow-sm d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 tabla-personal">
            <thead>
              <tr>
                <th className="ps-4">Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personal.map((p) => (
                <tr key={p.id}>
                  <td className="ps-4 fw-medium">{p.nombre ?? '—'}</td>
                  <td>{p.apellido ?? '—'}</td>
                  <td className="text-nowrap">{p.telefono ?? '—'}</td>
                  <td>{p.especialidad ?? '—'}</td>
                  <td>
                    <span
                      className={`badge-personal badge-personal--${p.activo ? 'activo' : 'inactivo'}`}
                    >
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <Link to={`/gestor/personal-externo/${p.id}/editar`} className="btn btn-sm btn-outline-primary me-1" > <FaPenToSquare className="me-1" /> 
                    Editar </Link>
                    <button type="button" className="btn btn-sm btn-outline-secondary border-0" onClick={() => onEliminar(p)} title="Eliminar" >
                      <FaTrashCan />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* para celular */}
      <div className="d-md-none">
        {personal.map((p) => (
          <div className="card border-0 shadow-sm mb-2 personal-card" key={p.id}>
            <div className="card-body">
              {/* header */}
              <div className="d-flex align-items-center gap-2 mb-3">
                 <div>
                  <div className="personal-card__nombre">
                    {p.nombre} {p.apellido}
                  </div>
                  <small className="text-muted">{p.especialidad}</small>
                </div>
                <span
                  className={`badge-personal badge-personal--${p.activo ? 'activo' : 'inactivo'}`}
                >
                  {p.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              {/* divisor */}
              <div className="personal-card__divisor" />

              {/* detalles */}
              <div className="personal-card__detalle">
                <div className="personal-card__campo">
                  <span className="personal-card__label">Teléfono</span>
                  <span className="personal-card__valor">{p.telefono ?? '—'}</span>
                </div>
                <div className="personal-card__campo">
                  <span className="personal-card__label">Especialidad</span>
                  <span className="personal-card__valor">{p.especialidad ?? '—'}</span>
                </div>
              </div>

              {/* botones */}
              <div className="d-flex gap-2 mt-3">
                <Link to={`/gestor/personal-externo/${p.id}/editar`} className="btn btn-primary btn-sm flex-grow-1" >
                  <FaPenToSquare className="me-1" />
                  Editar
                </Link>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onEliminar(p)} title="Eliminar" >
                  <FaTrashCan />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TablaPersonal;