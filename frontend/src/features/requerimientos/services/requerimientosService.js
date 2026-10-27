import { apiRequest } from '../../../shared/api/apiClient';
import { obtenerToken } from '../../auth/services/authService';

function formatearFechaHora(valor) {
  if (!valor) return '';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha
    .toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
    .replace(/,\s*/, ' ');
}

function mapearRequerimiento(r) {
  return {
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    sector: r.sector ?? r.lugar ?? '',
    lugar: r.sector ?? r.lugar ?? '',
    reportadoPor: r.reportadoPor,
    rolReportante: r.rolReportante,
    fechaHora: formatearFechaHora(r.fechaHora ?? r.fecha),
    estado: r.estado,
    imagen: r.imagen ?? null,
  };
}

export async function obtenerRequerimientos() {
  const requerimientos = await apiRequest('/requerimientos', {
    token: obtenerToken(),
  });
  return requerimientos.map(mapearRequerimiento);
}

export const getRequerimientos = obtenerRequerimientos;

export async function obtenerRequerimientoPorId(id) {
  const requerimiento = await apiRequest(`/requerimientos/${id}`, {
    token: obtenerToken(),
  });
  return mapearRequerimiento(requerimiento);
}

export function obtenerLugares() {
  // Se calcula desde el listado que ya se trajo
  // O se puede pedir al back un endpoint de sectores (no está implementado)
  return [];
}

export async function crearRequerimiento(datos) {
  const requerimiento = await apiRequest('/requerimientos', {
    method: 'POST',
    token: obtenerToken(),
    body: datos,
  });
  return mapearRequerimiento(requerimiento);
}

export const guardarRequerimiento = crearRequerimiento;

export async function actualizarRequerimiento(id, datos) {
  const requerimiento = await apiRequest(`/requerimientos/${id}`, {
    method: 'PUT',
    token: obtenerToken(),
    body: datos,
  });
  return mapearRequerimiento(requerimiento);
}

export async function eliminarRequerimiento(id) {
  await apiRequest(`/requerimientos/${id}`, {
    method: 'DELETE',
    token: obtenerToken(),
  });
}