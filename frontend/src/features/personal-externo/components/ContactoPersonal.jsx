import { FaPhone } from 'react-icons/fa6';
import '../styles/ContactoPersonal.css';

function ContactoPersonal({ valores, errores, onCambiar }) {
  return (
    <div className="card border-0 shadow-sm mb-4 card-personal">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaPhone /> Contacto
        </h6>

        <div className="row g-3">
          {/* Telefono */}
          <div className="col-12 col-md-6">
            <label className="form-label">
              Teléfono <span className="text-danger">*</span>
            </label>
            <input type="tel" className={`form-control ${errores.telefono ? 'is-invalid' : ''}`} placeholder="+54 9 2664 12-3456" value={valores.telefono ?? ''} onChange={(e) => onCambiar('telefono', e.target.value)} />
            {errores.telefono && (
              <div className="invalid-feedback">{errores.telefono}</div>
            )}
          </div>

          {/* Email */}
          <div className="col-12 col-md-6">
            <label className="form-label">
              Correo electrónico <span className="text-danger">*</span>
            </label>
            <input type="email" className={`form-control ${errores.email ? 'is-invalid' : ''}`} placeholder="ejemplo@correo.com" value={valores.email ?? ''} onChange={(e) => onCambiar('email', e.target.value)} />
            {errores.email && (
              <div className="invalid-feedback">{errores.email}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactoPersonal;