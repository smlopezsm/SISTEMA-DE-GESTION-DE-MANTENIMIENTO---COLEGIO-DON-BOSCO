import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import {
  FaFileCirclePlus,
  FaClipboardList,
  FaRotate,
  FaClock,
  FaUsers,
  FaCircleCheck,
} from 'react-icons/fa6';

import Tarjeta from '../components/Tarjeta';
import TablaRequerimientos from '../components/TablaRequerimientos';
import TareasPorEstado from '../components/TareasPorEstado';
import ProximasTareas from '../components/ProximasTareas';
import PanelNotificaciones from '../components/PanelNotificaciones';

import {
  obtenerResumenPanel,
  obtenerRequerimientosRecientes,
  obtenerTareas,
  obtenerNotificaciones,
} from '../services/panelService';

function PanelInicioJefe() {
  // obtenemos el usuario logueado desde el Outlet del LayoutGestor
  const usuario = useOutletContext();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [requerimientos, setRequerimientos] = useState([]);
  const [tareas, setTareas] = useState({ proximas: [], porEstado: [] });
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    let activo = true;
    Promise.all([
      obtenerResumenPanel(),
      obtenerRequerimientosRecientes(),
      obtenerTareas(),
      obtenerNotificaciones(),
    ])
      .then(([r, req, t, n]) => {
        if (!activo) return;
        setResumen(r);
        setRequerimientos(req);
        setTareas(t);
        setNotificaciones(n);
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
      {/* Saludo dinámico */}
      <div className="mb-4">
        <h4 className="mb-1"> ¡Hola, {usuario?.nombre}!</h4>
        <p className="text-muted mb-0 small">
          Aquí tienes un resumen del estado de las tareas y requerimientos del colegio.
        </p>
      </div>

      {/* Grid principal */}
      <div className="row g-3 g-lg-4">
        {/* Columna izquierda */}
        <div className="col-12 col-xl-9">
          {/* KPIs */}
          <div className="row g-3 mb-3 mb-lg-4">
            <div className="col-6 col-md-4 col-lg-2">
              <Tarjeta titulo="Requerimientos Pendientes" valor={resumen.requerimientosPendientes} icono={FaFileCirclePlus} />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Tarjeta titulo="Tareas pendientes" valor={resumen.tareasPendientes} icono={FaClipboardList} />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Tarjeta titulo="Tareas en proceso" valor={resumen.tareasEnProceso} icono={FaRotate} />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Tarjeta titulo="Tareas demoradas" valor={resumen.tareasDemoradas} icono={FaClock} />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Tarjeta titulo="Esperando aprobación" valor={resumen.tareasEsperandoAprobacion} icono={FaUsers} />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Tarjeta titulo="Tareas finalizadas" valor={resumen.tareasFinalizadas} icono={FaCircleCheck} />
            </div>
          </div>

          {/* Tabla de requerimientos */}
          <div className="mb-3 mb-lg-4">
            <TablaRequerimientos requerimientos={requerimientos} />
          </div>

          {/* Gráfico + Próximas tareas */}
          <div className="row g-3 g-lg-4">
            <div className="col-12 col-lg-5">
              <TareasPorEstado datos={tareas.porEstado} total={resumen.totalTareas} />
            </div>
            <div className="col-12 col-lg-7">
              <ProximasTareas tareas={tareas.proximas} />
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-12 col-xl-3">
          <div className="d-flex flex-column gap-3 gap-lg-4">
            <PanelNotificaciones notificaciones={notificaciones} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelInicioJefe;