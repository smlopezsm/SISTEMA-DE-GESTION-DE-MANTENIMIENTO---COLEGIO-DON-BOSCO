// src/features/notificaciones/services/notificacionesService.js
import data from '@data/notificaciones.json';

// Qué tipos de notificación ve cada rol
const TIPOS_POR_ROL = {
  jefeMantenimiento: ['requerimiento', 'tarea-aprobada', 'tarea-rechazada'],
  directivo: ['tarea-finalizada', 'tarea-cancelada'],
};

// Devuelve TODAS las notificaciones (sin filtrar)
export function obtenerTodasLasNotificaciones() {
  return data.notificaciones ?? [];
}

// Devuelve solo las del rol indicado
export function obtenerNotificaciones(rol) {
  const todas = obtenerTodasLasNotificaciones();
  if (!rol) return todas;
  const tipos = TIPOS_POR_ROL[rol] ?? [];
  return todas.filter((n) => tipos.includes(n.tipo));
}

// Para el badge del header (cantidad de no leídas)
export function contarNoLeidas(rol) {
  return obtenerNotificaciones(rol).filter((n) => !n.leida).length;
}

export function marcarComoLeida(id) {
  console.log('Marcar como leída:', id);
}

export function marcarTodasComoLeidas() {
  console.log('Marcar todas como leídas');
}