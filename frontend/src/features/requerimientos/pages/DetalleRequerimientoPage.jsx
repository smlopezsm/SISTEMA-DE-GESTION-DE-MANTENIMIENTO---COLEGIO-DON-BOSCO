import { Link, useParams } from 'react-router';
import { FaArrowLeft, FaFileLines } from 'react-icons/fa6';
import '../styles/DetalleRequerimientoPage.css';

import { obtenerRequerimientoPorId } from '../services/requerimientosService';

import InfoPrincipalRequerimiento from '../components/InfoPrincipalRequerimiento';
import SolicitanteRequerimiento from '../components/SolicitanteRequerimiento';
import AccionesRequerimiento from '../components/AccionesRequerimiento';

function DetalleRequerimientoPage() {
  const { id } = useParams();

  const requerimiento = obtenerRequerimientoPorId(id);

  // no se encontro
  if (!requerimiento) {
    return (
      <div className="container-fluid py-5 text-center">
        <p className="text-muted mb-3">No se encontró el requerimiento solicitado.</p>
        <Link to="/gestor/requerimientos" className="btn btn-primary">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="detalle-requerimiento-page">
      {/* encabezado */}
      <div className="mb-4">
        <Link
          to="/gestor/requerimientos"
          className="btn btn-link text-decoration-none text-muted p-0 mb-2 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft size={14} />
          Volver al listado
        </Link>

        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div className="d-flex gap-3 align-items-start">
            <div className="icono-titulo">
              <FaFileLines size={22} />
            </div>
            <div>
              <h1 className="h3 mb-1">Detalle del requerimiento</h1>
              <p className="text-muted mb-0">
                Información completa del requerimiento solicitado
              </p>
            </div>
          </div>

          {/* id */}
          <span className="badge-id-requerimiento">
            ID: {requerimiento.id}
          </span>
        </div>
      </div>

      {/* card principal */}
      <InfoPrincipalRequerimiento requerimiento={requerimiento} />

      {/* card inferiores */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <SolicitanteRequerimiento requerimiento={requerimiento} />
        </div>

        <div className="col-12 col-md-6">
          <AccionesRequerimiento requerimiento={requerimiento} />
        </div>
      </div>
    </div>
  );
}

export default DetalleRequerimientoPage;