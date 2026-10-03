import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { FaMagnifyingGlass, FaLocationDot, FaEye } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import Paginacion from '../../../shared/components/Paginacion';
import { normalizar } from '../../../shared/utils/texto';
import Filtros from '../../../shared/components/Filtros';
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
      <Filtros
        filtros={filtros}
        onCambiar={(campo, valor) => {
          setFiltros((f) => ({ ...f, [campo]: valor }));
          setPagina(1);
        }}
        campos={[
          {
            tipo: 'busqueda',
            clave: 'busqueda',
            placeholder: 'Buscar por ID, título o lugar…',
          },
          {
            tipo: 'select',
            clave: 'lugar',
            etiqueta: 'Filtrar por lugar',
            opciones: [
              { valor: '', texto: 'Todos' },
              ...lugares.map((l) => ({ valor: l, texto: l })),
            ],
          },
          {
            tipo: 'fecha',
            clave: 'fecha',
            etiqueta: 'Fecha de finalización',
          },
        ]}
      />

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
