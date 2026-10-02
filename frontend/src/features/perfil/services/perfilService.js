import { obtenerSesion, actualizarSesion } from '../../auth/services/authService';

export function obtenerUsuarioActual() {
  return obtenerSesion();
}

export function actualizarUsuario(datosActualizados) {
  return actualizarSesion(datosActualizados);
}

export function actualizarAvatar(dataUrl) {
  return actualizarSesion({ avatar: dataUrl });
}

export function quitarAvatar() {
  return actualizarSesion({ avatar: null });
}