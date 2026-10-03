import { Link } from 'react-router';
import { FaListCheck, FaArrowRight } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import '../styles/TareasEnCurso.css';

const ESTADOS_EN_CURSO = ['en-proceso', 'demorada', 'pendiente'];
const TEXTO_ESTADO_TAREA = { pendiente: 'Pendiente', 'en-proceso': 'En proceso', demorada: 'Demorada', cancelada: 'Cancelada', finalizada: 'Finalizada', aprobada: 'Aprobada', rechazada: 'Rechazada', };
const TEXTO_PRIORIDAD = { alta: 'Alta', media: 'Media', baja: 'Baja', };

function TareasEnCurso({ tareas }) {

  //devuelve un arreglo con las tareas cuyo estado este en el arreglo de estados en curso
  const enCurso = tareas.filter((t) => ESTADOS_EN_CURSO.includes(t.estado));

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        {/* Encabezado */}
        <div className="titulo-enca d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FaListCheck size={22} /> Tareas en curso
          </h5>
          <Link
            to="/gestor/tareas"
            className="small text-decoration-none d-flex align-items-center gap-1 link-ver-todos"
          >
            Ver todas <FaArrowRight size={12} />
          </Link>
        </div>

        {enCurso.length === 0 ? ( //nos fijamos si el arreglo esta vacio 
          <p className="text-muted small text-center py-4 mb-0">
            No hay tareas en curso
          </p>
        ) : (
          <>
            {/* vista para compu*/}
            <div className="table-responsive d-none d-md-block">
              <table className="table table-sm table-hover align-middle mb-0 tareas-en-curso">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Tarea</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fecha de creación</th>
                  </tr>
                </thead>
                <tbody>
                  {enCurso.map((t) => (
                    <tr key={t.id}>
                      <td className="small fw-medium">{t.id}</td>
                      <td className="small">{t.titulo}</td>
                      <td><Etiqueta estado={t.prioridad}>{TEXTO_PRIORIDAD[t.prioridad]}</Etiqueta></td>
                      <td><Etiqueta estado={t.estado}>{TEXTO_ESTADO_TAREA[t.estado]}</Etiqueta></td>
                      <td className="small">{t.fechaCreacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* vista para celular*/}
            <div className="d-md-none">
              {enCurso.map((t) => (
                <div className="tarea-panel-card" key={t.id}>
                  {/* Header: ID + Estado */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="tarea-panel-card__id">{t.id}</span>
                    <Etiqueta estado={t.estado}>{TEXTO_ESTADO_TAREA[t.estado]}</Etiqueta>
                  </div>

                  {/* Título */}
                  <div className="tarea-panel-card__titulo mb-2">
                    {t.titulo}
                  </div>

                  {/* Detalles */}
                  <div className="tarea-panel-card__detalle">
                    <div className="tarea-panel-card__campo">
                      <span className="tarea-panel-card__label">Prioridad</span>
                      <span className="tarea-panel-card__valor">
                        <Etiqueta estado={t.prioridad}>{TEXTO_PRIORIDAD[t.prioridad]}</Etiqueta>
                      </span>
                    </div>
                    <div className="tarea-panel-card__campo">
                      <span className="tarea-panel-card__label">Creada</span>
                      <span className="tarea-panel-card__valor">
                        {t.fechaCreacion}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TareasEnCurso;