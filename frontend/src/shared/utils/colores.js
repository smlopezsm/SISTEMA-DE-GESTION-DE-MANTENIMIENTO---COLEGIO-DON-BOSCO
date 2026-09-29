
// HELPERS DE COLORES
// Este modulo lee las variables CSS definidas y las expone como funciones reutilizables para JavaScript.

// Cache interno. Se llena la primera vez que se pide un color
let cacheColores = null;

//Carga todas las variables CSS de estados y prioridades desde :root y las guarda en el cache
function cargarColores() {
  if (cacheColores) return cacheColores;

  const root = getComputedStyle(document.documentElement);

  //leer una variable y limpiar
  const leer = (nombre) => root.getPropertyValue(nombre).trim();

  cacheColores = {
    
    pendiente:      leer('--estado-pendiente-solid'),
    'con-tarea':    leer('--estado-con-tarea-solid'),
    'en-proceso':   leer('--estado-proceso-solid'),
    demorada:       leer('--estado-demorada-solid'),
    finalizada:     leer('--estado-finalizada-solid'),
    aprobada:       leer('--estado-aprobada-solid'),
    rechazada:      leer('--estado-rechazada-solid'),
    cancelada:      leer('--estado-cancelada-solid'),

    alta:           leer('--prioridad-alta-solid'),
    media:          leer('--prioridad-media-solid'),
    baja:           leer('--prioridad-baja-solid'),
  };

  return cacheColores;
}

//Devuelve el color solido de un estado
export function colorDeEstado(clave) {
  return cargarColores()[clave] ?? '';
}

//Devuelve el color solido de una prioridad
export function colorDePrioridad(clave) {
  return cargarColores()[clave] ?? '';
}

//Devuelve TODOS los colores de estados y prioridades
export function obtenerTodosLosColores() {
  return { ...cargarColores() };
}

// Reinicia el cache
export function reiniciarCache() {
  cacheColores = null;
}