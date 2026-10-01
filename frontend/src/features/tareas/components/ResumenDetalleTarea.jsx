import { FaUser, FaCircleCheck, FaCartShopping, } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import '../styles/ResumenDetalleTarea.css';

function ResumenDetalleTarea({ tarea, tieneCompra }) {

  const tieneFechaFinalizacion = Boolean(tarea.fechaFinalizacion);

  return (
    <div className="card border-0 shadow-sm mb-4 resumen-detalle-tarea">
      <div className="card-body">
        <div className="row g-3 align-items-stretch">
          {/* id de tarea */}
          <div className="col-6 col-md-2">
            <small className="text-muted d-block">Tarea N°</small>
            <div className="resumen-detalle-tarea__id">{tarea.id}</div>
          </div>

          {/* prioridad */}
          <div className="col-6 col-md-2">
            <small className="text-muted d-block">Prioridad</small>
            <Etiqueta estado={tarea.prioridad} />
          </div>

          {/* estado */}
          <div className="col-6 col-md-2">
            <small className="text-muted d-block">Estado</small>
            <Etiqueta estado={tarea.estado} />
          </div>

          {/* asignacion */}
          <div className="col-6 col-md-2">
            <small className="text-muted d-block">Asignada a</small>
            <div className="d-flex align-items-center gap-2 resumen-detalle-tarea__valor">
              <FaUser className="text-muted flex-shrink-0" size={14} />
              <div className="min-w-0">
                <div className="text-capitalize">
                  {tarea.responsable?.tipo ?? 'Jefe'}
                </div>
                <small className="text-muted d-block text-truncate">
                  {tarea.responsable?.nombre ?? 'Jefe de Mantenimiento'}
                </small>
              </div>
            </div>
          </div>

          {/* compra */}
          <div className="col-6 col-md-2">
            <small className="text-muted d-block">Realizo compra</small>
            <span className={`badge-compra badge-compra--${tieneCompra ? 'si' : 'no'}`} >
              {tieneCompra ? 'Sí' : 'No'}
            </span>
          </div>

          {/* fecha de finalizacion o de creacion */}
          <div className="col-6 col-md-2">
            {tieneFechaFinalizacion ? (
              <>
                <small className="text-muted d-block">Finalizada</small>
                <div className="d-flex align-items-center gap-2 resumen-detalle-tarea__valor">
                  <FaCircleCheck className="text-success flex-shrink-0" size={14} />
                  <span>{tarea.fechaFinalizacion}</span>
                </div>
              </>
            ) : (
              <>
                <small className="text-muted d-block">Creada</small>
                <div className="resumen-detalle-tarea__valor">
                  {tarea.fechaCreacion}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumenDetalleTarea;