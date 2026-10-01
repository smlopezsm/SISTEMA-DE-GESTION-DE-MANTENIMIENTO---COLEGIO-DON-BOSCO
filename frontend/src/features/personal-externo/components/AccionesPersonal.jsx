import { FaGear, FaFloppyDisk, FaUserSlash, FaUserCheck, FaXmark, FaCircleInfo, FaUserPlus, } from 'react-icons/fa6';
import '../styles/AccionesPersonal.css';

function AccionesPersonal({ modoEdicion, estaActivo, guardando, onGuardar, onCancelar, onDarDeBaja, onDarDeAlta, }) {
  return (
    <div className="card border-0 shadow-sm acciones-personal-card">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaGear /> Acciones
        </h6>

        {/* Boton principal */}
        <button type="button" className="btn btn-primary w-100 mb-2 d-flex align-items-center justify-content-center gap-2" onClick={onGuardar} disabled={guardando}>
          {modoEdicion ? <FaFloppyDisk /> : <FaUserPlus />}
          {guardando
            ? 'Guardando...'
            : modoEdicion
              ? 'Guardar cambios'
              : 'Agregar personal'}
        </button>

        {/*Botones de estado (solo en edicion)*/}
        {modoEdicion && (
          <>
            {/* Dar de baja (habilitado solo si esta activo) */}
            <button type="button" className="btn btn-outline-danger w-100 mb-2 d-flex align-items-center justify-content-center gap-2" onClick={onDarDeBaja} disabled={!estaActivo} >
              <FaUserSlash /> Dar de baja
            </button>

            {/* Dar de alta (habilitado solo si esta inactivo) */}
            <button type="button" className="btn btn-outline-success w-100 mb-2 d-flex align-items-center justify-content-center gap-2" onClick={onDarDeAlta} disabled={estaActivo} >
              <FaUserCheck /> Dar de alta
            </button>
          </>
        )}

        {/* Cancelar */}
        <button type="button" className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2" onClick={onCancelar} >
          <FaXmark /> Cancelar
        </button>

        {/* Nota al pie */}
        <div className="alert alert-info mt-3 mb-0 small d-flex gap-2">
          <FaCircleInfo />
          <span>
            {modoEdicion
              ? 'La baja del personal externo no elimina el historial de tareas asignadas'
              : 'El personal externo podra ser asignado a tareas de mantenimiento'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccionesPersonal;