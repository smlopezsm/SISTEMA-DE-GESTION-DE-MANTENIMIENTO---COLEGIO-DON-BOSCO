// src/features/perfil/pages/PerfilPage.jsx
import { useOutletContext, useNavigate } from 'react-router';
import { FaUser, FaShieldHalved, FaPen, FaCircleInfo } from 'react-icons/fa6';
import { ETIQUETA_ROL } from '../../../shared/config/MenuPorRol';
import {
  camposDeRol,
  ETIQUETA_CAMPO,
} from '../../../shared/config/camposPerfilPorRol';
import '../styles/PerfilPage.css';

const CAMPOS_DESTACADOS = ['email'];

function iniciales(nombre, apellido) {
  const n = (nombre || '').trim()[0] ?? '';
  const a = (apellido || '').trim()[0] ?? '';
  return `${n}${a}`.toUpperCase() || '?';
}

export default function PerfilPage() {
  const usuario = useOutletContext();
  const navigate = useNavigate();

  if (!usuario) {
    return <p className="text-secondary">Cargando perfil…</p>;
  }

  const campos = camposDeRol(usuario.rol);
  const rolEtiqueta = ETIQUETA_ROL?.[usuario.rol] ?? usuario.rol;

  return (
    <div className="perfil-page">
      <div className="perfil-page__encabezado">
        <h1 className="perfil-page__titulo">Perfil del usuario</h1>
        <p className="perfil-page__subtitulo">
          Visualizá y gestioná la información de tu perfil.
        </p>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-4">
          <div className="row g-4">
            {/* Columna izquierda */}
            <div className="col-12 col-md-4 col-lg-3 text-center">
              <div className="perfil-page__avatar">
                {usuario.avatar ? (
                  <img src={usuario.avatar} alt="Avatar" />
                ) : (
                  <span>{iniciales(usuario.nombre, usuario.apellido)}</span>
                )}
              </div>

              <h2 className="perfil-page__nombre">
                {usuario.nombre} {usuario.apellido}
              </h2>
              <p className="perfil-page__rol">{rolEtiqueta}</p>

              <ul className="perfil-page__resumen">
                <li>
                  <FaUser />
                  <span>Usuario: <strong>{usuario.usuario}</strong></span>
                </li>
                <li>
                  <FaShieldHalved />
                  <span>Rol: <strong>{rolEtiqueta}</strong></span>
                </li>
              </ul>
            </div>

            {/* Columna derecha */}
            <div className="col-12 col-md-8 col-lg-9">
              <div className="perfil-page__datos-header">
                <h3 className="perfil-page__datos-titulo">
                  <FaUser /> Datos personales
                </h3>
                <button
                  type="button"
                  className="btn btn-primary perfil-page__btn-editar"
                  onClick={() => navigate('/gestor/perfil/editar')}
                >
                  <FaPen size={12} /> Editar perfil
                </button>
              </div>

              <ul className="perfil-page__datos">
                {campos.map((campo) => (
                  <li key={campo}>
                    <span className="perfil-page__campo-label">
                      {ETIQUETA_CAMPO[campo]}
                    </span>
                    <span
                      className={
                        CAMPOS_DESTACADOS.includes(campo)
                          ? 'perfil-page__campo-valor perfil-page__campo-valor--destacado'
                          : 'perfil-page__campo-valor'
                      }
                    >
                      {usuario[campo] || '—'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="perfil-page__nota">
        <FaCircleInfo />
        <span>
          Mantené tus datos actualizados para facilitar la comunicación y el
          correcto funcionamiento del sistema.
        </span>
      </div>
    </div>
  );
}