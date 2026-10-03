import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { FaPlus, FaUsers, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import '../styles/PersonalExternoPage.css';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';
import { obtenerPersonal, eliminarPersonal, } from '../services/personalService';
import { useToast } from '../../../shared/context/ToastContext';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';
import Filtros from '../../../shared/components/Filtros';
import TablaPersonal from '../components/TablaPersonal';

const POR_PAGINA = 8;
const FILTROS_INICIALES = { busqueda: '', especialidad: 'todas', estado: 'todos' };

function PersonalExternoPage() {
  const { mostrarToast } = useToast();

  const [todoElPersonal, setTodoElPersonal] = useState(() => obtenerPersonal());
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [pagina, setPagina] = useState(1);

  const [modalEliminar, setModalEliminar] = useState({
    abierto: false,
    persona: null,
  });

  const especialidades = useMemo(() => {
    const lista = todoElPersonal.map((p) => p.especialidad);
    return [...new Set(lista)].sort();
  }, [todoElPersonal]);

  function manejarCambioFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    setPagina(1);
  }

  const personalFiltrado = useMemo(() => {
    return todoElPersonal.filter((p) => {

      const busqueda = filtros.busqueda.toLowerCase();

      const coincideBusqueda = busqueda === '' || p.nombre?.toLowerCase().includes(busqueda) || p.apellido?.toLowerCase().includes(busqueda) || p.especialidad?.toLowerCase().includes(busqueda);

      const coincideEspecialidad = filtros.especialidad === 'todas' || p.especialidad === filtros.especialidad;

      const coincideEstado =
        filtros.estado === 'todos' ||
        (filtros.estado === 'activos' && p.activo) ||
        (filtros.estado === 'inactivos' && !p.activo);

      return coincideBusqueda && coincideEspecialidad && coincideEstado;
    });
  }, [todoElPersonal, filtros]);

  const totalPaginas = Math.max(1, Math.ceil(personalFiltrado.length / POR_PAGINA));
  const personalPagina = personalFiltrado.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  function abrirModalEliminar(persona) {
    setModalEliminar({ abierto: true, persona });
  }

  function cerrarModalEliminar() {
    setModalEliminar({ abierto: false, persona: null });
  }

  function confirmarEliminar() {
    const persona = modalEliminar.persona;
    if (persona) {
      eliminarPersonal(persona.id);
      setTodoElPersonal(obtenerPersonal());
      mostrarToast(`Se eliminó a ${persona.nombre} ${persona.apellido}`, 'success');
    }
    cerrarModalEliminar();
  }

  return (
    <div className="personal-page">

      <EncabezadoPagina
        icono={FaUsers}
        titulo="Editar Usuario"
        subtitulo="Gestion del personal externo"
      >
        <Link to="/gestor/personal-externo/nuevo" className="btn btn-primary"> <FaPlus className="me-2" />
          Agregar nuevo personal
        </Link>
      </EncabezadoPagina>

      <Filtros
        filtros={filtros}
        onCambiar={manejarCambioFiltro}
        campos={[
          {
            tipo: 'busqueda',
            clave: 'busqueda',
            placeholder: 'Buscar por nombre, apellido o especialidad…',
          },
          {
            tipo: 'select',
            clave: 'especialidad',
            etiqueta: 'Especialidad',
            opciones: [
              { valor: 'todas', texto: 'Todas' },
              ...especialidades.map((esp) => ({ valor: esp, texto: esp })),
            ],
          },
          {
            tipo: 'select',
            clave: 'estado',
            etiqueta: 'Estado',
            opciones: [
              { valor: 'todos', texto: 'Todos' },
              { valor: 'activos', texto: 'Activos' },
              { valor: 'inactivos', texto: 'Inactivos' },
            ],
          },
        ]}
      />
      <TablaPersonal personal={personalPagina} onEliminar={abrirModalEliminar} />

      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <small className="text-muted">
          Mostrando {personalPagina.length} de {personalFiltrado.length} personas
        </small>

        {totalPaginas > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
                <button type="button" className="page-link" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} >
                  <FaChevronLeft size={12} />
                </button>
              </li>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <li key={n} className={`page-item ${pagina === n ? 'active' : ''}`}>
                  <button type="button" className="page-link" onClick={() => setPagina(n)}> {n} </button>
                </li>
              ))}
              <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
                <button type="button" className="page-link" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} >
                  <FaChevronRight size={12} />
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* confirmacion de eliminacion */}
      <ModalConfirmacion
        abierto={modalEliminar.abierto}
        titulo="Eliminar personal externo"
        mensaje={
          modalEliminar.persona
            ? `¿Estás seguro que quieres eliminar a ${modalEliminar.persona.nombre} ${modalEliminar.persona.apellido}? Esta accion no se puede deshacer`
            : ''
        }
        textoConfirmar="Eliminar"
        variante="danger"
        onConfirmar={confirmarEliminar}
        onCancelar={cerrarModalEliminar}
      />
    </div>
  );
}

export default PersonalExternoPage;