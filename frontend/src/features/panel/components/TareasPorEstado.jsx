import { FaClock } from 'react-icons/fa6';
import Dona from '../../../shared/components/Dona';
import { colorDeEstado } from '../../../shared/utils/colores';
import '../styles/TareasPorEstado.css';

function TareasPorEstado({ datos, total }) {
  if (!datos?.length || total === 0) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body d-flex flex-column">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <FaClock /> Tareas por estado
          </h6>
          <p className="text-muted small text-center my-auto">
            No hay tareas registradas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaClock /> Tareas por estado
        </h6>

        <div className="row align-items-center g-3">
          <div className="col-12 col-md-5 text-center">
            <Dona datos={datos} total={total} tamano={160} />
          </div>
          <div className="col-12 col-md-7">
            <ul className="list-unstyled mb-0 small">
              {datos.map((d) => (
                <li
                  key={d.estado}
                  className="tareas-por-estado__item d-flex align-items-center justify-content-between"
                >
                  <span className="d-flex align-items-center gap-2">
                    <span
                      className="tareas-por-estado__punto"
                      style={{ backgroundColor: colorDeEstado(d.clave) }}
                    />
                    {d.estado}
                  </span>
                  <span className="text-muted">{d.valor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TareasPorEstado;