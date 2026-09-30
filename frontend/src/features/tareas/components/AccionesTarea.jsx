import { FaBolt, FaGear, FaFloppyDisk, FaCircleCheck, FaTrashCan, FaCircleInfo, FaLock, } from 'react-icons/fa6';
import SelectorUrgencia from './SelectorUrgencia';
import '../styles/AccionesTarea.css';

// estados editables manualmente 
const ESTADOS_EDITABLES = [ { valor: 'pendiente', texto: 'Pendiente' }, { valor: 'en-proceso', texto: 'En proceso' }, { valor: 'demorada', texto: 'Demorada' }, ];
// estados finales, no editables
const ESTADOS_FINALES = ['finalizada', 'aprobada', 'rechazada', 'cancelada'];

const TEXTO_ESTADO_FINAL = { finalizada: 'Finalizada', aprobada: 'Aprobada', rechazada: 'Rechazada', cancelada: 'Cancelada', };

function AccionesTarea({ modoEdicion, valores, guardando, onCambiar, onGuardar, onFinalizar, onCancelar, }) {
  
  const estadoActual = valores.estado ?? 'pendiente';
  const esEstadoFinal = ESTADOS_FINALES.includes(estadoActual);

  return (
    <>
      {/* estado */}
      <div className="card border-0 shadow-sm mb-4 acciones-tarea">
        <div className="card-body">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <FaBolt /> Estado
          </h6>

          {esEstadoFinal ? (
            /* estado final no editable */
            <div className="alert alert-secondary mb-0 small d-flex gap-2">
              <FaLock className="flex-shrink-0" />
              <span>
                Esta tarea está <strong>{TEXTO_ESTADO_FINAL[estadoActual]}</strong> y
                ya no admite cambios de estado.
              </span>
            </div>
          ) : (
            /* estado editable*/
            <div>
              <label className="form-label small text-muted d-block">
                Estado de la tarea
              </label>
              <select className="form-select" value={estadoActual} onChange={(e) => onCambiar('estado', e.target.value)} >
                {ESTADOS_EDITABLES.map((e) => (
                  <option key={e.valor} value={e.valor}>
                    {e.texto}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* acciones */}
      <div className="card border-0 shadow-sm acciones-tarea">
        <div className="card-body">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <FaGear /> Acciones
          </h6>

          {/* boton principal */}
          <button type="button" className="btn btn-primary w-100 mb-2 d-flex align-items-center justify-content-center gap-2" onClick={onGuardar} disabled={guardando} >
            <FaFloppyDisk />
            {guardando
              ? 'Guardando...'
              : modoEdicion
                ? 'Guardar cambios'
                : 'Crear tarea'}
          </button>

          {/* acciones rapidas para el modo edicion sin tarea finalizada */}
          {modoEdicion && !esEstadoFinal && (
            <>
              <button type="button" className="btn btn-outline-success w-100 mb-2 d-flex align-items-center justify-content-center gap-2" onClick={onFinalizar} >
                <FaCircleCheck /> Marcar como finalizada
              </button>

              <button type="button" className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={onCancelar} >
                <FaTrashCan /> Cancelar tarea
              </button>
            </>
          )}

          <div className="alert alert-info mt-3 mb-0 small d-flex gap-2">
            <FaCircleInfo />
            <span>
              {esEstadoFinal
                ? 'La tarea ya esta cerrada, el Directivo tiene que aprobarla o rechazarla'
                : 'La tarea quedara registrada en el historial y visible'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccionesTarea;