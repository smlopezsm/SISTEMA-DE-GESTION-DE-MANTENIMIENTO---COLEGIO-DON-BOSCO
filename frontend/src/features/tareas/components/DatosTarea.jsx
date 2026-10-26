import SeccionCompra from './SeccionCompra';
import { FaScrewdriverWrench, FaUsers, FaPhone, FaCartShopping, FaUserTie, FaBuilding, FaUserShield, } from 'react-icons/fa6';
import '../styles/DatosTarea.css';

const MAX_OBSERVACIONES = 300;
const MAX_DETALLE_COMPRA = 200;

function DatosTarea({ modoEdicion, valores, ordenanzas, personalExterno, compra, onCambiar, onSeleccionarPersonal, onRegistrarCompra, onEditarCompra, }) {
  // lista segun el tipo de personal
  const listaPersonas =
    valores.tipoAsignacion === 'interno'
      ? ordenanzas
      : valores.tipoAsignacion === 'externo'
        ? personalExterno
        : [];

  return (
    <>
      {/* detalle de tareas */}
      <div className="card border-0 shadow-sm mb-4 datos-tarea">
        <div className="card-body">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <FaScrewdriverWrench /> Detalles de la tarea
          </h6>

          <div className="row g-3">
            {/* prioridad */}
            <div className="col-12 col-md-6">
              <label className="form-label">Prioridad</label>
              <select
                className="form-select"
                value={valores.prioridad}
                onChange={(e) => onCambiar('prioridad', e.target.value)}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            {/* observaciones */}
            <div className="col-12">
              <label className="form-label">Observaciones</label>
              <textarea
                className="form-control"
                rows={3}
                maxLength={MAX_OBSERVACIONES}
                placeholder="Agregar información adicional sobre la tarea..."
                value={valores.observaciones}
                onChange={(e) => onCambiar('observaciones', e.target.value)}
              />
              <small className="text-muted d-block text-end">
                {valores.observaciones.length}/{MAX_OBSERVACIONES}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* asignacion y recursos*/}
      <div className="card border-0 shadow-sm datos-tarea">
        <div className="card-body">
          <h6 className="mb-3 d-flex align-items-center gap-2">
            <FaUsers /> Asignacion y recursos
            {modoEdicion && (
              <span className="badge bg-light text-muted ms-auto small">

              </span>
            )}
          </h6>

          {/* tipo de asignacion que solo se puede editar en el modo crear tarea */}
          {!modoEdicion && (
            <div className="mb-3">
              <label className="form-label d-block">¿Quien realizara la tarea?</label>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="tipoAsignacion" id="tipoJefe" value="jefe" checked={valores.tipoAsignacion === 'jefe'} onChange={(e) => onCambiar('tipoAsignacion', e.target.value)} />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="tipoJefe">
                  <FaUserShield size={14} /> La toma el Jefe de Mantenimiento
                </label>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="tipoAsignacion" id="tipoInterno" value="interno" checked={valores.tipoAsignacion === 'interno'} onChange={(e) => onCambiar('tipoAsignacion', e.target.value)} />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="tipoInterno">
                  <FaUserTie size={14} /> Asignar a personal interno (ordenanza)
                </label>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="tipoAsignacion" id="tipoExterno" value="externo" checked={valores.tipoAsignacion === 'externo'} onChange={(e) => onCambiar('tipoAsignacion', e.target.value)} />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="tipoExterno">
                  <FaBuilding size={14} /> Asignar a personal externo
                </label>
              </div>
            </div>
          )}

          {/* muestra asignacion en edicion */}
          {modoEdicion && (
            <div className="mb-3">
              <label className="form-label">Asignada a</label>
              <div className="fw-semibold">
                {valores.tipoAsignacion === 'jefe'
                  ? 'Jefe de Mantenimiento'
                  : valores.personalAsignado || '—'}
              </div>
              <small className="text-muted">
                ({valores.tipoAsignacion})
              </small>
            </div>
          )}

          {/* perosnal asignado con el telefono en el crear tarea */}
          {!modoEdicion && valores.tipoAsignacion !== 'jefe' && (
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label">
                  {valores.tipoAsignacion === 'interno'
                    ? 'Personal interno (ordenanza)'
                    : 'Personal externo'}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaUsers className="text-muted" />
                  </span>
                  <select className="form-select" value={valores.personalAsignado} onChange={(e) => onSeleccionarPersonal(e.target.value)} >
                    <option value="">Seleccioná un responsable</option>
                    {listaPersonas.map((p) => (
                      <option key={p.id} value={p.nombre}>
                        {p.nombre}
                        {p.especialidad ? ` — ${p.especialidad}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Telefono / contacto</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaPhone className="text-muted" />
                  </span>
                  <input type="tel" className="form-control" placeholder="+54 9 2664 12-3456" value={valores.telefono} onChange={(e) => onCambiar('telefono', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* compra de materiales */}
      <SeccionCompra compra={compra} onRegistrar={onRegistrarCompra} onEditar={onEditarCompra} />
    </>
  );
}

export default DatosTarea;