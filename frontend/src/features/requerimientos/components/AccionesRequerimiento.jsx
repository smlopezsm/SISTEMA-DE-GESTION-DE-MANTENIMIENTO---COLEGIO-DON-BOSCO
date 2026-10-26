import { Link } from 'react-router';
import { FaGear, FaWrench, FaCircleInfo } from 'react-icons/fa6';
import '../styles/AccionesRequerimiento.css';

function AccionesRequerimiento({ requerimiento }) {
  return (
    <div className="card border-0 shadow-sm h-100 acciones-requerimiento">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaGear /> Acciones
        </h6>

        {/*boton */}
        <Link
          to={`/gestor/tareas/nueva?requerimiento=${requerimiento.id}`}
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FaWrench />
          Asignar a tarea
        </Link>

        {/* mensaje */}
        <div className="alert alert-info mt-3 mb-0 small d-flex gap-2">
          <FaCircleInfo className="flex-shrink-0" />
          <span>
            Al asignar este requerimiento a una tarea, se generara una nueva
            tarea y el requerimiento dejará de aparecer en el listado
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccionesRequerimiento;