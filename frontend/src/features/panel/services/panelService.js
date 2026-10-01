// src/features/panel/services/panelService.js
import resumen from "@data/resumen-panel.json";
import requerimientos from "@data/requerimientos.json";
import tareas from "@data/tareas.json";
import notificacionesData from "@data/notificaciones.json";
import tareasEvaluacion from "@data/tareas-evaluacion.json";

// 👇 FIX: extraer el array (puede venir envuelto o directo)
const notificaciones = Array.isArray(notificacionesData)
  ? notificacionesData
  : notificacionesData.notificaciones ?? [];

// Tipos de notificación por rol
const TIPOS_POR_ROL = {
  jefeMantenimiento: ['requerimiento', 'tarea-aprobada', 'tarea-rechazada'],
  directivo: ['tarea-finalizada', 'tarea-cancelada'],
};

function notificacionesPorRol(rol) {
  const tipos = TIPOS_POR_ROL[rol] ?? [];
  return notificaciones.filter((n) => tipos.includes(n.tipo));
}

export const obtenerResumenPanel = async () => resumen;
export const obtenerRequerimientosRecientes = async () => requerimientos;
export const obtenerTareas = async () => tareas;

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