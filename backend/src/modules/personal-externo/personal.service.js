import { ApiError } from '../../utils/ApiError.js';
import * as repository from './personal.repository.js';

function normalizarDni(dni) {
  if (dni === undefined || dni === null || String(dni).trim() === '') {
    return null;
  }

  const limpio = String(dni).replace(/\D/g, '');
  if (limpio.length < 7 || limpio.length > 10) {
    throw new ApiError(400, 'El DNI debe tener entre 7 y 10 dígitos');
  }

  return limpio;
}

async function buscarPersonal(id) {
  const personal = await repository.obtenerPorId(id);
  if (!personal) {
    throw new ApiError(404, 'Personal externo no encontrado');
  }
  return personal;
}

export async function listar(filtros) {
  return repository.listar(filtros);
}

export async function obtener(id) {
  return buscarPersonal(id);
}

export async function crear(datos) {
  const nombre = String(datos.nombre ?? '').trim();
  const apellido = String(datos.apellido ?? '').trim();
  const telefono = String(datos.telefono ?? '').trim();
  const especialidad = String(datos.especialidad ?? '').trim();
  const dni = normalizarDni(datos.dni);

  if (!nombre || !apellido) {
    throw new ApiError(400, 'Nombre y apellido son obligatorios');
  }

  if (!telefono) {
    throw new ApiError(400, 'El teléfono es obligatorio');
  }

  if (!especialidad) {
    throw new ApiError(400, 'La especialidad es obligatoria');
  }

  const conflicto = await repository.existeDni(dni);
  if (conflicto) {
    throw new ApiError(409, 'Ya existe un personal externo con ese DNI');
  }

  const idEspecialidad = await repository.obtenerOCrearEspecialidad(especialidad);
  const id = await repository.crear({
    nombre,
    apellido,
    dni,
    email: datos.email ? String(datos.email).trim().toLowerCase() : null,
    telefono,
    idEspecialidad,
    matricula: datos.matricula ? String(datos.matricula).trim() : null,
    genero: datos.genero ? String(datos.genero).trim() : null,
    observaciones: datos.observaciones ? String(datos.observaciones).trim() : null,
  });

  return obtener(id);
}

export async function actualizar(id, datos) {
  const actual = await buscarPersonal(id);
  const nombre = String(datos.nombre ?? actual.nombre).trim();
  const apellido = String(datos.apellido ?? actual.apellido).trim();
  const telefono = String(datos.telefono ?? actual.telefono).trim();
  const especialidad = String(
    datos.especialidad ?? actual.especialidad,
  ).trim();
  const dni =
    datos.dni !== undefined ? normalizarDni(datos.dni) : actual.dni;

  if (!nombre || !apellido) {
    throw new ApiError(400, 'Nombre y apellido son obligatorios');
  }

  if (!telefono) {
    throw new ApiError(400, 'El teléfono es obligatorio');
  }

  if (!especialidad) {
    throw new ApiError(400, 'La especialidad es obligatoria');
  }

  const conflicto = await repository.existeDni(dni, id);
  if (conflicto) {
    throw new ApiError(409, 'Ya existe un personal externo con ese DNI');
  }

  const idEspecialidad = await repository.obtenerOCrearEspecialidad(especialidad);
  await repository.actualizar(id, {
    nombre,
    apellido,
    dni,
    email:
      datos.email !== undefined
        ? String(datos.email).trim().toLowerCase() || null
        : actual.email,
    telefono,
    idEspecialidad,
    matricula:
      datos.matricula !== undefined
        ? String(datos.matricula).trim() || null
        : actual.matricula,
    genero:
      datos.genero !== undefined
        ? String(datos.genero).trim() || null
        : actual.genero,
    observaciones:
      datos.observaciones !== undefined
        ? String(datos.observaciones).trim() || null
        : actual.observaciones,
    activo: datos.activo !== undefined ? Boolean(datos.activo) : actual.activo,
  });

  return obtener(id);
}

export async function eliminar(id) {
  await buscarPersonal(id);
  await repository.desactivar(id);
}
