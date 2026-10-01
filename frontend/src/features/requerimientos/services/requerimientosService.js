import dataInicial from '@data/requerimientos.json';
import { leer, guardar } from '../../../shared/utils/storage';

const CLAVE = 'requerimientos';

export function obtenerRequerimientos() {
  return leer(CLAVE, dataInicial);
}

export function obtenerLugares() {
  const requerimientos = obtenerRequerimientos();
  const lugares = [...new Set(requerimientos.map((r) => r.lugar))];
  return lugares.sort();
}

export function obtenerRequerimientoPorId(id) {
  return obtenerRequerimientos().find((r) => r.id === id);
}

export function crearRequerimiento(datos) {
  const actual = obtenerRequerimientos();

  const numeros = actual
    .map((r) => parseInt(String(r.id).replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));

  const siguienteNumero = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
  const nuevoId = `REQ-${String(siguienteNumero).padStart(4, '0')}`;

  const ahora = new Date().toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const nuevoRequerimiento = {
    id: nuevoId,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    lugar: datos.lugar,
    reportadoPor: datos.reportadoPor,
    rolReportante: datos.rolReportante,
    fechaHora: ahora,
    estado: 'pendiente',
    imagen: datos.imagen ?? null,
  };

  guardar(CLAVE, [...actual, nuevoRequerimiento]);
  return nuevoRequerimiento;
}


// Codigo nuevo 
export const getRequerimientos = () => {
  const reqs = localStorage.getItem('requerimientos');
  return reqs ? JSON.parse(reqs) : [];
};

export const guardarRequerimiento = (requerimiento) => {
  const reqs = getRequerimientos();
  const nuevoRequerimiento = {
    ...requerimiento,
    id: `REQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    fecha: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
    estado: 'Pendiente'
  };
  localStorage.setItem('requerimientos', JSON.stringify([nuevoRequerimiento, ...reqs]));
  return nuevoRequerimiento;
};
//----------------- hasta aca 

export function actualizarRequerimiento(id, datos) {
  const actual = obtenerRequerimientos();
  const actualizado = actual.map((r) =>
    r.id === id ? { ...r, ...datos } : r
  );
  guardar(CLAVE, actualizado);
  return actualizado.find((r) => r.id === id);
}

export function eliminarRequerimiento(id) {
  const actual = obtenerRequerimientos();
  const filtrado = actual.filter((r) => r.id !== id);
  guardar(CLAVE, filtrado);
}