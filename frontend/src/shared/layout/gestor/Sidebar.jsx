//barra lateral para los usuarios
import { useState } from 'react';
import { NavLink } from 'react-router';
import { FaBars } from 'react-icons/fa6';
import { MENU_POR_ROL, ETIQUETA_ROL, ICONO_ROL } from '../../config/MenuPorRol';
import './Sidebar.css';

function Sidebar({ usuario }) {
  const [abierta, setAbierta] = useState(false);
  const opciones = MENU_POR_ROL[usuario.rol] ?? [];

  const IconoRol = ICONO_ROL[usuario.rol] ?? FaUser;

  return (
    <>
      <aside className={`sidebar ${abierta ? 'sidebar--abierta' : ''}`}>
        {/* logo */}
        <img
          src="/assets/colegio/logo2.png"
          alt="Logo Colegio Don Bosco"
          className="sidebar__logo"
        />

        {/* Boton hamburguesa */}
        <button
          type="button"
          className="sidebar__hamburger btn btn-link text-white p-0"
          onClick={() => setAbierta((v) => !v)}
          aria-label={abierta ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierta}
        >
          <FaBars size={24} />
        </button>

        {/* Navegacion */}
        <ul className="nav flex-column sidebar__nav">
          {opciones.map((opcion) => {
            const Icono = opcion.icono;
            return (
              <li className="nav-item" key={opcion.id}>
                <NavLink
                  to={opcion.destino}
                  end={opcion.exacta}
                  className="nav-link"
                  onClick={() => setAbierta(false)}
                >
                  <Icono className="me-2" />
                  <span className="sidebar__texto">{opcion.texto}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* perfil abajo */}
        <div className="sidebar__perfil">
          <div className="sidebar__avatar">
            <IconoRol size={22} />
          </div>
          <span className="d-block">
            {usuario.nombre} {usuario.apellido}
          </span>
          <small className="d-block text-white-50">
            {ETIQUETA_ROL[usuario.rol]}
          </small>
        </div>
      </aside>

      {abierta && (
        <div className="sidebar-overlay d-lg-none" onClick={() => setAbierta(false)}></div>
      )}
    </>
  );
}

export default Sidebar;