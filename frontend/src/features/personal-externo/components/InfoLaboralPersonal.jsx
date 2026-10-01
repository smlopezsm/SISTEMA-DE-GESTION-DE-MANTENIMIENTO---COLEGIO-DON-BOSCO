import { FaBriefcase } from 'react-icons/fa6';
import '../styles/InfoLaboralPersonal.css';

const MAX_OBSERVACIONES = 200;

function InfoLaboralPersonal({ valores, errores, especialidades, onCambiar }) {
  return (
    <div className="card border-0 shadow-sm card-personal">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaBriefcase /> Informacion laboral
        </h6>

        <div className="row g-3">
          {/* especialidad */}
          <div className="col-12 col-md-6">
            <label className="form-label"> Especialidad / Servicio <span className="text-danger">*</span> </label>
            <select
              className={`form-select ${errores.especialidad ? 'is-invalid' : ''}`}
              value={valores.especialidad ?? ''}
              onChange={(e) => onCambiar('especialidad', e.target.value)}
            >
              <option value="">Selecciona una especialidad</option>
              {especialidades.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errores.especialidad && (
              <div className="invalid-feedback">{errores.especialidad}</div>
            )}
          </div>

          {/* numero de matricula opcional */}
          <div className="col-12 col-md-6">
            <label className="form-label">
              N° de Matricula (opcional)
            </label>
            <input type="text" className="form-control" placeholder="MP 34567" value={valores.matricula ?? ''} onChange={(e) => onCambiar('matricula', e.target.value)} />
          </div>

          {/* observaciones */}
          <div className="col-12">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-control"
              rows={3}
              maxLength={MAX_OBSERVACIONES}
              placeholder="Experiencia, referencias, notas internas..."
              value={valores.observaciones ?? ''}
              onChange={(e) => onCambiar('observaciones', e.target.value)}
            />
            <small className="text-muted d-block text-end">
              {(valores.observaciones?.length ?? 0)}/{MAX_OBSERVACIONES}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoLaboralPersonal;