import { useState, useEffect } from 'react';
import { getRequerimientos } from '../services/requerimientosService';

export default function MisRequerimientosPage() {
  const [requerimientos, setRequerimientos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    setRequerimientos(getRequerimientos());
  }, []);

  const requerimientosFiltrados = requerimientos.filter(req => 
    req.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
    req.lugar.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstiloEstado = (estado) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'pendiente' || estadoLower === 'nuevo') return { bg: 'var(--estado-pendiente-bg)', color: 'var(--estado-pendiente-texto)' };
    if (estadoLower === 'en proceso') return { bg: 'var(--estado-proceso-bg)', color: 'var(--estado-proceso-texto)' };
    if (estadoLower === 'asignado' || estadoLower === 'con tarea') return { bg: 'var(--estado-con-tarea-bg)', color: 'var(--estado-con-tarea-texto)' };
    if (estadoLower === 'finalizada' || estadoLower === 'finalizado') return { bg: 'var(--estado-finalizada-bg)', color: 'var(--estado-finalizada-texto)' };
    if (estadoLower === 'rechazada' || estadoLower === 'rechazado') return { bg: 'var(--estado-rechazada-bg)', color: 'var(--estado-rechazada-texto)' };
    if (estadoLower === 'demorada') return { bg: 'var(--estado-demorada-bg)', color: 'var(--estado-demorada-texto)' };
    return { bg: 'var(--color-borde)', color: 'var(--texto-principal)' };
  };

  return (
    <div className="container-fluid bg-white p-4 rounded shadow-sm border border-light">
      <h2 style={{ color: 'var(--texto-principal)', fontWeight: 'bold' }}>Mis requerimientos</h2>
      <p style={{ color: 'var(--texto-secundario)' }}>Aquí podés ver todos los requerimientos que has emitido.</p>

      <div className="mb-4 mt-4">
        <input 
          type="text" 
          className="form-control" 
          style={{ maxWidth: '400px' }}
          placeholder="Buscar por título o lugar..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-secondary fw-semibold">ID</th>
              <th className="text-secondary fw-semibold">Título</th>
              <th className="text-secondary fw-semibold">Lugar</th>
              <th className="text-secondary fw-semibold">Fecha de emisión</th>
              <th className="text-secondary fw-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {requerimientosFiltrados.map((req) => {
              const estilo = getEstiloEstado(req.estado);
              const lugarFormateado = req.sector ? `${req.sector} - ${req.lugar}` : req.lugar;
              
              return (
                <tr key={req.id}>
                  <td><span className="badge bg-light text-dark border">{req.id}</span></td>
                  <td>
                    <div className="fw-bold" style={{ color: 'var(--texto-principal)' }}>{req.titulo}</div>
                    <div className="small text-truncate" style={{ maxWidth: '250px', color: 'var(--texto-secundario)' }}>
                      {req.descripcion}
                    </div>
                  </td>
                  <td style={{ color: 'var(--texto-principal)' }}>{lugarFormateado}</td>
                  <td style={{ color: 'var(--texto-secundario)' }}>{req.fecha}</td>
                  <td>
                    <span className="badge px-2 py-1" style={{ backgroundColor: estilo.bg, color: estilo.color }}>
                      {req.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {requerimientosFiltrados.length === 0 && (
          <div className="text-center py-4 text-muted">
            No se encontraron requerimientos.
          </div>
        )}
      </div>
    </div>
  );
}