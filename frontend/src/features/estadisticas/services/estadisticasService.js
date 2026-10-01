// Punto único de acceso a datos de estadísticas.
// "estado de tareas" sale de tareas.json; el resto de estadisticas.json.
import estadisticas from '../../../../../backend/data/estadisticas.json';
import tareas from '../../../../../backend/data/tareas.json';

export async function obtenerEstadisticas(periodo = 30) {
  // TODO: cuando exista la API, filtrar por período (días). Con los JSON el valor no cambia los datos.
  return { ...estadisticas, periodo, estadoTareas: tareas.porEstado };
}
