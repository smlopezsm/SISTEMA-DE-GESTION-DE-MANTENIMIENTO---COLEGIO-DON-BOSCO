import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { FaFileLines, FaPlus, FaChevronLeft, FaChevronRight, } from 'react-icons/fa6';
import '../styles/RequerimientosListadoPage.css';
import { obtenerRequerimientos, obtenerLugares, } from '../services/requerimientosService';
import FiltrosRequerimientos from '../components/FiltrosRequerimientos';
import TablaRequerimientos from '../components/TablaRequerimientos';

const POR_PAGINA = 8;

function fechaAISO(fechaHora) {
  if (!fechaHora) return '';
  const [fecha] = fechaHora.split(' ');
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

function RequerimientosListadoPage() {
  const todosLosRequerimientos = obtenerRequerimientos();
  const lugares = obtenerLugares();

  const [filtros, setFiltros] = useState({ busqueda: '', lugar: 'todos', fechaDesde: '', fechaHasta: '', });
  const [pagina, setPagina] = useState(1);

  function manejarCambioFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
    setPagina(1);
  }

  const requerimientosFiltrados = useMemo(() => {
    return todosLosRequerimientos
      //solo pendientes, sin tarea creada
      .filter((req) => req.estado === 'pendiente')
      .filter((req) => {
        const coincideBusqueda =
          filtros.busqueda === '' ||
          req.id.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          req.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          req.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());

        const coincideLugar =
          filtros.lugar === 'todos' || req.lugar === filtros.lugar;

        const fechaReq = fechaAISO(req.fechaHora);
        const coincideDesde = !filtros.fechaDesde || fechaReq >= filtros.fechaDesde;
        const coincideHasta = !filtros.fechaHasta || fechaReq <= filtros.fechaHasta;

        return coincideBusqueda && coincideLugar && coincideDesde && coincideHasta;
      });
  }, [todosLosRequerimientos, filtros]);

  const totalPaginas = Math.max( 1, Math.ceil(requerimientosFiltrados.length / POR_PAGINA) );
  const requerimientosPagina = requerimientosFiltrados.slice( (pagina - 1) * POR_PAGINA, pagina * POR_PAGINA );
  const desde = requerimientosFiltrados.length === 0 ? 0 : (pagina - 1) * POR_PAGINA + 1;
  const hasta = Math.min(pagina * POR_PAGINA, requerimientosFiltrados.length);

  return (
    <div className="requerimientos-listado">
      {/* encabezado */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="d-flex gap-3">
          <div className="icono-titulo">
            <FaFileLines size={22} />
          </div>
          <div>
            <h1 className="h3 mb-1">Requerimientos pendientes</h1>
          </div>
        </div>
        <Link to="/gestor/requerimientos/nuevo" className="btn btn-primary w-100-movil">
          <FaPlus className="me-2" />
          Nuevo requerimiento
        </Link>
      </div>

      {/* filtros */}
      <FiltrosRequerimientos filtros={filtros} lugares={lugares} onCambiarFiltro={manejarCambioFiltro} />

      {/* tabla */}
      <TablaRequerimientos requerimientos={requerimientosPagina} />

      {/* paginacion */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Mostrando {desde} – {hasta} de {requerimientosFiltrados.length}{' '}
          requerimientos pendientes
        </small>

        {totalPaginas > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} aria-label="Anterior" >
                  <FaChevronLeft size={12} />
                </button>
              </li>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (numero) => (
                  <li
                    key={numero}
                    className={`page-item ${pagina === numero ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setPagina(numero)} >
                      {numero}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setPagina((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={pagina === totalPaginas}
                  aria-label="Siguiente"
                >
                  <FaChevronRight size={12} />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default RequerimientosListadoPage;