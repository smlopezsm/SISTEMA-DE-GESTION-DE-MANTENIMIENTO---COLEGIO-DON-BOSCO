import data from '@data/notificaciones.json';

export function obtenerNotificaciones() {
  return data.notificaciones ?? [];
}

export function marcarComoLeida(id) {
  console.log('Marcar como leída:', id);
}

export function marcarTodasComoLeidas() {
  console.log('Marcar todas como leídas');
}