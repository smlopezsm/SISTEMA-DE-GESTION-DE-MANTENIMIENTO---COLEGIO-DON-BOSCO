import { redirect } from 'react-router';
import { apiRequest } from '../../../shared/api/apiClient';

const CLAVE_SESION = 'sesion';

function leerSesion() {
  try {
    const datos = sessionStorage.getItem(CLAVE_SESION);
    return datos ? JSON.parse(datos) : null;
  } catch {
    return null;
  }
}

//guarda en sessionStorage y el token queda en el cliente
function guardarSesion(sesion) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

//hace una peticion al back
export async function iniciarSesion(usuarioOEmail, password) {
  const identificador = String(usuarioOEmail ?? '').trim();

  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: {
      nombreUsuario: identificador,
      email: identificador,
      password,
    },
  });

  guardarSesion({ token: data.token, usuario: data.usuario });
  return data.usuario;
}

//si el back devuelve error lanza una excepcion 
export async function registrarUsuario(datos) {
  return apiRequest('/auth/registro', {
    method: 'POST',
    body: datos,
  });
}

export function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
}

export function obtenerSesion() {
  const sesion = leerSesion();
  return sesion?.usuario ?? null;
}

export function obtenerToken() {
  return leerSesion()?.token ?? null;
}

export function actualizarSesion(datosActualizados) {
  const sesion = leerSesion();

  if (!sesion) return null;

  const actualizada = {
    ...sesion,
    usuario: { ...sesion.usuario, ...datosActualizados },
  };

  guardarSesion(actualizada);
  return actualizada.usuario;
}

export function protegerRuta() {
  const sesion = leerSesion();

  if (!sesion?.token || !sesion?.usuario) {
    throw redirect('/login');
  }

  return sesion.usuario;
}

export function requerirRol(rolesPermitidos) {
  return function loader() {
    const usuario = protegerRuta();

    if (!rolesPermitidos.includes(usuario.rol)) {
      throw new Response('No tenés permisos para acceder a esta sección.', {
        status: 403,
      });
    }

    return usuario;
  };
}
