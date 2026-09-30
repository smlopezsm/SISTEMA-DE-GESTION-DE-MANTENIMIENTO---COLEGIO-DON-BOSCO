import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { FaFileCirclePlus, FaClipboardList, FaRotate, FaClock, FaCircleCheck, FaCircleXmark, } from 'react-icons/fa6';
import Tarjeta from '../components/Tarjeta';
import TablaRequerimientos from '../components/TablaRequerimientos';
import TareasEnCurso from '../components/TareasEnCurso';

import { obtenerResumenPanel, obtenerRequerimientosRecientes, obtenerTareas, } from '../services/panelService';

function PanelInicioJefe() {

  const usuario = useOutletContext();  //recupera lo que devuelve layout

  //
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [requerimientos, setRequerimientos] = useState([]);
  const [tareas, setTareas] = useState([]);


  useEffect(() => {

    let activo = true;// es true mientras el comonente este montado

    //pedir en paralelo una promise
    Promise.all([obtenerResumenPanel(), obtenerRequerimientosRecientes(), obtenerTareas(),])
      .then(([r, req, t]) => {
        if (!activo) return;
        setResumen(r);
        setRequerimientos(req);
        setTareas(t.tareas ?? []);
      }) //cuando termina tenemos un array con los resultados

      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, []);

  //señales visuales de carga o error
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
      <div className="row g-2 g-md-3 mb-3 mb-lg-4 d-none d-md-flex">
        <div className="col-6 col-md-4 col-lg-2">
          <Tarjeta titulo="Requerimientos pendientes" valor={resumen.requerimientosPendientes} icono={FaFileCirclePlus} />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <Tarjeta titulo="Tareas Totales" valor={resumen.tareasPendientes} icono={FaClipboardList} />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <Tarjeta titulo="Tareas en proceso" valor={resumen.tareasEnProceso} icono={FaRotate} />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <Tarjeta titulo="Tareas demoradas" valor={resumen.tareasDemoradas} icono={FaClock} />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <Tarjeta titulo="Tareas finalizadas" valor={resumen.tareasFinalizadas} icono={FaCircleCheck} />
        </div>
        <div className="col-6 col-md-4 col-lg-2">
          <Tarjeta titulo="Tareas rechazadas" valor={resumen.tareasRechazadas} icono={FaCircleXmark} />
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