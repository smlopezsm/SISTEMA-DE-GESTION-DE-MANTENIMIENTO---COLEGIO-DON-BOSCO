import { Link, useParams, useOutletContext } from 'react-router';
import { FaArrowLeft, FaScrewdriverWrench } from 'react-icons/fa6';
import '../styles/DetalleTareaPage.css';

import { obtenerTareaPorId } from '../services/tareasService';
import { obtenerCompraPorTarea } from '../services/comprasService';
import EncabezadoPage from '../../../shared/components/EncabezadoPagina';
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
      <EncabezadoPage
        volver={{ to: '/gestor/tareas', texto: 'Volver al listado' }}
        icono={FaScrewdriverWrench}
        titulo="Detalle de tarea"
        subtitulo={
          usuario?.rol === 'directivo'
            ? 'Revisá la tarea y aprobá o rechazá si está finalizada.'
            : 'Información completa de la tarea y su requerimiento asociado.'
        }
      />

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