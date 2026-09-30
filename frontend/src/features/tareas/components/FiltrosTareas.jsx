import { FaMagnifyingGlass, FaFilter } from 'react-icons/fa6';
import '../styles/FiltrosTareas.css';

const ESTADOS = [ { valor: 'todos', texto: 'Todos' }, { valor: 'pendiente', texto: 'Pendiente' }, { valor: 'en-proceso', texto: 'En proceso' }, { valor: 'demorada', texto: 'Demorada' }, { valor: 'cancelada', texto: 'Cancelada' }, { valor: 'finalizada', texto: 'Finalizada' }, { valor: 'aprobada', texto: 'Aprobada' }, { valor: 'rechazada', texto: 'Rechazada' }, ];
const PRIORIDADES = [ { valor: 'todas', texto: 'Todas' }, { valor: 'alta', texto: 'Alta' }, { valor: 'media', texto: 'Media' }, { valor: 'baja', texto: 'Baja' }, ];

function FiltrosTareas({ filtros, responsables, onCambiarFiltro }) {

  return (
    <div className="card border-0 shadow-sm mb-4 filtros-tareas">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          {/* buscar */}
          <div className="col-12 col-md-3">
            <label className="form-label small text-muted">Buscar</label>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <FaMagnifyingGlass className="text-muted" />
              </span>
              <input type="text" className="form-control" placeholder="Buscar por ID o título..." value={filtros.busqueda} onChange={(e) => onCambiarFiltro('busqueda', e.target.value)} />
            </div>
          </div>

          {/* estado */}
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label small text-muted">Estado</label>
            <select className="form-select" value={filtros.estado} onChange={(e) => onCambiarFiltro('estado', e.target.value)} >
              {ESTADOS.map((e) => (
                <option key={e.valor} value={e.valor}>
                  {e.texto}
                </option>
              ))}
            </select>
          </div>

          {/* prioridad */}
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label small text-muted">Prioridad</label>
            <select className="form-select" value={filtros.prioridad} onChange={(e) => onCambiarFiltro('prioridad', e.target.value)} >
              {PRIORIDADES.map((p) => (
                <option key={p.valor} value={p.valor}>
                  {p.texto}
                </option>
              ))}
            </select>
          </div>

          {/* responsable */}
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label small text-muted">Responsable</label>
            <select className="form-select" value={filtros.responsable} onChange={(e) => onCambiarFiltro('responsable', e.target.value)} >
              <option value="todos">Todos</option>
              {responsables.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* fechas */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small text-muted">Fecha de creación</label>
            <div className="filtros-tareas__fechas">
              <input type="date" className="form-control" value={filtros.fechaDesde} onChange={(e) => onCambiarFiltro('fechaDesde', e.target.value)} placeholder="Desde" />
              <input type="date" className="form-control" value={filtros.fechaHasta} onChange={(e) => onCambiarFiltro('fechaHasta', e.target.value)} placeholder="Hasta" />
            </div>
          </div>
        </div>

        {/* botones */}
        <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              onCambiarFiltro('busqueda', '');
              onCambiarFiltro('estado', 'todos');
              onCambiarFiltro('prioridad', 'todas');
              onCambiarFiltro('responsable', 'todos');
              onCambiarFiltro('fechaDesde', '');
              onCambiarFiltro('fechaHasta', '');
            }}
          >
            Limpiar filtros
          </button>
          <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-1" >
            <FaFilter size={12} />
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FiltrosTareas;