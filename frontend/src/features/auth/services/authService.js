//servicio de autenticacion
import { redirect } from "react-router";
import ordenanzasData from "@data/ordenanzas.json";
import directivosData from "@data/directivos.json";
import jefeMantenimientoData from "@data/jefeMantenimiento.json";

// obtener todos los usuarios de los archivos JSON
function obtenerTodosLosUsuarios() {
  return [
    ...ordenanzasData.ordenanzas,
    ...directivosData.directivos,
    jefeMantenimientoData.jefeMantenimiento,
  ];
}

// función para iniciar sesión
export function iniciarSesion(usuarioOEmail, password) {
  const todos = obtenerTodosLosUsuarios();

  // buscar el usuario por nombre de usuario o email y verificar la contraseña
  //find devuelve el primer elemento que cumpla la condición, si no encuentra ninguno devuelve undefined
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

  // crear un objeto de sesion con la informacion del usuario encontrado
  const sesion = {
    id: encontrado.id,
    nombre: encontrado.nombre,
    apellido: encontrado.apellido,
    email: encontrado.email,
    rol: encontrado.rol,
  };

  // guardar la sesion en sessionStorage
  //JSON.stringify convierte un objeto en una cadena JSON para poder guardarlo en sessionStorage
  sessionStorage.setItem("sesion", JSON.stringify(sesion));
  return sesion;
}

// funcion para cerrar sesion
export function cerrarSesion() {
  sessionStorage.removeItem("sesion");
}

// funcion para obtener la sesion actual
//JSON.parse convierte una cadena JSON en un objeto para poder usarlo en el codigo
export function obtenerSesion() {
  const datos = sessionStorage.getItem("sesion");
  return datos ? JSON.parse(datos) : null;
}

// funcion para proteger rutas, si no hay sesion redirige a login
export function protegerRuta() {
  const sesion = obtenerSesion();
  if (!sesion) {
    throw redirect("/login");
  }
  return sesion;
}

// funcion para requerir un rol especifico, si el rol no coincide lanza un error 403
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