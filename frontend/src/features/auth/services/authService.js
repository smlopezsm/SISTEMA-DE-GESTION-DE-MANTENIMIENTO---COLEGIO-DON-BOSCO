import { redirect } from "react-router";
import ordenanzasData from "@data/ordenanzas.json";
import directivosData from "@data/directivos.json";
import jefeMantenimientoData from "@data/jefeMantenimiento.json";

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

  const sesion = { ...encontrado };

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

export function actualizarSesion(datosActualizados) {
  const actual = obtenerSesion() ?? {};
  const nuevo = { ...actual, ...datosActualizados };
  sessionStorage.setItem("sesion", JSON.stringify(nuevo));
  return nuevo;
}

export function protegerRuta() {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw redirect("/login");
  }
  return sesion;
}

export function requerirRol(rolesPermitidos) {
  return function loader() {
    const sesion = protegerRuta();

    if (!rolesPermitidos.includes(sesion.rol)) {
      throw new Response("No tenés permisos para acceder a esta sección.", {
        status: 403,
      });
    }

    return sesion;
  };
}