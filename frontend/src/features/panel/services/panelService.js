// src/features/panel/services/panelService.js
import resumen from '@data/resumen-panel.json';
import requerimientos from '@data/requerimientos.json';
import tareas from '@data/tareas.json';
import tareasEvaluacion from '@data/tareas-evaluacion.json';
import notificacionesData from '@data/notificaciones.json';

// ─────────────────────────────────────────────
// Normalizar notificaciones (puede venir array o envuelto)
// ─────────────────────────────────────────────
const notificaciones = Array.isArray(notificacionesData)
  ? notificacionesData
  : notificacionesData.notificaciones ?? [];

// ─────────────────────────────────────────────
// Tipos de notificación por rol
// ─────────────────────────────────────────────
const TIPOS_POR_ROL = {
  jefeMantenimiento: ['requerimiento', 'tarea-aprobada', 'tarea-rechazada'],
  directivo: ['tarea-finalizada', 'tarea-cancelada'],
};

function notificacionesPorRol(rol) {
  const tipos = TIPOS_POR_ROL[rol] ?? [];
  return notificaciones.filter((n) => tipos.includes(n.tipo));
}

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────

export const obtenerResumenPanel = async () => resumen;
export const obtenerRequerimientosRecientes = async () => requerimientos;
export const obtenerTareas = async () => tareas;
export const obtenerNotificaciones = async () => notificaciones;

export async function obtenerPanelDirectivo() {
  const rechazadas =
    tareas.porEstado?.find((e) => e.clave === 'rechazada')?.valor ?? 0;

  return {
    resumen: {
      pendientesEvaluacion: resumen.tareasEsperandoAprobacion ?? 0,
      enProceso: resumen.tareasEnProceso ?? 0,
      finalizadas: resumen.tareasFinalizadas ?? 0,
      rechazadas,
    },
    tareasEvaluacion,
    notificaciones: notificacionesPorRol('directivo'),
  };
}