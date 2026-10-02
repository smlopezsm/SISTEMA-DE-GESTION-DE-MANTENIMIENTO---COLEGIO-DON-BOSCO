import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { FaMagnifyingGlass, FaLocationDot, FaEye } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import Paginacion from '../../../shared/components/Paginacion';
import { normalizar } from '../../../shared/utils/texto';

const POR_PAGINA = 5;

const formatoFecha = (iso) =>
  new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function TablaEvaluacion({ tareas }) {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({ busqueda: '', lugar: '', fecha: '' });
  const [pagina, setPagina] = useState(1);

  const lugares = useMemo(() => [...new Set(tareas.map((t) => t.lugar))].sort(), [tareas]);

  const filtradas = useMemo(() => {
    const texto = normalizar(filtros.busqueda);
    return tareas.filter(
      (t) =>
        (!texto || normalizar(`${t.id} ${t.titulo} ${t.requerimientoId} ${t.lugar}`).includes(texto)) &&
        (!filtros.lugar || t.lugar === filtros.lugar) &&
        (!filtros.fecha || t.fechaFinalizacion.slice(0, 10) === filtros.fecha)
    );
  }, [tareas, filtros]);

  const cambiar = (campo) => (e) => {
    setFiltros((f) => ({ ...f, [campo]: e.target.value }));
    setPagina(1);
  };

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + POR_PAGINA);

  return (
    <>
      <div className="filtros-evaluacion">
        <div className="filtros-evaluacion__busqueda">
          <FaMagnifyingGlass aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por ID, título o lugar…"
            value={filtros.busqueda}
            onChange={cambiar('busqueda')}
            aria-label="Buscar tareas"
          />
        </div>
        <label className="filtros-evaluacion__campo">
          <span>Filtrar por lugar</span>
          <select className="form-select" value={filtros.lugar} onChange={cambiar('lugar')}>
            <option value="">Todos</option>
            {lugares.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="filtros-evaluacion__campo">
          <span>Fecha de finalización</span>
          <input type="date" className="form-control" value={filtros.fecha} onChange={cambiar('fecha')} />
        </label>
      </div>

      <div className="table-responsive">
        <table className="table align-middle tabla-evaluacion">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título de la tarea / Requerimiento</th>
              <th>Lugar</th>
              <th>Responsable</th>
              <th>Fecha de finalización</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-secondary py-4">
                  No hay tareas que coincidan con los filtros.
                </td>
              </tr>
            )}
            {visibles.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  <strong>{t.titulo}</strong>
                  <small className="d-block text-secondary">{t.requerimientoId}</small>
                </td>
                <td>
                  <FaLocationDot className="tabla-evaluacion__pin" /> {t.lugar}
                </td>
                <td>
                  {t.responsable}
                  <small className="d-block text-secondary">({t.tipoResponsable})</small>
                </td>
                <td>{formatoFecha(t.fechaFinalizacion)}</td>
                <td><Etiqueta estado={t.estado}>Finalizada</Etiqueta></td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                    onClick={() => navigate(`/gestor/tareas/${t.id}`)}
                  >
                    <FaEye /> Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <small className="text-secondary">
          Mostrando {filtradas.length ? inicio + 1 : 0} - {inicio + visibles.length} de {filtradas.length} tareas
        </small>
        <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
      </div>
    </>
  );
}

export default TablaEvaluacion;
