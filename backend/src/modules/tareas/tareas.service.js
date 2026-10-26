import { ApiError } from '../../utils/ApiError.js';
import { withTransaction } from '../../utils/transaccion.js';
import * as repository from './tareas.repository.js';
import * as requerimientosRepository from '../requerimientos/requerimientos.repository.js';
import * as historialRepository from '../historial/historial.repository.js';
import * as notificacionesRepository from '../notificaciones/notificaciones.repository.js';
import { mapearTarea } from './tareas.mapper.js';

const ESTADOS_JEFE = [
  'pendiente',
  'en-proceso',
  'demorada',
  'cancelada',
  'finalizada',
];

const ESTADOS_EVALUACION = ['aprobada', 'rechazada'];
const PRIORIDADES = ['baja', 'media', 'alta'];

function etiquetaTarea(id) {
  return `T-${String(id).padStart(4, '0')}`;
}

function etiquetaRequerimiento(id) {
  return `REQ-${String(id).padStart(4, '0')}`;
}

function normalizarId(valor) {
  if (valor === undefined || valor === null || valor === '') {
    return null;
  }

  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new ApiError(400, 'El identificador debe ser un número entero válido');
  }

  return numero;
}

function resolverResponsable(datos, actual = null) {
  const tieneInterno = datos.idResponsable !== undefined;
  const tieneExterno = datos.idPersonalExterno !== undefined;

  if (!tieneInterno && !tieneExterno) {
    if (!actual) {
      throw new ApiError(
        400,
        'Tenés que asignar un responsable interno o personal externo',
      );
    }

    return {
      idResponsable: actual.idResponsable,
      idPersonalExterno: actual.idPersonalExterno,
    };
  }

  const idResponsable = tieneInterno ? normalizarId(datos.idResponsable) : null;
  const idPersonalExterno = tieneExterno
    ? normalizarId(datos.idPersonalExterno)
    : null;

  if ((idResponsable && idPersonalExterno) || (!idResponsable && !idPersonalExterno)) {
    throw new ApiError(
      400,
      'La tarea debe tener exactamente un responsable: interno o externo',
    );
  }

  return { idResponsable, idPersonalExterno };
}

async function validarResponsableExiste(idResponsable, idPersonalExterno) {
  if (idResponsable) {
    const usuario = await repository.obtenerUsuarioActivo(idResponsable);
    if (!usuario) {
      throw new ApiError(400, 'El responsable interno no existe o está inactivo');
    }
  }

  if (idPersonalExterno) {
    const personal = await repository.obtenerPersonalActivo(idPersonalExterno);
    if (!personal) {
      throw new ApiError(400, 'El personal externo no existe o está inactivo');
    }
  }
}

async function buscarTarea(id) {
  const tarea = await repository.obtenerPorId(id);
  if (!tarea) {
    throw new ApiError(404, 'Tarea no encontrada');
  }
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
  const prioridad = datos.prioridad;

  if (!idRequerimiento) {
    throw new ApiError(400, 'El requerimiento es obligatorio');
  }

  if (!PRIORIDADES.includes(prioridad)) {
    throw new ApiError(400, 'La prioridad debe ser baja, media o alta');
  }

  const requerimiento = await requerimientosRepository.obtenerPorId(
    idRequerimiento,
  );

  if (!requerimiento || !requerimiento.activo) {
    throw new ApiError(404, 'Requerimiento no encontrado');
  }

  if (['finalizada', 'cancelada', 'rechazada'].includes(requerimiento.estado)) {
    throw new ApiError(
      409,
      'No se puede crear una tarea para un requerimiento cerrado',
    );
  }

  const tareaActiva = await repository.existeTareaActivaParaRequerimiento(
    idRequerimiento,
  );

  if (tareaActiva) {
    throw new ApiError(
      409,
      'Ya existe una tarea activa para este requerimiento',
    );
  }

  const { idResponsable, idPersonalExterno } = resolverResponsable(datos);
  await validarResponsableExiste(idResponsable, idPersonalExterno);

  let costoPersonalExterno = null;
  if (idPersonalExterno && datos.costoPersonalExterno !== undefined) {
    costoPersonalExterno = Number(datos.costoPersonalExterno);
    if (!Number.isFinite(costoPersonalExterno) || costoPersonalExterno < 0) {
      throw new ApiError(400, 'El costo del personal externo no es válido');
    }
  }

  return withTransaction(async (client) => {
    const id = await repository.crear(
      {
        idRequerimiento,
        prioridad,
        estado: 'pendiente',
        observaciones: datos.observaciones ?? null,
        idResponsable,
        idPersonalExterno,
        costoPersonalExterno,
      },
      client,
    );

    await historialRepository.crear(
      id,
      {
        estado: 'pendiente',
        motivo: `Tarea creada a partir del requerimiento ${etiquetaRequerimiento(idRequerimiento)}`,
        idUsuario: actor.id,
      },
      client,
    );

    await requerimientosRepository.cambiarEstado(
      idRequerimiento,
      'asignado',
      client,
    );

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
  if (!PRIORIDADES.includes(prioridad)) {
    throw new ApiError(400, 'La prioridad debe ser baja, media o alta');
  }

  const { idResponsable, idPersonalExterno } = resolverResponsable(
    datos,
    actual,
  );
  await validarResponsableExiste(idResponsable, idPersonalExterno);

  let costoPersonalExterno = actual.costoPersonalExterno;
  if (datos.costoPersonalExterno !== undefined) {
    costoPersonalExterno = Number(datos.costoPersonalExterno);
    if (!Number.isFinite(costoPersonalExterno) || costoPersonalExterno < 0) {
      throw new ApiError(400, 'El costo del personal externo no es válido');
    }
  }

  if (!idPersonalExterno) {
    costoPersonalExterno = null;
  }

  await repository.actualizar(id, {
    prioridad,
    observaciones:
      datos.observaciones !== undefined
        ? datos.observaciones
        : actual.observaciones,
    idResponsable,
    idPersonalExterno,
    costoPersonalExterno,
    fechaInicio:
      datos.fechaInicio !== undefined ? datos.fechaInicio : actual.fechaInicio,
    fechaFin: datos.fechaFin !== undefined ? datos.fechaFin : actual.fechaFin,
  });

  return obtener(id);
}

export async function cambiarEstado(id, datos, actor) {
  const actual = await buscarTarea(id);
  const estado = datos.estado;

  if (!ESTADOS_JEFE.includes(estado)) {
    throw new ApiError(
      400,
      `El estado debe ser uno de: ${ESTADOS_JEFE.join(', ')}`,
    );
  }

  if (['aprobada', 'rechazada'].includes(actual.estado)) {
    throw new ApiError(409, 'La tarea ya fue evaluada por el Directivo');
  }

  if (actual.estado === estado) {
    throw new ApiError(400, 'La tarea ya se encuentra en ese estado');
  }

  if (['demorada', 'cancelada'].includes(estado) && !datos.motivo) {
    throw new ApiError(400, `El motivo es obligatorio para el estado ${estado}`);
  }

  const fechaInicio =
    estado === 'en-proceso' && !actual.fechaInicio
      ? new Date()
      : estado === 'pendiente'
        ? null
        : actual.fechaInicio;

  const fechaFin = ['finalizada', 'cancelada'].includes(estado)
    ? new Date()
    : null;

  return withTransaction(async (client) => {
    await repository.cambiarEstado(
      id,
      {
        estado,
        fechaInicio,
        fechaFin,
        idDirectivo: actual.idDirectivo,
      },
      client,
    );

    await historialRepository.crear(
      id,
      {
        estado,
        motivo:
          datos.motivo ??
          `Cambio de estado a ${estado} por el Jefe de Mantenimiento`,
        idUsuario: actor.id,
      },
      client,
    );

    const estadoRequerimiento =
      estado === 'finalizada'
        ? 'finalizada'
        : estado === 'cancelada'
          ? 'cancelada'
          : estado === 'pendiente'
            ? 'asignado'
            : 'en-proceso';

    await requerimientosRepository.cambiarEstado(
      actual.idRequerimiento,
      estadoRequerimiento,
      client,
    );

    if (estado === 'finalizada') {
      await notificacionesRepository.crearParaRol(
        'directivo',
        {
          idTarea: id,
          tipo: 'tarea-finalizada',
          titulo: 'Tarea finalizada',
          mensaje: `La tarea ${etiquetaTarea(id)}: ${actual.requerimientoTitulo} pasó a finalizada y espera tu aprobación.`,
        },
        client,
      );
    }

    if (estado === 'cancelada') {
      await notificacionesRepository.crearParaRol(
        'directivo',
        {
          idTarea: id,
          tipo: 'tarea-cancelada',
          titulo: 'Tarea cancelada',
          mensaje: `La tarea ${etiquetaTarea(id)} fue cancelada. Motivo: ${datos.motivo}.`,
        },
        client,
      );
    }

    const tarea = await repository.obtenerPorId(id, client);
    return mapearTarea(tarea);
  });
}

export async function evaluar(id, datos, actor) {
  const actual = await buscarTarea(id);
  const estado = datos.estado;

  if (!ESTADOS_EVALUACION.includes(estado)) {
    throw new ApiError(400, 'La evaluación debe ser aprobada o rechazada');
  }

  if (actual.estado !== 'finalizada') {
    throw new ApiError(
      409,
      'Solo se pueden evaluar tareas que están finalizadas',
    );
  }

  if (estado === 'rechazada' && !datos.motivo) {
    throw new ApiError(400, 'El motivo es obligatorio para rechazar una tarea');
  }

  return withTransaction(async (client) => {
    await repository.cambiarEstado(
      id,
      {
        estado,
        fechaInicio: actual.fechaInicio,
        fechaFin: actual.fechaFin,
        idDirectivo: actor.id,
      },
      client,
    );

    await historialRepository.crear(
      id,
      {
        estado,
        motivo:
          datos.motivo ??
          `El Directivo ${estado === 'aprobada' ? 'aprobó' : 'rechazó'} la tarea`,
        idUsuario: actor.id,
      },
      client,
    );

    let tareaEquivalenteId = null;

    if (estado === 'rechazada') {
      tareaEquivalenteId = await repository.crear(
        {
          idRequerimiento: actual.idRequerimiento,
          prioridad: actual.prioridad,
          estado: 'pendiente',
          observaciones: `Tarea generada por el rechazo de ${etiquetaTarea(id)}`,
          idResponsable: actual.idResponsable,
          idPersonalExterno: actual.idPersonalExterno,
          idTareaOrigen: id,
          costoPersonalExterno: actual.costoPersonalExterno,
        },
        client,
      );

      await historialRepository.crear(
        tareaEquivalenteId,
        {
          estado: 'pendiente',
          motivo: `Tarea generada por el rechazo de ${etiquetaTarea(id)}`,
          idUsuario: actor.id,
        },
        client,
      );

      await requerimientosRepository.cambiarEstado(
        actual.idRequerimiento,
        'asignado',
        client,
      );
    } else {
      await requerimientosRepository.cambiarEstado(
        actual.idRequerimiento,
        'finalizada',
        client,
      );
    }

    await notificacionesRepository.crearParaRol(
      'jefeMantenimiento',
      {
        idTarea: id,
        tipo: estado === 'aprobada' ? 'tarea-aprobada' : 'tarea-rechazada',
        titulo:
          estado === 'aprobada' ? 'Tarea aprobada' : 'Tarea rechazada',
        mensaje: `El Directivo ${estado === 'aprobada' ? 'aprobó' : 'rechazó'} la tarea ${etiquetaTarea(id)}: ${actual.requerimientoTitulo}.${
          datos.motivo ? ` Motivo: ${datos.motivo}.` : ''
        }`,
      },
      client,
    );

    const tarea = await repository.obtenerPorId(id, client);
    return {
      ...mapearTarea(tarea),
      tareaEquivalenteId,
    };
  });
}

export async function listarEstados() {
  return {
    prioridades: PRIORIDADES,
    estados: ESTADOS_JEFE,
    evaluaciones: ESTADOS_EVALUACION,
  };
}
