import { ApiError } from '../../utils/ApiError.js';
import * as repository from './notificaciones.repository.js';

export async function listar(usuario, filtros) {
  return repository.listarPorUsuario(usuario.id, {
    leida: filtros.leida,
  });
}

export async function marcarLeida(id, usuario) {
  const notificacion = await repository.marcarLeida(id, usuario.id);

  if (!notificacion) {
    throw new ApiError(404, 'Notificación no encontrada');
  }

  return notificacion;
}
