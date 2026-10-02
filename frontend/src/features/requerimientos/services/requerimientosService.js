// src/features/requerimientos/services/requerimientosService.js
import dataInicial from '@data/requerimientos.json';
import { leer, guardar } from '../../../shared/utils/storage';

const CLAVE = 'requerimientos';

// ─────────────────────────────────────────────
// Lectura
// ─────────────────────────────────────────────

export function obtenerRequerimientos() {
  return leer(CLAVE, dataInicial);
}

export function getRequerimientos() {
  return obtenerRequerimientos();  // alias, por si quedó algún import viejo
}

export function obtenerRequerimientoPorId(id) {
  return obtenerRequerimientos().find((r) => r.id === id);
}

export function obtenerLugares() {
  const requerimientos = obtenerRequerimientos();
  return [...new Set(requerimientos.map((r) => r.lugar))].sort();
}

// ─────────────────────────────────────────────
// Escritura
// ─────────────────────────────────────────────

export function crearRequerimiento(datos) {
  const actual = obtenerRequerimientos();

  // Generar ID nuevo: REQ-0001, REQ-0002, ...
  const numeros = actual
    .map((r) => parseInt(String(r.id).replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n));
  const siguiente = numeros.length > 0 ? Math.max(...numeros) + 1 : 1;
  const nuevoId = `REQ-${String(siguiente).padStart(4, '0')}`;

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
    sector: datos.sector ?? '',
    lugar: datos.lugar,
    reportadoPor: datos.reportadoPor,
    rolReportante: datos.rolReportante,
    fechaHora: ahora,
    estado: 'pendiente',
    imagen: datos.imagen ?? null,
  };

  guardar(CLAVE, [nuevoRequerimiento, ...actual]);  // el nuevo al principio
  return nuevoRequerimiento;
}

// Alias por compatibilidad con código viejo
export const guardarRequerimiento = crearRequerimiento;

export function actualizarRequerimiento(id, datos) {
  const actual = obtenerRequerimientos();
  const actualizado = actual.map((r) => (r.id === id ? { ...r, ...datos } : r));
  guardar(CLAVE, actualizado);
  return actualizado.find((r) => r.id === id);
}

export function eliminarRequerimiento(id) {
  const actual = obtenerRequerimientos();
  guardar(CLAVE, actual.filter((r) => r.id !== id));
}