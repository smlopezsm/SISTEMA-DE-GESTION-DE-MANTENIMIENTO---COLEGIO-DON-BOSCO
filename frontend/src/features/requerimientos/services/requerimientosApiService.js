import { apiRequest } from '../../../shared/api/apiClient';
import { obtenerToken } from '../../auth/services/authService';

function formatearFechaHora(valor) {
  if (!valor) return '';

  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);

  return fecha
    .toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/,\s*/, ' ');
}

function mapearRequerimiento(requerimiento) {
  return {
    id: requerimiento.id,
    titulo: requerimiento.titulo,
    descripcion: requerimiento.descripcion,
    sector: requerimiento.sector ?? requerimiento.lugar ?? '',
    lugar: requerimiento.sector ?? requerimiento.lugar ?? '',
    reportadoPor: requerimiento.reportadoPor,
    rolReportante: requerimiento.rolReportante,
    fechaHora: formatearFechaHora(requerimiento.fechaHora),
    estado: requerimiento.estado,
    imagen: requerimiento.imagen ?? null,
    categoria: requerimiento.categoria ?? null, // <-- AGREGADO
  };
}

export async function crearRequerimiento(datos) {
  return apiRequest('/requerimientos', {
    method: 'POST',
    token: obtenerToken(),
    body: datos,
  });
}

export async function obtenerMisRequerimientos() {
  const requerimientos = await apiRequest('/requerimientos', {
    token: obtenerToken(),
  });

  return requerimientos.map(mapearRequerimiento);
}

export async function obtenerRequerimientos() {
  const requerimientos = await apiRequest('/requerimientos', {
    token: obtenerToken(),
  });
  return requerimientos.map(mapearRequerimiento);
}

export async function obtenerRequerimientoPorId(id) {
  const requerimiento = await apiRequest(`/requerimientos/${id}`, {
    token: obtenerToken(),
  });
  return mapearRequerimiento(requerimiento);
}

export async function obtenerCategorias() {
  return apiRequest('/requerimientos/categorias', { token: obtenerToken() });
}

export async function eliminarRequerimiento(id) {
  await apiRequest(`/requerimientos/${id}`, {
    method: 'DELETE',
    token: obtenerToken(),
  });
}