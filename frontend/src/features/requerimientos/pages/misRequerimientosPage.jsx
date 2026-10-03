import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { FaFileLines, FaLocationDot } from 'react-icons/fa6';
import Encabezado from '../../../shared/components/EncabezadoPagina';
import Filtros from '../../../shared/components/Filtros';
import { obtenerRequerimientos } from '../services/requerimientosService';
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

  useEffect(() => {
    setRequerimientos(obtenerRequerimientos());
  }, []);

  // Solo los del usuario logueado
  const misRequerimientos = useMemo(
    () => requerimientos.filter((r) => r.reportadoPor === usuario?.nombre),
    [requerimientos, usuario]
  );

  // Lista única de sectores
  const lugares = useMemo(
    () => [...new Set(misRequerimientos.map((r) => r.lugar))].sort(),
    [misRequerimientos]
  );

  // Filtrado
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

  return (
    <div className="mis-requerimientos">
      {/* Encabezado unificado */}
      <Encabezado
        icono={FaFileLines}
        titulo="Mis requerimientos"
        subtitulo="Aquí podés ver todos los requerimientos que has emitido"
      />

      {/* Filtros unificados */}
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

      {/* Tabla */}
      <div className="card border-0 shadow-sm">
        {filtrados.length === 0 ? (
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