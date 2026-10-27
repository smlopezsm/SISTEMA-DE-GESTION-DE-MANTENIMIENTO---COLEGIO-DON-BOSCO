import { apiRequest } from '../../../shared/api/apiClient';
import { obtenerToken } from '../../auth/services/authService';

export async function obtenerResumenPanel() {
  // Hacemos dos consultas en paralelo: estadísticas y requerimientos pendientes
  const [estadisticas, requerimientos] = await Promise.all([
    apiRequest('/estadisticas', { token: obtenerToken() }),
    apiRequest('/requerimientos?estado=pendiente', { token: obtenerToken() }),
  ]);

  const kpis = estadisticas.kpis || [];
  const getKpi = (clave) => kpis.find((k) => k.clave === clave)?.valor || 0;

  return {
    requerimientosPendientes: requerimientos.length, // Contamos los requerimientos pendientes reales
    tareasPendientes: getKpi('en-proceso'), // Usamos el total en proceso
    tareasEnProceso: getKpi('en-proceso'),
    tareasDemoradas: getKpi('demoradas'),
    tareasFinalizadas: getKpi('finalizadas'),
    tareasRechazadas: getKpi('rechazadas'),
  };
}

export async function obtenerRequerimientosRecientes() {
  // Traemos los requerimientos del backend (limitamos a los 10 más recientes)
  const requerimientos = await apiRequest('/requerimientos', {
    token: obtenerToken(),
  });
  return requerimientos.slice(0, 10); // Tomamos solo los primeros 10
}

export async function obtenerTareas() {
  // Traemos las tareas del backend
  const tareas = await apiRequest('/tareas', {
    token: obtenerToken(),
  });
  return { tareas }; // El componente espera un objeto con la propiedad 'tareas'
}

export async function obtenerNotificaciones() {
  const notificaciones = await apiRequest('/notificaciones', {
    token: obtenerToken(),
  });
  return notificaciones;
}

// Esta función ya no se usa, pero la dejamos para que no rompa si alguna página la importa
export async function obtenerPanelDirectivo() {
  return {
    resumen: {},
    tareasEvaluacion: [],
    notificaciones: [],
  };
}