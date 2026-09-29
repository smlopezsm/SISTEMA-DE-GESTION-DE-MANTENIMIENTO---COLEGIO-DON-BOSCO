
import resumen from '@data/resumen-panel.json';
import requerimientos from '@data/requerimientos.json';
import tareas from '@data/tareas.json';
import notificaciones from '@data/notificaciones.json';

export const obtenerResumenPanel = async () => resumen;
export const obtenerRequerimientosRecientes = async () => requerimientos;
export const obtenerTareas = async () => tareas;
export const obtenerNotificaciones = async () => notificaciones;