import { FaUser } from 'react-icons/fa6';
import '../styles/DatosPersonalesPersonal.css';

const GENEROS = ['Masculino', 'Femenino', 'Otro'];

function DatosPersonalesPersonal({ valores, errores, onCambiar }) {
  return (
    <div className="card border-0 shadow-sm mb-4 card-personal">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaUser /> Datos personales
        </h6>

        <div className="row g-3">
          {/* nombre */}
          <div className="col-12 col-md-6">
            <label className="form-label">
              Nombre <span className="text-danger">*</span>
            </label>
            <input type="text" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} value={valores.nombre ?? ''} onChange={(e) => onCambiar('nombre', e.target.value)} />
            {errores.nombre && (
              <div className="invalid-feedback">{errores.nombre}</div>
            )}
          </div>

          {/* apellido */}
          <div className="col-12 col-md-6">
            <label className="form-label">
              Apellido <span className="text-danger">*</span>
            </label>
            <input type="text" className={`form-control ${errores.apellido ? 'is-invalid' : ''}`} value={valores.apellido ?? ''} onChange={(e) => onCambiar('apellido', e.target.value)} />
            {errores.apellido && (
              <div className="invalid-feedback">{errores.apellido}</div>
            )}
          </div>

          {/* DNI */}
          <div className="col-12 col-md-6">
            <label className="form-label">
              DNI <span className="text-danger">*</span>
            </label>
            <input type="text" className={`form-control ${errores.dni ? 'is-invalid' : ''}`} placeholder="28.765.432" value={valores.dni ?? ''} onChange={(e) => onCambiar('dni', e.target.value)} />
            {errores.dni && (
              <div className="invalid-feedback">{errores.dni}</div>
            )}
          </div>

          {/* genero */}
          <div className="col-12 col-md-6">
            <label className="form-label">Genero</label>
            <select className="form-select" value={valores.genero ?? ''} onChange={(e) => onCambiar('genero', e.target.value)} >
              <option value="">Sin especificar</option>
              {GENEROS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatosPersonalesPersonal;