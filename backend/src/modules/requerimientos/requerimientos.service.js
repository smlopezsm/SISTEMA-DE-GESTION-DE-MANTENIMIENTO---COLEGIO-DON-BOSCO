import { ApiError } from '../../utils/ApiError.js';
import { withTransaction } from '../../utils/transaccion.js';
import * as repository from './requerimientos.repository.js';
import * as notificacionesRepository from '../notificaciones/notificaciones.repository.js';

async function resolverSector(datos) {
  if (datos.idSector !== undefined && datos.idSector !== null) {
    const sector = await repository.obtenerSectorPorId(datos.idSector);
    if (!sector) {
      throw new ApiError(400, 'El sector indicado no existe');
    }
    return sector.id_sector;
  }

  const nombre = String(datos.sector ?? datos.lugar ?? '').trim();
  if (!nombre) {
    throw new ApiError(400, 'El sector es obligatorio');
  }

  return repository.obtenerOCrearSector(nombre);
}

function puedeVer(requerimiento, usuario) {
  return (
    usuario.rol === 'jefeMantenimiento' ||
    Number(requerimiento.idUsuario) === Number(usuario.id)
  );
}

export async function listar(usuario, filtros) {
  return repository.listar({
    idUsuario: usuario.id,
    rol: usuario.rol,
    sector: filtros.sector,
    estado: filtros.estado,
    desde: filtros.desde,
    hasta: filtros.hasta,
  });
}

export async function obtener(id, usuario) {
  const requerimiento = await repository.obtenerPorId(id);

  if (!requerimiento) {
    throw new ApiError(404, 'Requerimiento no encontrado');
  }

  if (!puedeVer(requerimiento, usuario)) {
    throw new ApiError(403, 'No tenés permisos para ver este requerimiento');
  }

  return requerimiento;
}

export async function crear(datos, usuario) {
  const titulo = String(datos.titulo ?? '').trim();
  const descripcion = String(datos.descripcion ?? '').trim();

  if (!titulo || !descripcion) {
    throw new ApiError(400, 'Título y descripción son obligatorios');
  }

  const idSector = await resolverSector(datos);

  return withTransaction(async (client) => {
    const id = await repository.crear(
      {
        titulo,
        descripcion,
        idSector,
        imagen: datos.imagen ?? null,
        idUsuario: usuario.id,
      },
      client,
    );

    await notificacionesRepository.crearParaRol(
      'jefeMantenimiento',
      {
        idRequerimiento: id,
        tipo: 'requerimiento',
        titulo: 'Nuevo requerimiento',
        mensaje: `Se emitió el requerimiento REQ-${String(id).padStart(4, '0')}: ${titulo}.`,
      },
      client,
    );

    return repository.obtenerPorId(id, client);
  });
}

export async function actualizar(id, datos, usuario) {
  const actual = await repository.obtenerPorId(id);

  if (!actual) {
    throw new ApiError(404, 'Requerimiento no encontrado');
  }

  const esJefe = usuario.rol === 'jefeMantenimiento';
  const esPropio = Number(actual.idUsuario) === Number(usuario.id);

  if (!esJefe && !esPropio) {
    throw new ApiError(403, 'No tenés permisos para modificar este requerimiento');
  }

  if (!esJefe && actual.estado !== 'pendiente') {
    throw new ApiError(
      403,
      'Solo podés modificar un requerimiento mientras está pendiente',
    );
  }

  const titulo = String(datos.titulo ?? actual.titulo).trim();
  const descripcion = String(datos.descripcion ?? actual.descripcion).trim();

  if (!titulo || !descripcion) {
    throw new ApiError(400, 'Título y descripción son obligatorios');
  }

  let idSector = actual.idSector;
  if (datos.idSector !== undefined || datos.sector !== undefined || datos.lugar !== undefined) {
    idSector = await resolverSector(datos);
  }

  await repository.actualizar(id, {
    titulo,
    descripcion,
    idSector,
    imagen: datos.imagen !== undefined ? datos.imagen : actual.imagen,
  });

  return repository.obtenerPorId(id);
}

export async function eliminar(id) {
  const requerimiento = await repository.obtenerPorId(id);

  if (!requerimiento) {
    throw new ApiError(404, 'Requerimiento no encontrado');
  }

  await repository.desactivar(id);
}
