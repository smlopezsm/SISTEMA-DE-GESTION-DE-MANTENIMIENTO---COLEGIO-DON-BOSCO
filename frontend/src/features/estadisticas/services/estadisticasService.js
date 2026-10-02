import estadisticas from '@data/estadisticas.json';
import tareas from '@data/tareas.json';

export async function obtenerEstadisticas(periodo = 30) {
  return { ...estadisticas, periodo, estadoTareas: tareas.porEstado };
}
