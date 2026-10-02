// src/features/auth/services/authService.js
import { redirect } from "react-router";
import ordenanzasData from "@data/ordenanzas.json";
import directivosData from "@data/directivos.json";
import jefeMantenimientoData from "@data/jefeMantenimiento.json";

// ─────────────────────────────────────────────
// Obtener todos los usuarios de los JSON
// ─────────────────────────────────────────────
function obtenerTodosLosUsuarios() {
  return [
    ...ordenanzasData.ordenanzas,
    ...directivosData.directivos,
    jefeMantenimientoData.jefeMantenimiento,
  ];
}

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────
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

  // ✅ Guardamos el usuario COMPLETO (todos sus campos)
  // 👇 Único cambio respecto a tu versión original
  const sesion = { ...encontrado };

  sessionStorage.setItem("sesion", JSON.stringify(sesion));
  return sesion;
}

// ─────────────────────────────────────────────
// Cerrar sesión
// ─────────────────────────────────────────────
export function cerrarSesion() {
  sessionStorage.removeItem("sesion");
}

// ─────────────────────────────────────────────
// Obtener sesión actual
// ─────────────────────────────────────────────
export function obtenerSesion() {
  const datos = sessionStorage.getItem("sesion");
  return datos ? JSON.parse(datos) : null;
}

// ─────────────────────────────────────────────
// Actualizar sesión (para el perfil)
// ─────────────────────────────────────────────
export function actualizarSesion(datosActualizados) {
  const actual = obtenerSesion() ?? {};
  const nuevo = { ...actual, ...datosActualizados };
  sessionStorage.setItem("sesion", JSON.stringify(nuevo));
  return nuevo;
}

// ─────────────────────────────────────────────
// Protección de rutas
// ─────────────────────────────────────────────
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