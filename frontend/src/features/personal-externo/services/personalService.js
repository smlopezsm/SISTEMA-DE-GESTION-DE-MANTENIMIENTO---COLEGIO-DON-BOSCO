import dataInicial from '@data/personalExterno.json';
import { leer, guardar } from '../../../shared/utils/storage';

const CLAVE = 'personalExterno';

// vuelve el listado completo, lee del localStorage, si no hay nada, usa el JSON 
export function obtenerPersonal() {
  return leer(CLAVE, dataInicial.personalExterno ?? []);
}

// devuelve las especialidades
export function obtenerEspecialidades() {
  const personal = obtenerPersonal();
  const especialidades = personal.map((p) => p.especialidad);
  return [...new Set(especialidades)].sort();
}

// busca por id
export function obtenerPersonalPorId(id) {
  return obtenerPersonal().find((p) => p.id === id);
}

// crea un nuevo personal
export function crearPersonal(datos) {
  const actual = obtenerPersonal();
  const nuevoId = `EXT-${String(actual.length + 1).padStart(3, '0')}`;
  const nuevo = { id: nuevoId, ...datos, activo: datos.activo ?? true, fechaAlta: new Date().toLocaleDateString('es-AR'), };
  guardar(CLAVE, [...actual, nuevo]);
  return nuevo;
}

// actualiza/modifica personal existente
export function actualizarPersonal(id, datos) {
  const actual = obtenerPersonal();
  const actualizado = actual.map((p) => p.id === id ? { ...p, ...datos } : p );
  guardar(CLAVE, actualizado);
  return actualizado.find((p) => p.id === id);
}

//elimina un personal
export function eliminarPersonal(id) {
  const actual = obtenerPersonal();
  const filtrado = actual.filter((p) => p.id !== id);
  guardar(CLAVE, filtrado);
}