// src/features/requerimientos/pages/MisRequerimientosPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router';
import {
  FaFileLines,
  FaMagnifyingGlass,
  FaLocationDot,
  FaEye,
} from 'react-icons/fa6';
import { obtenerRequerimientos } from '../services/requerimientosService';
import '../styles/MisRequerimientosPage.css';

// ─────────────────────────────────────────────
// Estilos por estado (fondo + color de texto)
// ─────────────────────────────────────────────
const ESTILO_ESTADO = {
  pendiente: { bg: 'var(--estado-pendiente-bg)', color: 'var(--estado-pendiente-texto)', label: 'Pendiente' },
  nuevo:     { bg: 'var(--estado-proceso-bg)',   color: 'var(--estado-proceso-texto)',   label: 'Nuevo' },
  'en-proceso': { bg: 'var(--estado-proceso-bg)', color: 'var(--estado-proceso-texto)', label: 'En proceso' },
  asignado:  { bg: 'var(--estado-con-tarea-bg)', color: 'var(--estado-con-tarea-texto)', label: 'Asignado' },
  finalizada:{ bg: 'var(--estado-finalizada-bg)',color: 'var(--estado-finalizada-texto)',label: 'Finalizado' },
  rechazada: { bg: 'var(--estado-rechazada-bg)', color: 'var(--estado-rechazada-texto)', label: 'Rechazado' },
  cancelada: { bg: 'var(--estado-cancelada-bg)', color: 'var(--estado-cancelada-texto)', label: 'Cancelado' },
};

function estiloDeEstado(estado) {
  return ESTILO_ESTADO[estado] ?? { bg: 'var(--color-borde)', color: 'var(--texto-principal)', label: estado };
}

// ─────────────────────────────────────────────
// Separa "25/06/2025 09:12" → { fecha, hora }
// ─────────────────────────────────────────────
function separarFechaHora(fechaHora) {
  if (!fechaHora) return { fecha: '', hora: '' };
  const [fecha, hora] = fechaHora.split(' ');
  return { fecha: fecha ?? '', hora: hora ? `${hora} hs` : '' };
}

// ─────────────────────────────────────────────
// Convierte "25/06/2025 09:12" → "2025-06-25" (para comparar con <input type="date">)
// ─────────────────────────────────────────────
function fechaAISO(fechaHora) {
  if (!fechaHora) return '';
  const [fecha] = fechaHora.split(' ');
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

function MisRequerimientosPage() {
  const usuario = useOutletContext();
  const [requerimientos, setRequerimientos] = useState([]);

  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: 'todos',
    lugar: 'todos',
    fechaDesde: '',
  });

  useEffect(() => {
    setRequerimientos(obtenerRequerimientos());
  }, []);

  // Solo los del usuario logueado
  const misRequerimientos = useMemo(
    () => requerimientos.filter((r) => r.reportadoPor === usuario?.nombre),
    [requerimientos, usuario]
  );

  // Lista única de lugares (para el filtro)
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

  // Cambiar un filtro
  const cambiarFiltro = (campo, valor) => {
    setFiltros((f) => ({ ...f, [campo]: valor }));
  };

  return (
    <div className="mis-requerimientos">
      {/* ─────────── Encabezado ─────────── */}
      <div className="d-flex gap-3 align-items-start mb-4">
        <div className="mis-requerimientos__icono">
          <FaFileLines size={22} />
        </div>
        <div>
          <h1 className="mis-requerimientos__titulo">Mis requerimientos</h1>
          <p className="mis-requerimientos__subtitulo">
            Aquí podés ver todos los requerimientos que has emitido.
          </p>
        </div>
      </div>

      {/* ─────────── Filtros ─────────── */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-3 align-items-end">
            {/* Buscar */}
            <div className="col-12 col-md-4">
              <div className="mis-requerimientos__busqueda">
                <FaMagnifyingGlass className="mis-requerimientos__busqueda-icono" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título o lugar..."
                  value={filtros.busqueda}
                  onChange={(e) => cambiarFiltro('busqueda', e.target.value)}
                />
              </div>
            </div>

            {/* Estado */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="mis-requerimientos__filtro-label">Estado</label>
              <select
                className="form-select"
                value={filtros.estado}
                onChange={(e) => cambiarFiltro('estado', e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en-proceso">En proceso</option>
                <option value="asignado">Asignado</option>
                <option value="finalizada">Finalizado</option>
                <option value="rechazada">Rechazado</option>
              </select>
            </div>

            {/* Lugar */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="mis-requerimientos__filtro-label">Lugar</label>
              <select
                className="form-select"
                value={filtros.lugar}
                onChange={(e) => cambiarFiltro('lugar', e.target.value)}
              >
                <option value="todos">Todos</option>
                {lugares.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Fecha desde */}
            <div className="col-12 col-sm-6 col-md-2">
              <label className="mis-requerimientos__filtro-label">Fecha desde</label>
              <input
                type="date"
                className="form-control"
                value={filtros.fechaDesde}
                onChange={(e) => cambiarFiltro('fechaDesde', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── Tabla ─────────── */}
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