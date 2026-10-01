import { Link, useParams, useOutletContext } from 'react-router';
import { FaArrowLeft, FaScrewdriverWrench } from 'react-icons/fa6';
import '../styles/DetalleTareaPage.css';

import { obtenerTareaPorId } from '../services/tareasService';
import { obtenerCompraPorTarea } from '../services/comprasService';

import ResumenDetalleTarea from '../components/ResumenDetalleTarea';
import RequerimientoAsociado from '../components/RequerimientoAsociado';
import AccionesDetalleTarea from '../components/AccionesDetalleTarea';
import HistorialTarea from '../components/HistorialTarea';

function DetalleTareaPage() {
  const { id } = useParams();
  const usuario = useOutletContext();

  const tarea = obtenerTareaPorId(id);
  const compra = obtenerCompraPorTarea(id);
  const tieneCompra = Boolean(compra);

  // si no se encuentra la tarea
  if (!tarea) {
    return (
      <div className="container-fluid py-5 text-center">
        <p className="text-muted mb-3">No se encontro la tarea .</p>
        <Link to="/gestor/tareas" className="btn btn-primary">
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <div className="detalle-tarea-page">
      {/* encabezado */}
      <div className="mb-4">
        <Link
          to="/gestor/tareas"
          className="btn btn-link text-decoration-none text-muted p-0 mb-2 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft size={14} />
          Volver al listado
        </Link>

        <div className="d-flex gap-3 align-items-start">
          <div className="icono-titulo">
            <FaScrewdriverWrench size={22} />
          </div>
          <div>
            <h1 className="h3 mb-1">Detalle de tarea</h1>
            <p className="text-muted mb-0">
              Informacion completa de la tarea y su requerimiento asociado
            </p>
          </div>
        </div>
      </div>

      {/* resumen horizontal */}
      <ResumenDetalleTarea tarea={tarea} tieneCompra={tieneCompra} />

      {/* principal */}
      <div className="row g-4">
        {/* columna izquierda  */}
        <div className="col-12 col-xl-8">
          <RequerimientoAsociado tarea={tarea} />
        </div>

        {/* columna derecha */}
        <div className="col-12 col-xl-4">
          <AccionesDetalleTarea tarea={tarea} usuario={usuario} />
          <HistorialTarea historial={tarea.historial ?? []} />
        </div>
      </div>
    </div>
  );
}

export default DetalleTareaPage;