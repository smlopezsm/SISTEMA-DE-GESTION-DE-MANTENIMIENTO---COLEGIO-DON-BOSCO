import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { FaFileLines, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import '../styles/RequerimientosListadoPage.css';
import { obtenerRequerimientos, eliminarRequerimiento } from '../services/requerimientosService';
import Filtros from '../../../shared/components/Filtros';
import TablaRequerimientos from '../components/TablaRequerimientos';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';

const POR_PAGINA = 8;

function fechaAISO(fechaHora) {
  if (!fechaHora) return '';
  const [fecha] = fechaHora.split(' ');
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

function RequerimientosListadoPage() {
  const [todosLosRequerimientos, setTodosLosRequerimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ busqueda: '', lugar: 'todos', fechaDesde: '', fechaHasta: '' });
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    let activo = true;
    obtenerRequerimientos()
      .then((data) => { if (activo) setTodosLosRequerimientos(data); })
      .catch((err) => { if (activo) setError(err.message || 'No se pudieron cargar los requerimientos.'); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, []);

  const lugares = useMemo(
    () => [...new Set(todosLosRequerimientos.map((r) => r.lugar))].sort(),
    [todosLosRequerimientos]
  );

  function manejarCambioFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
    setPagina(1);
  }

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este requerimiento?')) {
      try {
        await eliminarRequerimiento(id);
        setTodosLosRequerimientos(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  const requerimientosFiltrados = useMemo(() => {
    return todosLosRequerimientos
      .filter((req) => {
        const coincideBusqueda =
          filtros.busqueda === '' ||
          req.id.toString().includes(filtros.busqueda.toLowerCase()) ||
          (req.categoria ?? '').toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          req.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());

        const coincideLugar = filtros.lugar === 'todos' || req.lugar === filtros.lugar;
        const fechaReq = fechaAISO(req.fechaHora);
        const coincideDesde = !filtros.fechaDesde || fechaReq >= filtros.fechaDesde;
        const coincideHasta = !filtros.fechaHasta || fechaReq <= filtros.fechaHasta;

        return coincideBusqueda && coincideLugar && coincideDesde && coincideHasta;
      });
  }, [todosLosRequerimientos, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(requerimientosFiltrados.length / POR_PAGINA));
  const requerimientosPagina = requerimientosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const desde = requerimientosFiltrados.length === 0 ? 0 : (pagina - 1) * POR_PAGINA + 1;
  const hasta = Math.min(pagina * POR_PAGINA, requerimientosFiltrados.length);

  return (
    <div className="requerimientos-listado">
      <EncabezadoPagina
        icono={FaFileLines}
        titulo="Requerimientos pendientes"
        subtitulo="Listado de requerimientos pendientes de tarea"
      >
        <Link to="/gestor/requerimientos/nuevo-requerimiento" className="btn btn-primary">
          <FaPlus className="me-2" /> Nuevo requerimiento
        </Link>
      </EncabezadoPagina>

      <Filtros
        filtros={filtros}
        onCambiar={manejarCambioFiltro}
        onAplicar={() => {}}
        campos={[
          { tipo: 'busqueda', clave: 'busqueda', placeholder: 'Buscar por ID, categoría o descripción…' },
          {
            tipo: 'select', clave: 'lugar', etiqueta: 'Lugar',
            opciones: [{ valor: 'todos', texto: 'Todos' }, ...lugares.map((l) => ({ valor: l, texto: l }))],
          },
          { tipo: 'fecha', clave: 'fechaDesde', etiqueta: 'Fecha desde' },
          { tipo: 'fecha', clave: 'fechaHasta', etiqueta: 'Fecha hasta' },
        ]}
      />

      <div className="card border-0 shadow-sm">
        {cargando ? (
          <div className="card-body text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-3 mb-0">Cargando requerimientos...</p>
          </div>
        ) : error ? (
          <div className="card-body text-center py-5">
            <div className="alert alert-danger" role="alert">{error}</div>
          </div>
        ) : requerimientosFiltrados.length === 0 ? (
          <div className="card-body text-center text-muted py-5">
            <p className="mb-1 fw-medium">No hay requerimientos pendientes</p>
            <small>Cuando se emita uno nuevo, va a aparecer acá.</small>
          </div>
        ) : (
          <TablaRequerimientos 
            requerimientos={requerimientosPagina} 
            onEliminar={handleEliminar} 
          />
        )}
      </div>

      {!cargando && !error && requerimientosFiltrados.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Mostrando {desde} – {hasta} de {requerimientosFiltrados.length} requerimientos pendientes
          </small>
          {totalPaginas > 1 && (
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} aria-label="Anterior">
                    <FaChevronLeft size={12} />
                  </button>
                </li>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <li key={numero} className={`page-item ${pagina === numero ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPagina(numero)}>{numero}</button>
                  </li>
                ))}
                <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} aria-label="Siguiente">
                    <FaChevronRight size={12} />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}

export default RequerimientosListadoPage;