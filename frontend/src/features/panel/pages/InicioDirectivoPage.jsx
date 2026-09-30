import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import {
  FaUserTie,
  FaClipboardCheck,
  FaClock,
  FaCircleCheck,
  FaCircleXmark,
  FaFileLines,
  FaClipboardList,
} from "react-icons/fa6";
import EncabezadoPagina from "../../../shared/components/EncabezadoPagina";
import TarjetaResumen from "../../../shared/components/TarjetaResumen";
import SeccionCard from "../../../shared/components/SeccionCard";
import TablaEvaluacion from "../components/TablaEvaluacion";
import NotificacionesDirectivo from "../components/NotificacionesDirectivo";
import { obtenerPanelDirectivo } from "../services/panelService";
import "../styles/inicio-directivo.css";

function InicioDirectivoPage() {
  const usuario = useOutletContext();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    obtenerPanelDirectivo().then(setDatos);
  }, []);

  if (!datos) return <p className="text-secondary">Cargando…</p>;

  const { resumen, tareasEvaluacion, notificaciones } = datos;

  return (
    <>
      <EncabezadoPagina
        icono={FaUserTie}
        titulo={`¡Hola, ${usuario.nombre}!`}
        subtitulo="Aquí podrás ver el estado de las tareas y requerimientos del colegio."
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
        <div className="col-xl-8">
          <SeccionCard
            icono={FaFileLines}
            titulo="Tareas pendientes de evaluación"
            subtitulo="Revisá las tareas finalizadas que esperan tu aprobación o rechazo."
          >
            <TablaEvaluacion tareas={tareasEvaluacion} />
          </SeccionCard>
        </div>

        <div className="col-xl-4 d-flex flex-column gap-3">
          <SeccionCard>
            <div className="rol-directivo">
              <FaClipboardList className="rol-directivo__icono" />
              <div>
                <small>Tu rol</small>
                <strong>Directivo</strong>
                <p>
                  Solo podés aprobar o rechazar tareas finalizadas. No se
                  permiten ediciones.
                </p>
              </div>
            </div>
          </SeccionCard>

          <NotificacionesDirectivo notificaciones={notificaciones} />

          <blockquote className="cita-bosco">
            <p>“La educación es cosa del corazón.”</p>
            <footer>San Juan Bosco</footer>
          </blockquote>
        </div>
      </div>
    </>
  );
}

export default InicioDirectivoPage;
