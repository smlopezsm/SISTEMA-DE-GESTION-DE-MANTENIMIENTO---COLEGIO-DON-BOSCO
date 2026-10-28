import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import { mapearUsuario } from '../usuarios/usuarios.mapper.js';
import * as repository from './auth.repository.js';

const SALT_ROUNDS = 10;

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

//normaliza los dtos, valida los datos y crea el usuario en la base de datos
export async function registrar(datos) {
  const nombre = String(datos.nombre ?? '').trim();
  const apellido = String(datos.apellido ?? '').trim();
  const email = String(datos.email ?? '').trim().toLowerCase();
  const password = String(datos.password ?? '');
  const telefono = datos.telefono ? String(datos.telefono).trim() : null;
  const nombreUsuario = String(
    datos.nombreUsuario ?? datos.usuario ?? derivarNombreUsuario(email),
  )
    .trim()
    .toLowerCase();

  if (!nombre) {
    throw new ApiError(400, 'El nombre es obligatorio');
  }

  if (!email) {
    throw new ApiError(400, 'El email es obligatorio');
  }

  if (!password || password.length < 6) {
    throw new ApiError(400, 'La contraseña debe tener al menos 6 caracteres');
  }

  if (!/^[a-z0-9._-]{3,50}$/.test(nombreUsuario)) {
    throw new ApiError(
      400,
      'El nombre de usuario debe tener entre 3 y 50 caracteres sin espacios',
    );
  }

  const dni = normalizarDni(datos.dni);
  //bsuca en la base de datos si ya existe un usuario con el mismo nombre de usuario, email o dni y lanza un error
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

  //llama al repositorio para obtener el rol de ordenanza, si no existe lanza un error
  const rol = await repository.obtenerRolPorNombre('ordenanza');
  if (!rol) {
    throw new ApiError(500, 'No está configurado el rol Ordenanza');
  }

  //hashea la contraseña
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = await repository.crearUsuario({
    nombreUsuario,
    nombre,
    apellido,
    dni,
    email,
    passwordHash,
    idRol: rol.id_rol,
    telefono,
  });
  //busca el usuario creado y lo mapea para devolverlo
  const usuario = await repository.buscarPorId(id);
  return mapearUsuario(usuario);
}

//valida las credenciales y devuelve un token JWT y los datos del usuario
export async function login(datos) {
  const identificador = String(
    datos.nombreUsuario ?? datos.email ?? datos.usuario ?? '',
  ).trim();
  const password = String(datos.password ?? '');
  
  if (!identificador || !password) {
    throw new ApiError(400, 'Usuario/email y contraseña son obligatorios');
  }
  const usuario = await repository.buscarPorCredencial(identificador);
  //si no existe el usuario lanza un error
  const passwordOk =
    usuario && (await bcrypt.compare(password, usuario.password_hash));
  //si la contraseña no coincide lanza un error
  if (!passwordOk) {
    throw new ApiError(401, 'Credenciales inválidas');
  }
  //si el usuario esta dado de baja lanza un error
  if (!usuario.activo) {
    throw new ApiError(403, 'Esta cuenta está dada de baja');
  }
  //si todo es correcto genera un token JWT con los datos del usuario y lo devuelve junto con los datos del usuario
  const token = jwt.sign(
    {
      sub: usuario.id_usuario,
      rol: usuario.rol,
      nombreUsuario: usuario.nombre_usuario,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
  //devuelve el token y los datos del usuario mapeados
  return {
    token,
    usuario: mapearUsuario(usuario),
  };
}
//busca el usuario por id y devuelve los datos mapeados, si no existe lanza un error
export async function perfil(id) {
  const usuario = await repository.buscarPorId(id);

  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  return mapearUsuario(usuario);
}
