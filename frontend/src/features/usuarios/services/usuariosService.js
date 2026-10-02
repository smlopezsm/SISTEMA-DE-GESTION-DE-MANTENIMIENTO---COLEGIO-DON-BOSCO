import directivos from '@data/directivos.json';
import jefeMantenimiento from '@data/jefeMantenimiento.json';
import ordenanzas from '@data/ordenanzas.json';

const CLAVE_STORAGE = 'usuarios_ediciones';

(function limpiarEdicionesInvalidas() {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    if (!raw) return;

    const ediciones = JSON.parse(raw);
    const limpias = {};

    Object.entries(ediciones).forEach(([clave, u]) => {
      const esValido =
        u &&
        u.nombre && String(u.nombre).trim() !== '' &&
        u.apellido && String(u.apellido).trim() !== '' &&
        u.dni && !isNaN(Number(u.dni)) &&
        u.email;

      if (esValido) {
        limpias[clave] = u;
      } else {
        console.warn(' Edición inválida eliminada:', clave, u);
      }
    });

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(limpias));
  } catch (err) {
    console.error('Error limpiando ediciones:', err);
    localStorage.removeItem(CLAVE_STORAGE);
  }
})();


function todosLosUsuariosBase() {
  return [
    ...directivos.directivos,
    jefeMantenimiento.jefeMantenimiento,
    ...ordenanzas.ordenanzas,
  ].map(({ password, ...usuario }) => ({
    ...usuario,
    clave: `${usuario.rol}-${usuario.id}`,
  }));
}

function leerEdiciones() {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function guardarEdiciones(ediciones) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(ediciones));
}

function aplicarEdiciones(usuarios) {
  const ediciones = leerEdiciones();

  const base = usuarios.map((u) => ({
    ...u,
    ...(ediciones[u.clave] ?? {}),
  }));

  const clavesBase = new Set(base.map((u) => u.clave));
  const nuevos = Object.values(ediciones).filter(
    (u) => !clavesBase.has(u.clave)
  );

  return [...nuevos, ...base];
}

export async function obtenerUsuarios() {
  return aplicarEdiciones(todosLosUsuariosBase());
}

export function obtenerUsuarioPorClave(clave) {
  const todos = aplicarEdiciones(todosLosUsuariosBase());
  return todos.find((u) => u.clave === clave) ?? null;
}

export function existeUsuario(nombreUsuario, email) {
  const u = (nombreUsuario || '').trim().toLowerCase();
  const e = (email || '').trim().toLowerCase();
  const todos = aplicarEdiciones(todosLosUsuariosBase());
  return todos.some(
    (user) =>
      user.usuario?.toLowerCase() === u ||
      user.email?.toLowerCase() === e
  );
}

export function actualizarUsuario(clave, datos) {
  const ediciones = leerEdiciones();
  ediciones[clave] = { ...(ediciones[clave] ?? {}), ...datos };
  guardarEdiciones(ediciones);
  return obtenerUsuarioPorClave(clave);
}

export function cambiarEstadoUsuario(clave, activo) {
  return actualizarUsuario(clave, { activo });
}

export function crearUsuario(datos) {
  const requeridos = ['nombre', 'apellido', 'usuario', 'email', 'dni', 'rol'];
  for (const campo of requeridos) {
    if (!datos[campo] || String(datos[campo]).trim() === '') {
      throw new Error(`El campo "${campo}" es obligatorio.`);
    }
  }
  if (datos.rol === 'directivo' && !datos.cargo) {
    throw new Error('El cargo es obligatorio para un Directivo.');
  }

  const dniLimpio = String(datos.dni).replace(/\D/g, '');
  if (!dniLimpio) {
    throw new Error('El DNI debe contener solo números.');
  }

  if (existeUsuario(datos.usuario, datos.email)) {
    throw new Error('Ya existe un usuario con ese nombre de usuario o correo.');
  }

  const todos = todosLosUsuariosBase();
  const siguienteId = Math.max(0, ...todos.map((u) => Number(u.id) || 0)) + 1;
  const clave = `${datos.rol}-${siguienteId}`;
  const passwordTemporal = String(Math.floor(10000000 + Math.random() * 90000000));

  const nuevo = {
    id: siguienteId,
    clave,
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    usuario: datos.usuario.trim().toLowerCase(),
    email: datos.email.trim().toLowerCase(),
    dni: dniLimpio,
    rol: datos.rol,
    activo: true,
    ...(datos.rol === 'directivo' ? { cargo: datos.cargo } : {}),
    _passwordTemporal: passwordTemporal,
  };

  const ediciones = leerEdiciones();
  ediciones[clave] = nuevo;
  guardarEdiciones(ediciones);

  return nuevo;
}