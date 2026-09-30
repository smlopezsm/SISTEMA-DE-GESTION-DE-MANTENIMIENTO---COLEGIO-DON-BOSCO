
import resumen from '@data/resumen-panel.json';
import requerimientos from '@data/requerimientos.json';
import tareas from '@data/tareas.json';

export const obtenerResumenPanel = async () => resumen;
export const obtenerRequerimientosRecientes = async () => requerimientos;
export const obtenerTareas = async () => tareas;
