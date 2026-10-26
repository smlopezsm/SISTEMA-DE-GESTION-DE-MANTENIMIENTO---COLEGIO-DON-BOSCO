import { ApiError } from '../../utils/ApiError.js';
import * as repository from './compras.repository.js';
import * as tareasRepository from '../tareas/tareas.repository.js';

async function validarTarea(idTarea) {
  const tarea = await tareasRepository.obtenerPorId(idTarea);

  if (!tarea) {
    throw new ApiError(404, 'Tarea no encontrada');
  }

  return tarea;
}

export async function listar(idTarea) {
  await validarTarea(idTarea);
  return repository.listarPorTarea(idTarea);
}

export async function crear(idTarea, datos) {
  await validarTarea(idTarea);

  const monto = Number(datos.monto);
  if (!Number.isFinite(monto) || monto <= 0) {
    throw new ApiError(400, 'El monto debe ser mayor a cero');
  }

  const detalle = String(datos.detalle ?? '').trim();
  if (!detalle) {
    throw new ApiError(400, 'El detalle de la compra es obligatorio');
  }

  const categoria = datos.categoria ?? 'materiales';
  if (!['materiales', 'servicios', 'otros'].includes(categoria)) {
    throw new ApiError(
      400,
      'La categoría debe ser materiales, servicios u otros',
    );
  }

  return repository.crear(idTarea, {
    monto,
    detalle,
    categoria,
    fecha: datos.fecha ?? null,
    factura: datos.factura ?? null,
  });
}
