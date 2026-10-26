import { ApiError } from '../../utils/ApiError.js';
import * as repository from './historial.repository.js';
import * as tareasRepository from '../tareas/tareas.repository.js';

export async function listar(idTarea) {
  const tarea = await tareasRepository.obtenerPorId(idTarea);

  if (!tarea) {
    throw new ApiError(404, 'Tarea no encontrada');
  }

  return repository.listarPorTarea(idTarea);
}
