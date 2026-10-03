import { FaMagnifyingGlass, FaFilter, FaFilterCircleXmark } from 'react-icons/fa6';
import './Filtros.css';

/**
 * Componente de filtros reutilizable.
 *
 * Props:
 * - filtros: objeto con los valores actuales
 * - onCambiar: (campo, valor) => void
 * - campos: array de definiciones de campos
 * - onLimpiar: (opcional) si se pasa, muestra botón "Limpiar filtros"
 * - onAplicar: (opcional) si se pasa, muestra botón "Aplicar"
 *
 * Cada campo puede ser:
 * - { tipo: 'busqueda', clave, etiqueta?, placeholder? }
 * - { tipo: 'select', clave, etiqueta, opciones: [{ valor, texto }] }
 * - { tipo: 'fecha', clave, etiqueta }
 * - { tipo: 'rango-fechas', claveDesde, claveHasta, etiqueta }
 */
function Filtros({ filtros, onCambiar, campos, onLimpiar, onAplicar }) {
  return (
    <div className="filtros card border-0 shadow-sm mb-4">
      <div className="card-body">
        <div className="filtros__grid">
          {campos.map((campo, idx) => (
            <FiltroCampo
              key={campo.clave ?? `${campo.tipo}-${idx}`}
              campo={campo}
              filtros={filtros}
              onCambiar={onCambiar}
            />
          ))}
        </div>

        {(onLimpiar || onAplicar) && (
          <div className="filtros__acciones">
            {onLimpiar && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
                onClick={onLimpiar}
              >
                <FaFilterCircleXmark size={13} /> Limpiar filtros
              </button>
            )}
            {onAplicar && (
              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
                onClick={onAplicar}
              >
                <FaFilter size={12} /> Aplicar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────── Subcomponente por tipo ─────────────
function FiltroCampo({ campo, filtros, onCambiar }) {
  if (campo.tipo === 'busqueda') {
    return (
      <label className="filtros__campo filtros__campo--busqueda">
        <span className="filtros__label">{campo.etiqueta ?? 'Buscar'}</span>
        <div className="filtros__busqueda">
          <FaMagnifyingGlass aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder={campo.placeholder ?? 'Buscar…'}
            value={filtros[campo.clave] ?? ''}
            onChange={(e) => onCambiar(campo.clave, e.target.value)}
            aria-label={campo.etiqueta ?? 'Buscar'}
          />
        </div>
      </label>
    );
  }

  if (campo.tipo === 'select') {
    return (
      <label className="filtros__campo">
        <span className="filtros__label">{campo.etiqueta}</span>
        <select
          className="form-select"
          value={filtros[campo.clave] ?? ''}
          onChange={(e) => onCambiar(campo.clave, e.target.value)}
        >
          {campo.opciones.map((op) => (
            <option key={op.valor} value={op.valor}>
              {op.texto}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (campo.tipo === 'fecha') {
    return (
      <label className="filtros__campo">
        <span className="filtros__label">{campo.etiqueta}</span>
        <input
          type="date"
          className="form-control"
          value={filtros[campo.clave] ?? ''}
          onChange={(e) => onCambiar(campo.clave, e.target.value)}
        />
      </label>
    );
  }

  if (campo.tipo === 'rango-fechas') {
    return (
      <label className="filtros__campo filtros__campo--rango">
        <span className="filtros__label">{campo.etiqueta}</span>
        <div className="filtros__rango">
          <input
            type="date"
            className="form-control"
            value={filtros[campo.claveDesde] ?? ''}
            onChange={(e) => onCambiar(campo.claveDesde, e.target.value)}
            placeholder="Desde"
            aria-label={`${campo.etiqueta} desde`}
          />
          <input
            type="date"
            className="form-control"
            value={filtros[campo.claveHasta] ?? ''}
            onChange={(e) => onCambiar(campo.claveHasta, e.target.value)}
            placeholder="Hasta"
            aria-label={`${campo.etiqueta} hasta`}
          />
        </div>
      </label>
    );
  }

  return null;
}

export default Filtros;