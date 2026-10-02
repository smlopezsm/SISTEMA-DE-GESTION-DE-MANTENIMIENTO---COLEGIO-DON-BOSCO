import resumen from '@data/resumen-panel.json';
import requerimientos from '@data/requerimientos.json';
import tareas from '@data/tareas.json';
import tareasEvaluacion from "@data/tareas-evaluacion.json";

export const obtenerResumenPanel = async () => resumen;
export const obtenerRequerimientosRecientes = async () => requerimientos;
export const obtenerTareas = async () => tareas;

export const obtenerNotificaciones = async () => notificaciones;

export async function obtenerPanelDirectivo() {
  const rechazadas =
    tareas.porEstado.find((e) => e.clave === "rechazada")?.valor ?? 0;

  return {
    resumen: {
      pendientesEvaluacion: resumen.tareasEsperandoAprobacion,
      enProceso: resumen.tareasEnProceso,
      finalizadas: resumen.tareasFinalizadas,
      rechazadas,
    },
    tareasEvaluacion,
    notificaciones: notificacionesPorRol('directivo'), // 👈 filtrado, siempre array
  };
}

