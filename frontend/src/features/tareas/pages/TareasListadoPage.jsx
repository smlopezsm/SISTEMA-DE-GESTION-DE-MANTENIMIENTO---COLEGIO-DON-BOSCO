import { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router';
import { FaListCheck, FaChevronLeft, FaChevronRight, } from 'react-icons/fa6';
import '../styles/TareasListadoPage.css';
import { obtenerTareas, obtenerResponsables } from '../services/tareasService';
import FiltrosTareas from '../components/FiltrosTareas';
import TablaTareas from '../components/TablaTareas';

const POR_PAGINA = 10;
const FILTROS_INICIALES = {
  busqueda: '', estado: 'todos', prioridad: 'todas', responsable: 'todos', fechaDesde: '', fechaHasta: '',
};

function fechaAISO(fechaHora) {
  if (!fechaHora) return '';
  const [fecha] = fechaHora.split(' ');
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

function TareasListadoPage() {
  const usuario = useOutletContext();
  const location = useLocation();

  //el listado vive en el estado (se refresca al volver)
  const [todasLasTareas, setTodasLasTareas] = useState(() => obtenerTareas());
  const [responsables, setResponsables] = useState(() => obtenerResponsables());

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [pagina, setPagina] = useState(1);

  //refrescar cuando cambia la URL
  useEffect(() => {
    setTodasLasTareas(obtenerTareas());
    setResponsables(obtenerResponsables());
  }, [location.key]);

  function manejarCambioFiltro(campo, valor) {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
    setPagina(1);
  }

  const tareasFiltradas = useMemo(() => {
    return todasLasTareas.filter((t) => {
      const coincideBusqueda =
        filtros.busqueda === '' ||
        t.id.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        t.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase());

      const coincideEstado = filtros.estado === 'todos' || t.estado === filtros.estado;
      const coincidePrioridad = filtros.prioridad === 'todas' || t.prioridad === filtros.prioridad;
      const coincideResponsable = filtros.responsable === 'todos' || (t.responsable && t.responsable.nombre === filtros.responsable);
      const fechaTarea = fechaAISO(t.fechaCreacion);
      const coincideDesde = !filtros.fechaDesde || fechaTarea >= filtros.fechaDesde;
      const coincideHasta = !filtros.fechaHasta || fechaTarea <= filtros.fechaHasta;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincidePrioridad &&
        coincideResponsable &&
        coincideDesde &&
        coincideHasta
      );
    });
  }, [todasLasTareas, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(tareasFiltradas.length / POR_PAGINA));
  const tareasPagina = tareasFiltradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const desde = tareasFiltradas.length === 0 ? 0 : (pagina - 1) * POR_PAGINA + 1;
  const hasta = Math.min(pagina * POR_PAGINA, tareasFiltradas.length);

  const esJefe = usuario?.rol === 'jefeMantenimiento';
  const esDirectivo = usuario?.rol === 'directivo';


  return (
    <div className="tareas-listado">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="d-flex gap-3">
          <div className="icono-titulo"><FaListCheck size={22} /></div>
          <div>
            {esJefe && (
              <h1 className="h3 mb-1">Mis tareas</h1>,
              <p className="text-muted mb-0">Gestion de tareas</p>
            )}
            
            {esDirectivo && (
              <h1 className="h3 mb-1">Todas las tareas</h1>
            )}

          </div>
        </div>
      </div>

      <FiltrosTareas filtros={filtros} responsables={responsables} onCambiarFiltro={manejarCambioFiltro} />

      <TablaTareas tareas={tareasPagina} usuario={usuario} />

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          Mostrando {desde} – {hasta} de {tareasFiltradas.length} tareas
        </small>

        {totalPaginas > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} >
                  <FaChevronLeft size={12} />
                </button>
              </li>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <li key={n} className={`page-item ${pagina === n ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPagina(n)}>
                    {n} </button>
                </li>
              ))}
              <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} >
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

export default TareasListadoPage;