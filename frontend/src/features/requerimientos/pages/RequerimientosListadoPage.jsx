import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { FaFileLines, FaPlus, FaChevronLeft, FaChevronRight, } from 'react-icons/fa6';
import '../styles/RequerimientosListadoPage.css';
import { obtenerRequerimientos, obtenerLugares, } from '../services/requerimientosService';
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

  const totalPaginas = Math.max(1, Math.ceil(requerimientosFiltrados.length / POR_PAGINA));
  const requerimientosPagina = requerimientosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const desde = requerimientosFiltrados.length === 0 ? 0 : (pagina - 1) * POR_PAGINA + 1;
  const hasta = Math.min(pagina * POR_PAGINA, requerimientosFiltrados.length);

  return (
    <div className="requerimientos-listado">
      {/* encabezado */}
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
        onAplicar={() => { }}   // opcional, si querés mantener el botón
        campos={[
          {
            tipo: 'busqueda',
            clave: 'busqueda',
            placeholder: 'Buscar por ID, título o descripción…',
          },
          {
            tipo: 'select',
            clave: 'lugar',
            etiqueta: 'Lugar',
            opciones: [
              { valor: 'todos', texto: 'Todos' },
              ...lugares.map((l) => ({ valor: l, texto: l })),
            ],
          },
          {
            tipo: 'fecha',
            clave: 'fechaDesde',
            etiqueta: 'Fecha desde',
          },
          {
            tipo: 'fecha',
            clave: 'fechaHasta',
            etiqueta: 'Fecha hasta',
          },
        ]}
      />

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