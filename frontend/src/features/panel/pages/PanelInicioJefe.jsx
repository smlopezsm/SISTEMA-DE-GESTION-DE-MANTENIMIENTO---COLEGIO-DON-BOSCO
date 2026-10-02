import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  FaFileCirclePlus,
  FaClipboardList,
  FaRotate,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
} from 'react-icons/fa6';
import TarjetaResumen from '../../../shared/components/TarjetaResumen';
import TablaRequerimientos from '../components/TablaRequerimientos';
import TareasEnCurso from '../components/TareasEnCurso';

import {
  obtenerResumenPanel,
  obtenerRequerimientosRecientes,
  obtenerTareas,
} from '../services/panelService';

function PanelInicioJefe() {
  const usuario = useOutletContext();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [requerimientos, setRequerimientos] = useState([]);
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    let activo = true;

    Promise.all([
      obtenerResumenPanel(),
      obtenerRequerimientosRecientes(),
      obtenerTareas(),
    ])
      .then(([r, req, t]) => {
        if (!activo) return;
        setResumen(r);
        setRequerimientos(req);
        setTareas(t.tareas ?? []);
      })
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        No pudimos cargar el panel: {error}
      </div>
    );
  }

  return (
    <div className="panel-inicio">
      <div className="mb-4">
        <h4 className="mb-1">¡Hola, {usuario?.nombre}!</h4>
        <p className="text-muted mb-0 small">
          Resumen del estado de las tareas y requerimientos del colegio
        </p>
      </div>

      {/* Tarjetas */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-6 g-2 g-md-3 mb-3 mb-lg-4">
        <div className="col">
          <TarjetaResumen
            tono="en-proceso"
            icono={FaFileCirclePlus}
            etiqueta="Requerimientos pendientes"
            valor={resumen.requerimientosPendientes}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="con-tarea"
            icono={FaClipboardList}
            etiqueta="Tareas totales"
            valor={resumen.tareasPendientes}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="en-proceso"
            icono={FaRotate}
            etiqueta="Tareas en proceso"
            valor={resumen.tareasEnProceso}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="demorada"
            icono={FaClock}
            etiqueta="Tareas demoradas"
            valor={resumen.tareasDemoradas}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="finalizada"
            icono={FaCircleCheck}
            etiqueta="Tareas finalizadas"
            valor={resumen.tareasFinalizadas}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="rechazada"
            icono={FaCircleXmark}
            etiqueta="Tareas rechazadas"
            valor={resumen.tareasRechazadas}
          />
        </div>
      </div>

      {/* Tabla de requerimientos */}
      <div className="mb-3 mb-lg-4">
        <TablaRequerimientos requerimientos={requerimientos} />
      </div>

      {/* Tareas en curso */}
      <TareasEnCurso tareas={tareas} />
    </div>
  );
}

export default PanelInicioJefe;