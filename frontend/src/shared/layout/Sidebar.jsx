//menu lateral para el area privada que muestra las opciones a los usuarios segun su rol
import { useState } from 'react';
import { NavLink } from 'react-router';
import { FaBars } from 'react-icons/fa6';
import { MENU_POR_ROL, ETIQUETA_ROL } from './MenuPorRol';
import './Sidebar.css';

function Sidebar({ usuario }) {

  //es para el menu hamburguesa por si esta desplegado o no
  const [abierta, setAbierta] = useState(false);

  // tomamos las opciones del menu segun el rol del usuario
  // El ?? [] es un fallback: si el rol no existe, devuelve array vacio
  const opciones = MENU_POR_ROL[usuario.rol] ?? [];

  return (
    <>
      <div className={`sidebar ${abierta ? 'active' : ''}`}>
        <img src="/assets/colegio/logo2.png" alt="Logo Colegio Don Bosco" className="logo mb-2" />

        <button
          className="hamburger btn btn-link text-white p-0"
          onClick={() => setAbierta(!abierta)}
          aria-label="Abrir o cerrar menú"
        >
          <FaBars size={28} />
        </button>

        {/*lista las opciones dinaicamente segun el rol desde el menu por rol*/}
        <ul className="nav flex-column">
          {opciones.map((opcion) => {
            const Icono = opcion.icono;
            return (
              <li className="nav-item" key={opcion.id}>
                <NavLink
                  to={opcion.destino}
                  end={opcion.exacta}
                  className="nav-link text-white"
                  onClick={() => setAbierta(false)}
                >
                  <Icono className="me-2" />
                  {opcion.texto}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="user-profile text-center">
          <div className="avatar mx-auto"></div>
          <span className="d-block">{usuario.nombre} {usuario.apellido}</span>
          <small className="d-block text-white-50">{ETIQUETA_ROL[usuario.rol]}</small>
        </div>
      </div>

      <div
        className="sidebar-overlay"
        style={{ display: abierta ? 'block' : 'none' }}
        onClick={() => setAbierta(false)}
      ></div>
    </>
  );
}

export default Sidebar;