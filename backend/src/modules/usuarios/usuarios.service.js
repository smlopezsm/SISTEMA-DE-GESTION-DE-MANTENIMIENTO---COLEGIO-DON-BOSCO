import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { ApiError } from '../../utils/ApiError.js';
import { mapearUsuario } from './usuarios.mapper.js';
import * as repository from './usuarios.repository.js';

const SALT_ROUNDS = 10;
const ROLES = ['ordenanza', 'jefeMantenimiento', 'directivo'];

function derivarNombreUsuario(email) {
  return String(email).split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

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

function generarPasswordTemporal() {
  return crypto.randomBytes(8).toString('base64url').slice(0, 10);
}

async function buscarUsuario(id, verificarActivo=true) {
  const usuario = await repository.obtenerPorId(id);
  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }
  if (verificarActivo && !usuario.activo) {
    throw new ApiError(404, 'Usuario dado de baja');
  }
  return usuario;
}

function validarRol(rol) {
  if (!ROLES.includes(rol)) {
    throw new ApiError(400, `El rol debe ser uno de: ${ROLES.join(', ')}`);
  }
}

async function resolverRolYCargo(rol, cargo) {
  validarRol(rol);

  const filaRol = await repository.obtenerIdRol(rol);
  if (!filaRol) {
    throw new ApiError(400, 'El rol indicado no existe');
  }

  if (rol === 'directivo') {
    if (!cargo) {
      throw new ApiError(400, 'El cargo es obligatorio para un Directivo');
    }

    const filaCargo = await repository.obtenerIdCargo(cargo);
    if (!filaCargo) {
      throw new ApiError(400, 'El cargo indicado no existe');
    }

    return { idRol: filaRol.id_rol, idCargo: filaCargo.id_cargo };
  }

  return { idRol: filaRol.id_rol, idCargo: null };
}

export async function listar(filtros) {
  const usuarios = await repository.listar(filtros);
  return usuarios.map(mapearUsuario);
}

export async function obtener(id, actor) {
  const usuario = await buscarUsuario(id, true);
  const esPropio = Number(actor.id) === Number(id);

  if (actor.rol !== 'directivo' && !esPropio) {
    throw new ApiError(403, 'No tenés permisos para ver este usuario');
  }

  return mapearUsuario(usuario);
}

export async function crear(datos) {
  const nombre = String(datos.nombre ?? '').trim();
  const apellido = String(datos.apellido ?? '').trim();
  const email = String(datos.email ?? '').trim().toLowerCase();
  const nombreUsuario = String(
    datos.nombreUsuario ?? datos.usuario ?? derivarNombreUsuario(email),
  )
    .trim()
    .toLowerCase();
  const rol = datos.rol;
  const telefono = datos.telefono ? String(datos.telefono).trim() : null;
  const dni = normalizarDni(datos.dni);

  if (!nombre || !apellido) {
    throw new ApiError(400, 'Nombre y apellido son obligatorios');
  }

  if (!email) {
    throw new ApiError(400, 'El email es obligatorio');
  }

  if (!/^[a-z0-9._-]{3,50}$/.test(nombreUsuario)) {
    throw new ApiError(
      400,
      'El nombre de usuario debe tener entre 3 y 50 caracteres sin espacios',
    );
  }

  const { idRol, idCargo } = await resolverRolYCargo(rol, datos.cargo);
  const conflicto = await repository.existeConflicto({
    nombreUsuario,
    email,
    dni,
  });

  if (conflicto) {
    throw new ApiError(
      409,
      'Ya existe un usuario con ese nombre de usuario, email o DNI',
    );
  }

  let password = datos.password ? String(datos.password) : null;
  if (password !== null && password.length < 6) {
    throw new ApiError(400, 'La contraseña debe tener al menos 6 caracteres');
  }

  if (!password) {
    password = generarPasswordTemporal();
    console.log(
      `Contraseña temporal para ${nombreUsuario}: ${password} (no se devuelve por la API)`,
    );
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = await repository.crear({
    nombreUsuario,
    nombre,
    apellido,
    dni,
    email,
    passwordHash,
    idRol,
    telefono,
    idCargo,
    avatar: datos.avatar ?? null,
  });

  return obtener(id, { id, rol: 'directivo' });
}

export async function actualizar(id, datos, actor) {
  const usuario = await buscarUsuario(id,false);
  const esDirectivo = actor.rol === 'directivo';
  const esPropio = Number(actor.id) === Number(id);

  if (!esDirectivo && !esPropio) {
    throw new ApiError(403, 'No tenés permisos para modificar este usuario');
  }

  if (!esDirectivo) {
    const camposProhibidos = [
      'rol',
      'idRol',
      'activo',
      'cargo',
      'idCargo',
      'password',
      'nombreUsuario',
      'usuario',
      'email',
      'dni',
    ];

    const intentaCambiar = camposProhibidos.some(
      (campo) => datos[campo] !== undefined,
    );

    if (intentaCambiar) {
      throw new ApiError(
        403,
        'Solo un Directivo puede modificar el rol, estado o datos de la cuenta',
      );
    }
  }

  const nombre = String(datos.nombre ?? usuario.nombre).trim();
  const apellido = String(datos.apellido ?? usuario.apellido).trim();
  const telefono =
    datos.telefono !== undefined
      ? String(datos.telefono).trim()
      : usuario.telefono;
  const avatar = datos.avatar !== undefined ? datos.avatar : usuario.avatar;

  let nombreUsuario = usuario.nombre_usuario;
  let email = usuario.email;
  let dni = usuario.dni;
  let rol = usuario.rol;
  let cargo = usuario.cargo;
  let activo = usuario.activo;
  let passwordHash = usuario.password_hash;

  if (esDirectivo) {
    nombreUsuario = String(
      datos.nombreUsuario ?? datos.usuario ?? usuario.nombre_usuario,
    )
      .trim()
      .toLowerCase();
    email = String(datos.email ?? usuario.email).trim().toLowerCase();
    dni =
      datos.dni !== undefined ? normalizarDni(datos.dni) : usuario.dni;
    rol = datos.rol ?? usuario.rol;
    cargo = datos.cargo ?? usuario.cargo;
    activo = datos.activo ?? usuario.activo;

    if (datos.password !== undefined) {
      const password = String(datos.password);
      if (password.length < 6) {
        throw new ApiError(400, 'La contraseña debe tener al menos 6 caracteres');
      }
      passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
  }

  if (!nombre || !apellido) {
    throw new ApiError(400, 'Nombre y apellido son obligatorios');
  }

  if (!/^[a-z0-9._-]{3,50}$/.test(nombreUsuario)) {
    throw new ApiError(
      400,
      'El nombre de usuario debe tener entre 3 y 50 caracteres sin espacios',
    );
  }

  const { idRol, idCargo } = await resolverRolYCargo(rol, cargo);
  const conflicto = await repository.existeConflicto({
    nombreUsuario,
    email,
    dni,
    excluirId: id,
  });

  if (conflicto) {
    throw new ApiError(
      409,
      'Ya existe un usuario con ese nombre de usuario, email o DNI',
    );
  }

  await repository.actualizar(id, {
    nombreUsuario,
    nombre,
    apellido,
    dni,
    email,
    passwordHash,
    idRol,
    telefono,
    idCargo,
    avatar,
    activo,
  });

  const actualizado = await buscarUsuario(id);
  return mapearUsuario(actualizado);
}

export async function eliminar(id, actor) {
  const usuario = await buscarUsuario(id);

  if (Number(actor.id) === Number(id)) {
    throw new ApiError(400, 'No podés dar de baja tu propia cuenta');
  }

  if (usuario.rol === 'directivo' && usuario.activo) {
    const otros = await repository.contarDirectivosActivos(id);
    if (otros === 0) {
      throw new ApiError(
        409,
        'No podés dar de baja al último Directivo activo del sistema',
      );
    }
  }

  await repository.desactivar(id);
}
