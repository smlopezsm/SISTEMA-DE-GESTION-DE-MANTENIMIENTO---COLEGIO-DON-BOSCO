import { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router';
import { FaScrewdriverWrench, FaChevronLeft, FaChevronRight, } from 'react-icons/fa6';
import '../styles/TareasListadoPage.css';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';
import { obtenerTareas, obtenerResponsables } from '../services/tareasService';
import Filtros from '../../../shared/components/Filtros';
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

     <EncabezadoPagina
        icono={FaScrewdriverWrench}
        titulo={usuario?.rol === 'directivo'
            ? 'Todas las Tareas'
            : 'Mis Tareas'
        }
        subtitulo={
          usuario?.rol === 'directivo'
            ? 'Revisá la tarea y aprobá o rechazá si está finalizada'
            : 'Información completa de la tareas'
        }
      />

      <Filtros
        filtros={filtros}
        onCambiar={manejarCambioFiltro}
        onLimpiar={() => {
          onCambiarFiltro('busqueda', '');
          onCambiarFiltro('estado', 'todos');
          onCambiarFiltro('prioridad', 'todas');
          onCambiarFiltro('responsable', 'todos');
          onCambiarFiltro('fechaDesde', '');
          onCambiarFiltro('fechaHasta', '');
        }}
        onAplicar={() => { }}  // opcional
        campos={[
          {
            tipo: 'busqueda',
            clave: 'busqueda',
            placeholder: 'Buscar por ID o título…',
          },
          {
            tipo: 'select',
            clave: 'estado',
            etiqueta: 'Estado',
            opciones: [
              { valor: 'todos', texto: 'Todos' },
              { valor: 'pendiente', texto: 'Pendiente' },
              { valor: 'en-proceso', texto: 'En proceso' },
              { valor: 'demorada', texto: 'Demorada' },
              { valor: 'cancelada', texto: 'Cancelada' },
              { valor: 'finalizada', texto: 'Finalizada' },
              { valor: 'aprobada', texto: 'Aprobada' },
              { valor: 'rechazada', texto: 'Rechazada' },
            ],
          },
          {
            tipo: 'select',
            clave: 'prioridad',
            etiqueta: 'Prioridad',
            opciones: [
              { valor: 'todas', texto: 'Todas' },
              { valor: 'alta', texto: 'Alta' },
              { valor: 'media', texto: 'Media' },
              { valor: 'baja', texto: 'Baja' },
            ],
          },
          {
            tipo: 'select',
            clave: 'responsable',
            etiqueta: 'Responsable',
            opciones: [
              { valor: 'todos', texto: 'Todos' },
              ...responsables.map((r) => ({ valor: r, texto: r })),
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
          }
        ]}
      />
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