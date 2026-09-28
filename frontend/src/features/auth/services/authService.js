import ordenanzasData from "../../../data/ordenanzas.json";
import directivosData from "../../../data/directivos.json";
import jefeMantenimientoData from "../../../data/jefeMantenimiento.json";

function obtenerTodosLosUsuarios() {
  return [
    ...ordenanzasData.ordenanzas,
    ...directivosData.directivos,
    jefeMantenimientoData.jefeMantenimiento,
  ];
}

export function iniciarSesion(usuarioOEmail, password) {
  const todos = obtenerTodosLosUsuarios();

  const encontrado = todos.find(
    (u) =>
      (u.usuario === usuarioOEmail || u.email === usuarioOEmail) &&
      u.password === password
  );

  if (!encontrado) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  if (!encontrado.activo) {
    throw new Error("Esta cuenta está dada de baja.");
  }

  const sesion = {
    id: encontrado.id,
    nombre: encontrado.nombre,
    apellido: encontrado.apellido,
    email: encontrado.email,
    rol: encontrado.rol,
  };

  sessionStorage.setItem("sesion", JSON.stringify(sesion));
  return sesion;
}

export function cerrarSesion() {
  sessionStorage.removeItem("sesion");
}

export function obtenerSesion() {
  const datos = sessionStorage.getItem("sesion");
  return datos ? JSON.parse(datos) : null;
}