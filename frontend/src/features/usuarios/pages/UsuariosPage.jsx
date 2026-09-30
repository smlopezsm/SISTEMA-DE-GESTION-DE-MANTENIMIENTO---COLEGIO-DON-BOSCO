import { useEffect, useMemo, useState } from 'react';
import { FaUsers, FaUser, FaUserTie, FaScrewdriverWrench, FaMagnifyingGlass, FaPlus, FaFilterCircleXmark } from 'react-icons/fa6';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';
import TarjetaResumen from '../../../shared/components/TarjetaResumen';
import SeccionCard from '../../../shared/components/SeccionCard';
import Paginacion from '../../../shared/components/Paginacion';
import { ETIQUETA_ROL } from '../../../shared/config/MenuPorRol';
import { normalizar } from '../../../shared/utils/texto';
import TablaUsuarios from '../components/TablaUsuarios';
import { obtenerUsuarios } from '../services/usuariosService';
import '../styles/usuarios.css';

const POR_PAGINA = 8;
const FILTROS_VACIOS = { busqueda: '', rol: '', estado: '' };

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    obtenerUsuarios().then(setUsuarios);
  }, []);

  const cantidad = (rol) => usuarios.filter((u) => u.rol === rol).length;

  const filtrados = useMemo(() => {
    const texto = normalizar(filtros.busqueda);
    return usuarios.filter(
      (u) =>
        (!texto || normalizar(`${u.nombre} ${u.apellido} ${u.usuario} ${u.dni}`).includes(texto)) &&
        (!filtros.rol || u.rol === filtros.rol) &&
        (!filtros.estado || String(u.activo) === filtros.estado)
    );
  }, [usuarios, filtros]);

  const cambiar = (campo) => (e) => {
    setFiltros((f) => ({ ...f, [campo]: e.target.value }));
    setPagina(1);
  };

  const limpiar = () => {
    setFiltros(FILTROS_VACIOS);
    setPagina(1);
  };

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + POR_PAGINA);

  // TODO: abrir el formulario de alta/edición cuando esté hecho
  const handleAgregar = () => {};
  const handleEditar = () => {};

  // TODO: reemplazar por la llamada a la API. Por ahora solo actualiza el estado local.
  const handleBaja = (usuario) => {
    if (!window.confirm(`¿Dar de baja a ${usuario.nombre} ${usuario.apellido}?`)) return;
    setUsuarios((lista) => lista.map((u) => (u.clave === usuario.clave ? { ...u, activo: false } : u)));
  };

  return (
    <>
      <EncabezadoPagina
        icono={FaUsers}
        titulo="Gestión de usuarios"
        subtitulo="Administrá las cuentas del personal del colegio."
      >
        <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={handleAgregar}>
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
        <div className="filtros-usuarios">
          <div className="filtros-usuarios__busqueda">
            <FaMagnifyingGlass aria-hidden="true" />
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por nombre, apellido, usuario o DNI…"
              value={filtros.busqueda}
              onChange={cambiar('busqueda')}
              aria-label="Buscar usuarios"
            />
          </div>
          <label>
            <span>Rol</span>
            <select className="form-select" value={filtros.rol} onChange={cambiar('rol')}>
              <option value="">Todos</option>
              {Object.entries(ETIQUETA_ROL)
                .map(([rol, texto]) => (
                  <option key={rol} value={rol}>{texto}</option>
                ))}
            </select>
          </label>
          <label>
            <span>Estado</span>
            <select className="form-select" value={filtros.estado} onChange={cambiar('estado')}>
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </label>
          <button type="button" className="btn btn-outline-primary d-inline-flex align-items-center justify-content-center gap-2" onClick={limpiar}>
            <FaFilterCircleXmark /> Limpiar filtros
          </button>
        </div>

        <TablaUsuarios usuarios={visibles} onEditar={handleEditar} onBaja={handleBaja} />

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
