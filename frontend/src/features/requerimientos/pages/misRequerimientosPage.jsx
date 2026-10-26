import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { FaFileLines, FaLocationDot } from 'react-icons/fa6';
import Encabezado from '../../../shared/components/EncabezadoPagina';
import Filtros from '../../../shared/components/Filtros';
import { obtenerMisRequerimientos } from '../services/requerimientosApiService';
import '../styles/MisRequerimientosPage.css';

const ESTILO_ESTADO = {
  pendiente:    { bg: 'var(--estado-pendiente-bg)',  color: 'var(--estado-pendiente-texto)',  label: 'Pendiente' },
  nuevo:        { bg: 'var(--estado-proceso-bg)',    color: 'var(--estado-proceso-texto)',    label: 'Nuevo' },
  'en-proceso': { bg: 'var(--estado-proceso-bg)',    color: 'var(--estado-proceso-texto)',    label: 'En proceso' },
  asignado:     { bg: 'var(--estado-con-tarea-bg)',  color: 'var(--estado-con-tarea-texto)',  label: 'Asignado' },
  finalizada:   { bg: 'var(--estado-finalizada-bg)', color: 'var(--estado-finalizada-texto)', label: 'Finalizado' },
  rechazada:    { bg: 'var(--estado-rechazada-bg)',  color: 'var(--estado-rechazada-texto)',  label: 'Rechazado' },
  cancelada:    { bg: 'var(--estado-cancelada-bg)',  color: 'var(--estado-cancelada-texto)',  label: 'Cancelado' },
};

const FILTROS_VACIOS = {
  busqueda: '',
  estado: 'todos',
  lugar: 'todos',
  fechaDesde: '',
};

function estiloDeEstado(estado) {
  return ESTILO_ESTADO[estado] ?? { bg: 'var(--color-borde)', color: 'var(--texto-principal)', label: estado };
}

function separarFechaHora(fechaHora) {
  if (!fechaHora) return { fecha: '', hora: '' };
  const [fecha, hora] = fechaHora.split(' ');
  return { fecha: fecha ?? '', hora: hora ? `${hora} hs` : '' };
}

function fechaAISO(fechaHora) {
  if (!fechaHora) return '';
  const [fecha] = fechaHora.split(' ');
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

function MisRequerimientosPage() {
  const usuario = useOutletContext();
  const [requerimientos, setRequerimientos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    obtenerMisRequerimientos()
      .then((data) => {
        if (activo) setRequerimientos(data);
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || 'No se pudieron cargar tus requerimientos.');
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [recarga]);

  const nombreCompleto = `${usuario?.nombre ?? ''} ${usuario?.apellido ?? ''}`.trim();

  const misRequerimientos = useMemo(() => {
    if (usuario?.rol === 'jefeMantenimiento') {
      return requerimientos.filter((r) => r.reportadoPor === nombreCompleto);
    }

    return requerimientos;
  }, [requerimientos, usuario?.rol, nombreCompleto]);

  const lugares = useMemo(
    () => [...new Set(misRequerimientos.map((r) => r.lugar))].sort(),
    [misRequerimientos]
  );

  const filtrados = useMemo(() => {
    return misRequerimientos.filter((req) => {
      const coincideBusqueda =
        !filtros.busqueda ||
        req.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        req.lugar.toLowerCase().includes(filtros.busqueda.toLowerCase());

      const coincideEstado =
        filtros.estado === 'todos' ||
        (req.estado || '').toLowerCase() === filtros.estado.toLowerCase();

      const coincideLugar =
        filtros.lugar === 'todos' || req.lugar === filtros.lugar;

      const coincideFecha =
        !filtros.fechaDesde || fechaAISO(req.fechaHora) >= filtros.fechaDesde;

      return coincideBusqueda && coincideEstado && coincideLugar && coincideFecha;
    });
  }, [misRequerimientos, filtros]);

  const manejarCambioFiltro = (campo, valor) => {
    setFiltros((f) => ({ ...f, [campo]: valor }));
  };

  const limpiar = () => {
    setFiltros(FILTROS_VACIOS);
  };

  const reintentar = () => {
    setCargando(true);
    setError('');
    setRecarga((n) => n + 1);
  };

  return (
    <div className="mis-requerimientos">
      <Encabezado
        icono={FaFileLines}
        titulo="Mis requerimientos"
        subtitulo="Aquí podés ver todos los requerimientos que has emitido"
      />

      <Filtros
        filtros={filtros}
        onCambiar={manejarCambioFiltro}
        onLimpiar={limpiar}
        campos={[
          {
            tipo: 'busqueda',
            clave: 'busqueda',
            placeholder: 'Buscar por título o lugar…',
          },
          {
            tipo: 'select',
            clave: 'estado',
            etiqueta: 'Estado',
            opciones: [
              { valor: 'todos', texto: 'Todos' },
              { valor: 'pendiente', texto: 'Pendiente' },
              { valor: 'en-proceso', texto: 'En proceso' },
              { valor: 'asignado', texto: 'Asignado' },
              { valor: 'finalizada', texto: 'Finalizado' },
              { valor: 'rechazada', texto: 'Rechazado' },
              { valor: 'cancelada', texto: 'Cancelado' },
            ],
          },
          {
            tipo: 'select',
            clave: 'lugar',
            etiqueta: 'Sector',
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
        ]}
      />

      <div className="card border-0 shadow-sm">
        {cargando ? (
          <div className="card-body text-center py-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-3 mb-0">Cargando tus requerimientos...</p>
          </div>
        ) : error ? (
          <div className="card-body text-center py-5">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={reintentar}
            >
              Reintentar
            </button>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="card-body text-center text-muted py-5">
            <p className="mb-1 fw-medium">No tenés requerimientos para mostrar</p>
            <small>Cuando emitas uno, va a aparecer acá.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 mis-requerimientos__tabla">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Lugar</th>
                  <th>Fecha de emisión</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((req) => {
                  const estilo = estiloDeEstado(req.estado);
                  const { fecha, hora } = separarFechaHora(req.fechaHora);

                  return (
                    <tr key={req.id}>
                      <td>
                        <div className="mis-requerimientos__titulo-celda">
                          {req.titulo}
                        </div>
                        <small className="mis-requerimientos__descripcion-celda">
                          {req.descripcion}
                        </small>
                      </td>
                      <td>
                        <span className="mis-requerimientos__lugar">
                          <FaLocationDot size={12} />
                          {req.lugar}
                        </span>
                      </td>
                      <td>
                        <div className="mis-requerimientos__fecha">{fecha}</div>
                        <small className="mis-requerimientos__hora">{hora}</small>
                      </td>
                      <td>
                        <span
                          className="mis-requerimientos__estado"
                          style={{ backgroundColor: estilo.bg, color: estilo.color }}
                        >
                          {estilo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisRequerimientosPage;
