import { FaMagnifyingGlass } from 'react-icons/fa6';
import '../styles/FiltrosPersonal.css';

const ESTADOS = [ { valor: 'todos', texto: 'Todos' }, { valor: 'activos', texto: 'Activos' }, { valor: 'inactivos', texto: 'Inactivos' }, ];

function FiltrosPersonal({ filtros, especialidades, onCambiarFiltro }) {
  return (
    <div className="card border-0 shadow-sm mb-4 filtros-personal">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          {/* buscar */}
          <div className="col-12 col-md-5">
            <label className="form-label small text-muted">Buscar</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaMagnifyingGlass className="text-muted" />
              </span>
              <input type="text" className="form-control" placeholder="Buscar por nombre, apellido o especialidad..." value={filtros.busqueda} onChange={(e) => onCambiarFiltro('busqueda', e.target.value)} />
            </div>
          </div>

          {/* especialidad */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small text-muted">Especialidad</label>
            <select className="form-select" value={filtros.especialidad} onChange={(e) => onCambiarFiltro('especialidad', e.target.value)} >
              <option value="todas">Todas</option>
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>

          {/* estado */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small text-muted">Estado</label>
            <select className="form-select" value={filtros.estado} onChange={(e) => onCambiarFiltro('estado', e.target.value)} >
              {ESTADOS.map((e) => (
                <option key={e.valor} value={e.valor}>
                  {e.texto}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltrosPersonal;