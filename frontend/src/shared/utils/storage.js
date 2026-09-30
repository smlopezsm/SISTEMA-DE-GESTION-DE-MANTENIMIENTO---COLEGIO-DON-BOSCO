
export function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado === null) return valorInicial;
    return JSON.parse(guardado);
  } catch (error) {
    console.error(`Error al leer "${clave}" del localStorage:`, error);
    return valorInicial;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    console.error(`Error al guardar "${clave}" en el localStorage:`, error);
  }
}

export function limpiar(clave) {
  localStorage.removeItem(clave);
}

export function limpiarTodo() {
  const claves = [
    'personalExterno',
    'tareas',
    'compras',
    'requerimientos',
    'notificaciones',
  ];
  claves.forEach((clave) => localStorage.removeItem(clave));
  console.log('localStorage limpio');
}