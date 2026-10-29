import { ApiError } from '../../utils/ApiError.js';
import { withTransaction } from '../../utils/transaccion.js';
import * as repository from './tareas.repository.js';
import * as requerimientosRepository from '../requerimientos/requerimientos.repository.js';
import * as historialRepository from '../historial/historial.repository.js';
import { mapearTarea } from './tareas.mapper.js';

const ESTADOS_JEFE = ['pendiente', 'en-proceso', 'demorada', 'cancelada', 'finalizada'];
const ESTADOS_EVALUACION = ['aprobada', 'rechazada'];
const PRIORIDADES = ['baja', 'media', 'alta'];

function normalizarId(valor) {
  if (valor === undefined || valor === null || valor === '') return null;
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new ApiError(400, 'El identificador debe ser un número entero válido');
  }
  return numero;
}

async function buscarTarea(id) {
  const tarea = await repository.obtenerPorId(id);
  if (!tarea) throw new ApiError(404, 'Tarea no encontrada');
  return tarea;
}

export async function listar(filtros) {
  const tareas = await repository.listar(filtros);
  return tareas.map(mapearTarea);
}

export async function obtener(id) {
  const tarea = await buscarTarea(id);
  return mapearTarea(tarea);
}

export async function crear(datos, actor) {
  const idRequerimiento = normalizarId(datos.idRequerimiento);
  if (!idRequerimiento) throw new ApiError(400, 'El requerimiento es obligatorio');
  if (!PRIORIDADES.includes(datos.prioridad)) throw new ApiError(400, 'La prioridad debe ser baja, media o alta');

  const requerimiento = await requerimientosRepository.obtenerPorId(idRequerimiento);
  if (!requerimiento || !requerimiento.activo) throw new ApiError(404, 'Requerimiento no encontrado');

  const tareaActiva = await repository.existeTareaActivaParaRequerimiento(idRequerimiento);
  if (tareaActiva) throw new ApiError(409, 'Ya existe una tarea activa para este requerimiento');

  return withTransaction(async (client) => {
    const id = await repository.crear(
      {
        idRequerimiento,
        prioridad: datos.prioridad,
        estado: 'pendiente',
        observaciones: datos.observaciones ?? null,
        idResponsable: datos.idResponsable ?? null,
        idPersonalExterno: datos.idPersonalExterno ?? null,
        costoPersonalExterno: datos.costoPersonalExterno ?? null,
      },
      client,
    );

    await historialRepository.crear(
      id,
      {
        estado: 'pendiente',
        motivo: `Tarea creada a partir del requerimiento`,
        idUsuario: actor.id,
      },
      client,
    );

    await requerimientosRepository.cambiarEstado(idRequerimiento, 'asignado', client);
    const tarea = await repository.obtenerPorId(id, client);
    return mapearTarea(tarea);
  });
}

export async function actualizar(id, datos, actor) {
  const actual = await buscarTarea(id);
  if (['aprobada', 'rechazada'].includes(actual.estado)) {
    throw new ApiError(409, 'La tarea ya fue evaluada y no se puede modificar');
  }

  const prioridad = datos.prioridad ?? actual.prioridad;
  if (!PRIORIDADES.includes(prioridad)) throw new ApiError(400, 'La prioridad debe ser baja, media o alta');

  await repository.actualizar(id, {
    prioridad,
    observaciones: datos.observaciones ?? actual.observaciones,
    idResponsable: datos.idResponsable ?? actual.idResponsable,
    idPersonalExterno: datos.idPersonalExterno ?? actual.idPersonalExterno,
    costoPersonalExterno: datos.costoPersonalExterno ?? actual.costoPersonalExterno,
    fechaInicio: datos.fechaInicio ?? actual.fechaInicio,
    fechaFin: datos.fechaFin ?? actual.fechaFin,
  });

  return obtener(id);
}

export async function cambiarEstado(id, datos, actor) {
  const actual = await buscarTarea(id);
  const estado = datos.estado;

  if (!ESTADOS_JEFE.includes(estado)) throw new ApiError(400, `El estado debe ser uno de: ${ESTADOS_JEFE.join(', ')}`);
  if (['aprobada', 'rechazada'].includes(actual.estado)) throw new ApiError(409, 'La tarea ya fue evaluada por el Directivo');
  if (actual.estado === estado) throw new ApiError(400, 'La tarea ya se encuentra en ese estado');
  if (['demorada', 'cancelada'].includes(estado) && !datos.motivo) throw new ApiError(400, `El motivo es obligatorio para el estado ${estado}`);

  return withTransaction(async (client) => {
    await repository.cambiarEstado(
      id,
      {
        estado,
        fechaInicio: actual.fechaInicio,
        fechaFin: ['finalizada', 'cancelada'].includes(estado) ? new Date() : null,
        idDirectivo: actual.idDirectivo ? Number(actual.idDirectivo) : null,
        motivo: datos.motivo,
        observaciones: datos.observaciones ?? actual.observaciones,
      },
      actor.id,
      client,
    );

    const estadoReq = estado === 'finalizada' ? 'finalizada' : estado === 'cancelada' ? 'cancelada' : 'en-proceso';
    await requerimientosRepository.cambiarEstado(actual.idRequerimiento, estadoReq, client);

    const tarea = await repository.obtenerPorId(id, client);
    return mapearTarea(tarea);
  });
}

export async function evaluar(id, datos, actor) {
  const actual = await buscarTarea(id);
  const estado = datos.estado;

  if (!ESTADOS_EVALUACION.includes(estado)) throw new ApiError(400, 'La evaluación debe ser aprobada o rechazada');
  if (actual.estado !== 'finalizada') throw new ApiError(409, 'Solo se pueden evaluar tareas finalizadas');
  if (estado === 'rechazada' && !datos.motivo) throw new ApiError(400, 'El motivo es obligatorio para rechazar una tarea');

  return withTransaction(async (client) => {
    await repository.cambiarEstado(
      id,
      {
        estado,
        fechaInicio: actual.fechaInicio,
        fechaFin: actual.fechaFin,
        idDirectivo: actor.id,
        motivo: datos.motivo,
      },
      actor.id,
      client,
    );

    await historialRepository.crear(
      id,
      {
        estado,
        motivo: datos.motivo ?? `El Directivo ${estado === 'aprobada' ? 'aprobó' : 'rechazó'} la tarea`,
        idUsuario: actor.id,
      },
      client,
    );

    const estadoReq = estado === 'aprobada' ? 'finalizada' : 'en-proceso';
    await requerimientosRepository.cambiarEstado(actual.idRequerimiento, estadoReq, client);

    const tarea = await repository.obtenerPorId(id, client);
    return mapearTarea(tarea);
  });
}