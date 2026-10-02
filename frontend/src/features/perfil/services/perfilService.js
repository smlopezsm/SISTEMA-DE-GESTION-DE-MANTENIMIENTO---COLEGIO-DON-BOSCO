// src/features/perfil/services/perfilService.js
import { obtenerSesion, actualizarSesion } from '../../auth/services/authService';

// ─────────────────────────────────────────────
// Lectura
// ─────────────────────────────────────────────

export function obtenerUsuarioActual() {
  return obtenerSesion();
}

// ─────────────────────────────────────────────
// Actualización
// ─────────────────────────────────────────────

export function actualizarUsuario(datosActualizados) {
  return actualizarSesion(datosActualizados);
}

export function actualizarAvatar(dataUrl) {
  return actualizarSesion({ avatar: dataUrl });
}

export function quitarAvatar() {
  const actual = obtenerSesion() ?? {};
  const { avatar, ...resto } = actual;
  sessionStorage.setItem('sesion', JSON.stringify(resto));
  return resto;
}