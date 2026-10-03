import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { FaUserTie, FaClipboardCheck, FaHouse, FaClock, FaCircleCheck, FaCircleXmark, FaFileLines, } from "react-icons/fa6";
import TarjetaResumen from "../../../shared/components/TarjetaResumen";
import SeccionCard from "../../../shared/components/SeccionCard";
import TablaEvaluacion from "../components/TablaEvaluacion";
import { obtenerPanelDirectivo } from "../services/panelService";
import Encabezado from "../../../shared/components/EncabezadoPagina";
import "../styles/PanelInicioDirectivo.css";

function PanelInicioDirectivo() {
  const usuario = useOutletContext();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    obtenerPanelDirectivo().then(setDatos);
  }, []);

  if (!datos) return <p className="text-secondary">Cargando…</p>;

  const { resumen, tareasEvaluacion, notificaciones } = datos;

  return (
    <>
      <Encabezado
        icono={FaHouse}
        titulo={usuario?.nombre ? `¡Hola, ${usuario.nombre}!` : '¡Hola!'}
        subtitulo="Aqui podras ver las tareas de mantenimiento del colegio"
      />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 mb-4">
        <div className="col">
          <TarjetaResumen
            tono="en-proceso"
            icono={FaClipboardCheck}
            etiqueta="Tareas pendientes de evaluación"
            valor={resumen.pendientesEvaluacion}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="pendiente"
            icono={FaClock}
            etiqueta="Tareas en proceso"
            valor={resumen.enProceso}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="finalizada"
            icono={FaCircleCheck}
            etiqueta="Tareas finalizadas"
            valor={resumen.finalizadas}
          />
        </div>
        <div className="col">
          <TarjetaResumen
            tono="rechazada"
            icono={FaCircleXmark}
            etiqueta="Tareas rechazadas"
            valor={resumen.rechazadas}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <SeccionCard
            icono={FaFileLines}
            titulo="Tareas pendientes de evaluación"
            subtitulo="Revisá las tareas finalizadas que esperan tu aprobación o rechazo."
          >
            <TablaEvaluacion tareas={tareasEvaluacion} />
          </SeccionCard>
        </div>

      </div>
    </>
  );
}

export default PanelInicioDirectivo;