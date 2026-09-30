import { FaMagnifyingGlass, FaFilter } from 'react-icons/fa6';
import '../styles/FiltrosRequerimientos.css';

function FiltrosRequerimientos({ filtros, lugares, onCambiarFiltro }) {
  return (
    <div className="card border-0 shadow-sm mb-4 filtros-requerimientos">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          {/* buscar */}
          <div className="col-12 col-md-5">
            <label className="form-label small text-muted">Buscar</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaMagnifyingGlass className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por ID, título o descripción..."
                value={filtros.busqueda}
                onChange={(e) => onCambiarFiltro('busqueda', e.target.value)}
              />
            </div>
          </div>

          {/* lugar */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small text-muted">Lugar</label>
            <select className="form-select" value={filtros.lugar} onChange={(e) => onCambiarFiltro('lugar', e.target.value)} >
              <option value="todos">Todos</option>
              {lugares.map((lugar) => (
                <option key={lugar} value={lugar}>
                  {lugar}
                </option>
              ))}
            </select>
          </div>

          {/* fecha desde */}
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label small text-muted">Fecha desde</label>
            <input
              type="date"
              className="form-control"
              value={filtros.fechaDesde}
              onChange={(e) => onCambiarFiltro('fechaDesde', e.target.value)}
            />
          </div>

          {/* fecha hasta */}
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label small text-muted">Fecha hasta</label>
            <div className="d-flex gap-2">
              <input
                type="date"
                className="form-control"
                value={filtros.fechaHasta}
                onChange={(e) => onCambiarFiltro('fechaHasta', e.target.value)}
              />
              <button type="button" className="btn btn-primary d-flex align-items-center px-3" aria-label="Aplicar filtros" > <FaFilter />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltrosRequerimientos;