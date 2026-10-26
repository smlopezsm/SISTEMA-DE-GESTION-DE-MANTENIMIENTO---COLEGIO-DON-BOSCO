import { useState, useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';
import '../styles/ModalPersonal.css';

const VALORES_INICIALES = { nombre: '', apellido: '', telefono: '', especialidad: '', activo: true, };
const ESPECIALIDADES_SUGERIDAS = [ 'Electricista', 'Plomería', 'Albañilería', 'Pintura', 'Carpintería', 'Gasista', 'Herrería', 'Climatización', 'Mantenimiento general', 'Vidriería', ];

function ModalPersonal({ abierto, personal, onCerrar, onGuardar }) {

  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});

  const modoEdicion = Boolean(personal);

  useEffect(() => {
    if (abierto) {
      setValores(personal ? { ...personal } : VALORES_INICIALES);
      setErrores({});
    }
  }, [abierto, personal]);

  if (!abierto) return null;

  function manejarCambio(campo, valor) { setValores((prev) => ({ ...prev, [campo]: valor })); }

  function validar() {
    const nuevos = {};
    if (!valores.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio';
    if (!valores.apellido.trim()) nuevos.apellido = 'El apellido es obligatorio';
    if (!valores.telefono.trim()) nuevos.telefono = 'El teléfono es obligatorio';
    if (!valores.especialidad.trim()) nuevos.especialidad = 'La especialidad es obligatoria';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function manejarSubmit(e) {
    e.preventDefault();
    if (!validar()) return;
    onGuardar(valores);
  }

  return (
    <div className="modal-personal-overlay" onClick={onCerrar}>
      <div className="modal-personal" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="modal-personal__header">
          <h5 className="mb-0">
            {modoEdicion ? 'Editar personal externo' : 'Agregar nuevo personal'}
          </h5>
          <button type="button" className="btn btn-link text-muted p-1" onClick={onCerrar} aria-label="Cerrar" >
            <FaXmark size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={manejarSubmit}>
          <div className="modal-personal__body">
            <div className="row g-3">
              {/* nombre */}
              <div className="col-12 col-md-6">
                <label className="form-label">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} value={valores.nombre} onChange={(e) => manejarCambio('nombre', e.target.value)} />
                {errores.nombre && (
                  <div className="invalid-feedback">{errores.nombre}</div>
                )}
              </div>

              {/* apellido */}
              <div className="col-12 col-md-6">
                <label className="form-label">
                  Apellido <span className="text-danger">*</span>
                </label>
                <input type="text" className={`form-control ${errores.apellido ? 'is-invalid' : ''}`} value={valores.apellido} onChange={(e) => manejarCambio('apellido', e.target.value)} />
                {errores.apellido && (
                  <div className="invalid-feedback">{errores.apellido}</div>
                )}
              </div>

              {/* telefono */}
              <div className="col-12 col-md-6">
                <label className="form-label">
                  Teléfono <span className="text-danger">*</span>
                </label>
                <input type="tel" className={`form-control ${errores.telefono ? 'is-invalid' : ''}`} placeholder="+54 9 2664 12-3456" value={valores.telefono} onChange={(e) => manejarCambio('telefono', e.target.value)} />
                {errores.telefono && (
                  <div className="invalid-feedback">{errores.telefono}</div>
                )}
              </div>

              {/* especialidad */}
              <div className="col-12 col-md-6">
                <label className="form-label">
                  Especialidad <span className="text-danger">*</span>
                </label>
                <input type="text" list="especialidades-sugeridas" className={`form-control ${errores.especialidad ? 'is-invalid' : ''}`} value={valores.especialidad} onChange={(e) => manejarCambio('especialidad', e.target.value)} />
                <datalist id="especialidades-sugeridas">
                  {ESPECIALIDADES_SUGERIDAS.map((esp) => (
                    <option key={esp} value={esp} />
                  ))}
                </datalist>
                {errores.especialidad && (
                  <div className="invalid-feedback">{errores.especialidad}</div>
                )}
              </div>

              {/* activo (solo en edicion) */}
              {modoEdicion && (
                <div className="col-12">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="activo" checked={valores.activo} onChange={(e) => manejarCambio('activo', e.target.checked)} />
                    <label className="form-check-label" htmlFor="activo">
                      Personal activo
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="modal-personal__footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCerrar} >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary"> {modoEdicion ? 'Guardar cambios' : 'Agregar personal'} </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalPersonal;