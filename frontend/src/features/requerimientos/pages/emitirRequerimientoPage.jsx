import { useState } from 'react';
import { useNavigate } from 'react-router';
import { guardarRequerimiento } from '../services/requerimientosService';

export default function EmitirRequerimientoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    sector: '',
    lugar: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descripcion.trim() || !formData.lugar.trim()) {
      setError('Por favor completá los campos obligatorios (*).');
      return;
    }

    guardarRequerimiento(formData);
    navigate('/gestor/requerimientos/mis-requerimientos');
  };

  return (
    <div className="container-fluid bg-white p-4 rounded shadow-sm border border-light">
      <h2 style={{ color: 'var(--texto-principal)', fontWeight: 'bold' }}>Emitir requerimiento</h2>
      <p style={{ color: 'var(--texto-secundario)' }}>Contanos qué sucede. El equipo de mantenimiento recibirá el aviso.</p>
      
      {error && (
        <div className="alert p-3 mb-4 rounded" style={{ backgroundColor: 'var(--estado-rechazada-bg)', color: 'var(--estado-rechazada-texto)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Título del problema *</label>
          <input type="text" name="titulo" className="form-control" placeholder="Ej: Fuga de agua en baño" value={formData.titulo} onChange={handleChange} />
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción detallada *</label>
          <textarea name="descripcion" className="form-control" rows="4" placeholder="Describí el problema con la mayor cantidad de detalles posible..." value={formData.descripcion} onChange={handleChange}></textarea>
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label fw-semibold">Sector</label>
            <input type="text" name="sector" className="form-control" placeholder="Ej: Primaria" value={formData.sector} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Lugar específico *</label>
            <input type="text" name="lugar" className="form-control" placeholder="Ej: Baño planta baja" value={formData.lugar} onChange={handleChange} />
          </div>
        </div>

        <div className="d-flex gap-3 pt-3 border-top">
          <button type="button" className="btn btn-light border" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn text-white" style={{ backgroundColor: 'var(--color-secundario)' }}>
            Emitir requerimiento
          </button>
        </div>
      </form>
    </div>
  );
}