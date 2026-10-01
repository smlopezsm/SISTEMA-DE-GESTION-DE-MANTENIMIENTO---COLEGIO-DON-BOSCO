import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { actualizarUsuario } from '../services/perfilService';

export default function EditarPerfilPage() {
  const usuarioActual = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });

  useEffect(() => {
    if (usuarioActual) {
      setFormData({
        nombre: usuarioActual.nombre || '',
        apellido: usuarioActual.apellido || '',
        email: usuarioActual.email || '',
        telefono: usuarioActual.telefono || ''
      });
    }
  }, [usuarioActual]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizarUsuario(formData);
    
    // Forzamos una recarga para que protegerRuta vuelva a leer el localStorage 
    // y propague los datos frescos a Header, Sidebar y PerfilPage.
    window.location.href = '/gestor/perfil'; 
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-start pt-4">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: '600px', borderRadius: 'var(--radius-medium)' }}>
        <div className="card-header bg-white border-bottom p-4">
          <h3 className="mb-0 fw-bold" style={{ color: 'var(--texto-principal)' }}>Editar Perfil</h3>
        </div>
        
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-sm-6">
                <label className="form-label fw-semibold text-secondary">Nombre</label>
                <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="col-sm-6 mt-3 mt-sm-0">
                <label className="form-label fw-semibold text-secondary">Apellido</label>
                <input type="text" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Correo Electrónico</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">Teléfono</label>
              <input type="tel" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
            </div>

            <div className="d-flex gap-3 pt-3 border-top justify-content-end">
              <button type="button" className="btn btn-light border px-4" onClick={() => navigate('/gestor/perfil')}>
                Cancelar
              </button>
              <button type="submit" className="btn text-white px-4" style={{ backgroundColor: 'var(--estado-aprobada-solid)' }}>
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}