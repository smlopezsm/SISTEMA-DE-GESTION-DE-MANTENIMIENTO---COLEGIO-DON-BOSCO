// Bloque del usuario en el header: avatar, nombre, rol y menú desplegable.

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { FaChevronDown, FaUser, FaRightFromBracket } from 'react-icons/fa6';
import { ETIQUETA_ROL } from "../../config/MenuPorRol";
import './MenuUsuario.css';

function MenuUsuario({ usuario, onCerrarSesion }) {
  const [abierto, setAbierto] = useState(false);
  const refContenedor = useRef(null);

  // cerrar al hacer click afuera
  useEffect(() => {
    if (!abierto) return;

    function handleClickFuera(e) {
      if (refContenedor.current && !refContenedor.current.contains(e.target)) {
        setAbierto(false);
      }
    }

    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, [abierto]);

  // cerrar con la tecla Esc
  useEffect(() => {
    if (!abierto) return;

    function handleEscape(e) {
      if (e.key === 'Escape') setAbierto(false);
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [abierto]);

  // iniciales del usuario
  const iniciales =
    `${usuario?.nombre?.[0] ?? ''}${usuario?.apellido?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="menu-usuario" ref={refContenedor}>
      <button
        type="button"
        className="menu-usuario__trigger"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
      >
        <div className="menu-usuario__avatar">
          {iniciales || <FaUser size={14} />}
        </div>

        <div className="menu-usuario__datos d-none d-sm-flex">
          <span className="menu-usuario__nombre">
            {usuario?.nombre} {usuario?.apellido}
          </span>
          <span className="menu-usuario__rol">
            {ETIQUETA_ROL[usuario?.rol] ?? usuario?.rol}
          </span>
        </div>

        <FaChevronDown
          size={12}
          className={`menu-usuario__chevron ${abierto ? 'menu-usuario__chevron--abierto' : ''}`}
        />
      </button>

      {abierto && (
        <div className="menu-usuario__dropdown" role="menu">
          <Link
            to="/gestor/perfil"
            className="menu-usuario__item"
            onClick={() => setAbierto(false)}
            role="menuitem"
          >
            <FaUser size={14} /> Editar perfil
          </Link>

          <hr className="menu-usuario__divider" />

        
          <button
            type="button"
            className="menu-usuario__item menu-usuario__item--danger"
            onClick={() => {
              setAbierto(false);
              onCerrarSesion?.();
            }}
            role="menuitem"
          >
            <FaRightFromBracket size={14} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuUsuario;