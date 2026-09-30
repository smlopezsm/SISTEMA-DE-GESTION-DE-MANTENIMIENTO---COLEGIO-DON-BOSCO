// Punto único de acceso a datos de usuarios.
// Une las tres listas por rol en una sola y descarta la contraseña para que nunca llegue a la UI.
import directivos from '../../../../../backend/data/directivos.json';
import jefeMantenimiento from '../../../../../backend/data/jefeMantenimiento.json';
import ordenanzas from '../../../../../backend/data/ordenanzas.json';

export async function obtenerUsuarios() {
  return [
    ...directivos.directivos,
    jefeMantenimiento.jefeMantenimiento,
    ...ordenanzas.ordenanzas,
  ].map(({ password, ...usuario }) => ({
    ...usuario,
    // los id se repiten entre roles, así que la clave de React combina rol + id
    clave: `${usuario.rol}-${usuario.id}`,
  }));
}
