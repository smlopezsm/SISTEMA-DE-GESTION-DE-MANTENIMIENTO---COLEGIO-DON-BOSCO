import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { FaUsers, FaUser, FaUserTie, FaScrewdriverWrench, FaMagnifyingGlass, FaPlus, FaFilterCircleXmark } from 'react-icons/fa6';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';
import TarjetaResumen from '../../../shared/components/TarjetaResumen';
import SeccionCard from '../../../shared/components/SeccionCard';
import Paginacion from '../../../shared/components/Paginacion';
import { ETIQUETA_ROL } from '../../../shared/config/MenuPorRol';
import { normalizar } from '../../../shared/utils/texto';
import TablaUsuarios from '../components/TablaUsuarios';
import { obtenerUsuarios } from '../services/usuariosService';
import Filtros from '../../../shared/components/Filtros';
import '../styles/Usuarios.css';

const POR_PAGINA = 8;
const FILTROS_VACIOS = { busqueda: '', rol: '', estado: '' };

function UsuariosPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    obtenerUsuarios().then(setUsuarios);
  }, [location.key]);

  const cantidad = (rol) => usuarios.filter((u) => u.rol === rol).length;

  const manejarCambioFiltro = (campo, valor) => {
    setFiltros((f) => ({ ...f, [campo]: valor }));
    setPagina(1);
  };

  const filtrados = useMemo(() => {
    const texto = normalizar(filtros.busqueda);
    return usuarios.filter(
      (u) =>
        (!texto || normalizar(`${u.nombre} ${u.apellido} ${u.usuario} ${u.dni}`).includes(texto)) &&
        (!filtros.rol || u.rol === filtros.rol) &&
        (!filtros.estado || String(u.activo) === filtros.estado)
    );
  }, [usuarios, filtros]);

  const limpiar = () => {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  };

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + POR_PAGINA);

  const handleAgregar = () => {
    navigate('/gestor/usuarios/nuevo');
  };

  const handleEditar = (usuario) => {
    navigate(`/gestor/usuarios/${usuario.clave}`);
  };

  return (
    <>
      <EncabezadoPagina
        icono={FaUsers}
        titulo="Gestión de Usuarios"
        subtitulo="Administración de cuentas del personal del colegio"
      >
        <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={handleAgregar}>
          <FaPlus /> Agregar usuario
        </button>
      </EncabezadoPagina>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col"><TarjetaResumen tono="cancelada" icono={FaUsers} etiqueta="Total de usuarios" valor={usuarios.length} /></div>
        <div className="col"><TarjetaResumen tono="finalizada" icono={FaUser} etiqueta="Ordenanzas" valor={cantidad('ordenanza')} /></div>
        <div className="col"><TarjetaResumen tono="en-proceso" icono={FaUserTie} etiqueta="Directivos" valor={cantidad('directivo')} /></div>
        <div className="col"><TarjetaResumen tono="con-tarea" icono={FaScrewdriverWrench} etiqueta="Jefes de Mantenimiento" valor={cantidad('jefeMantenimiento')} /></div>
      </div>

      <SeccionCard>
        <Filtros
          filtros={filtros}
          onCambiar={manejarCambioFiltro}
          onLimpiar={limpiar}
          campos={[
            {
              tipo: 'busqueda',
              clave: 'busqueda',
              placeholder: 'Buscar por nombre, apellido, usuario o DNI…',
            },
            {
              tipo: 'select',
              clave: 'rol',
              etiqueta: 'Rol',
              opciones: [
                { valor: '', texto: 'Todos' },
                ...Object.entries(ETIQUETA_ROL).map(([rol, texto]) => ({ valor: rol, texto })),
              ],
            },
            {
              tipo: 'select',
              clave: 'estado',
              etiqueta: 'Estado',
              opciones: [
                { valor: '', texto: 'Todos' },
                { valor: 'true', texto: 'Activo' },
                { valor: 'false', texto: 'Inactivo' },
              ],
            },
          ]}
        />

        <TablaUsuarios usuarios={visibles} onEditar={handleEditar} />

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
          <small className="text-secondary">
            Mostrando {filtrados.length ? inicio + 1 : 0} - {inicio + visibles.length} de {filtrados.length} usuarios
          </small>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </div>
      </SeccionCard>
    </>
  );
}

export default UsuariosPage;