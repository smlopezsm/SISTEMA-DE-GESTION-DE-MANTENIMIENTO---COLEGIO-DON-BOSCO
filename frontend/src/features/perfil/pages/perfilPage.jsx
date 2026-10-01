import { useOutletContext, useNavigate } from 'react-router';
import { ETIQUETA_ROL } from '../../../shared/config/MenuPorRol';
export default function PerfilPage() {
  const usuario = useOutletContext(); // Viene de <Outlet context={usuario} /> en LayoutGestor
  const navigate = useNavigate();

  return (
    <div className="container-fluid d-flex justify-content-center align-items-start pt-4">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: '600px', borderRadius: 'var(--radius-medium)' }}>
        <div className="card-header bg-white border-bottom p-4 text-center">
          <h3 className="mb-0 fw-bold" style={{ color: 'var(--texto-principal)' }}>Mi Perfil</h3>
        </div>
        <div className="card-body p-0">
          <ul className="list-group list-group-flush">
            <li className="list-group-item p-3 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-secondary">Nombre completo:</span>
              <span style={{ color: 'var(--texto-principal)' }}>{usuario?.nombre} {usuario?.apellido}</span>
            </li>
            <li className="list-group-item p-3 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-secondary">DNI:</span>
              <span style={{ color: 'var(--texto-principal)' }}>{usuario?.dni || 'No registrado'}</span>
            </li>
            <li className="list-group-item p-3 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-secondary">Email:</span>
              <span style={{ color: 'var(--texto-principal)' }}>{usuario?.email || 'No registrado'}</span>
            </li>
            <li className="list-group-item p-3 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-secondary">Teléfono:</span>
              <span style={{ color: 'var(--texto-principal)' }}>{usuario?.telefono || 'No registrado'}</span>
            </li>
            <li className="list-group-item p-3 d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-secondary">Rol:</span>
              <span className="badge px-3 py-2" style={{ backgroundColor: 'var(--estado-con-tarea-bg)', color: 'var(--estado-con-tarea-texto)' }}>
                {ETIQUETA_ROL?.[usuario?.rol] || usuario?.rol}
              </span>
            </li>
          </ul>
        </div>
        <div className="card-footer bg-white p-4 border-top text-center">
          <button 
            className="btn text-white px-4" 
            style={{ backgroundColor: 'var(--color-secundario)' }}
            onClick={() => navigate('/gestor/perfil/editar')}
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}