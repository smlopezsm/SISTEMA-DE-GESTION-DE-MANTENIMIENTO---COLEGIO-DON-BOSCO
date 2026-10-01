export const actualizarUsuario = (datosActualizados) => {
  // Asumimos que el usuario actual se guarda en 'usuario_sesion'
  // Cambia esta key si tu authService usa otra distinta
  const usuarioActual = JSON.parse(localStorage.getItem('usuario_sesion')) || {};
  const nuevoUsuario = { ...usuarioActual, ...datosActualizados };
  localStorage.setItem('usuario_sesion', JSON.stringify(nuevoUsuario));
  return nuevoUsuario;
};