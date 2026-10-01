import dataInicial from '@data/tareas.json';
import requerimientos from '@data/requerimientos.json';
import ordenanzasData from '@data/ordenanzas.json';
import personalExternoData from '@data/personalExterno.json';
import { leer, guardar } from '../../../shared/utils/storage';

const CLAVE = 'tareas';

// vuelve el listado completo, lee del localStorage, si no hay nada, usa el JSON 

function leerEstado() {
  return leer(CLAVE, {
    tareas: dataInicial.tareas ?? [],
    porEstado: dataInicial.porEstado ?? [],
  });
}

/// guarda el estado del localStorage
function guardarEstado(estado) {
  guardar(CLAVE, estado);
}

// lectura

export function obtenerTareas() {
  return leerEstado().tareas;
}

export function obtenerPorEstado() {
  return leerEstado().porEstado;
}

export function obtenerTareaPorId(id) {
  return obtenerTareas().find((t) => t.id === id);
}

export function obtenerResponsables() {
  const responsables = obtenerTareas()
    .filter((t) => t.responsable)
    .map((t) => t.responsable.nombre);
  return [...new Set(responsables)].sort();
}

export function obtenerRequerimientoParaTarea(requerimientoId) {
  return requerimientos.find((r) => r.id === requerimientoId);
}

export function obtenerOrdenanzas() {
  return (ordenanzasData.ordenanzas ?? [])
    .filter((o) => o.activo)
    .map((o) => ({
      id: o.id,
      nombre: `${o.nombre} ${o.apellido}`,
      telefono: o.telefono,
      tipo: 'interno',
    }));
}

export function obtenerPersonalExterno() {
  // leer del localStorage,por si agregaron personal nuevo
  const personalGuardado = localStorage.getItem('personalExterno');
  const lista = personalGuardado
    ? JSON.parse(personalGuardado)
    : personalExternoData.personalExterno ?? [];

  return lista
    .filter((p) => p.activo !== false)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      telefono: p.telefono,
      especialidad: p.especialidad,
      tipo: 'externo',
    }));
}

//fechas

function fechaAhora() {
  return new Date().toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// escritura

export function crearTarea(datos) {
  const estado = leerEstado();
  const req = datos.requerimiento;
  const ahora = fechaAhora();

  const nuevaTarea = {
    id: `T-${String(estado.tareas.length + 200).padStart(4, '0')}`,
    requerimientoId: req.id,
    requerimientoTitulo: req.titulo,
    titulo: req.titulo,
    descripcion: req.descripcion,
    lugar: req.lugar,
    reportadoPor: req.reportadoPor,
    rolReportante: req.rolReportante,
    prioridad: datos.prioridad,
    estado: datos.estado ?? 'pendiente',
    responsable: datos.responsable,
    telefono: datos.telefono,
    observaciones: datos.observaciones,
    fechaCreacion: ahora,
    fechaFinalizacion: null,
    historial: [
      {
        fecha: ahora,
        estado: 'pendiente',
        motivo: `Tarea creada a partir del requerimiento ${req.id}`,
      },
    ],
  };

  guardarEstado({ ...estado, tareas: [...estado.tareas, nuevaTarea] });
  return nuevaTarea;
}

//modificacion de tarea
export function actualizarTarea(id, cambios) {
  const estado = leerEstado();
  const tareaActual = estado.tareas.find((t) => t.id === id);
  if (!tareaActual) return null;

  const ahora = fechaAhora();
  const cambiosEstado = tareaActual.estado !== cambios.estado;

  const tareaActualizada = {
    ...tareaActual,
    prioridad: cambios.prioridad ?? tareaActual.prioridad,
    observaciones: cambios.observaciones ?? tareaActual.observaciones,
    estado: cambios.estado ?? tareaActual.estado,
    historial: cambiosEstado
      ? [
          ...(tareaActual.historial ?? []),
          {
            fecha: ahora,
            estado: cambios.estado,
            motivo: 'Cambio de estado manual',
          },
        ]
      : tareaActual.historial,
  };

  const nuevasTareas = estado.tareas.map((t) =>
    t.id === id ? tareaActualizada : t
  );

  guardarEstado({ ...estado, tareas: nuevasTareas });
  return tareaActualizada;
}

//finalizacion de tarea
export function finalizarTarea(id) {
  const estado = leerEstado();
  const tareaActual = estado.tareas.find((t) => t.id === id);
  if (!tareaActual) return null;

  const ahora = fechaAhora();

  const tareaActualizada = {
    ...tareaActual,
    estado: 'finalizada',
    fechaFinalizacion: ahora,
    historial: [
      ...(tareaActual.historial ?? []),
      {
        fecha: ahora,
        estado: 'finalizada',
        motivo: 'Tarea finalizada',
      },
    ],
  };

  const nuevasTareas = estado.tareas.map((t) =>
    t.id === id ? tareaActualizada : t
  );

  guardarEstado({ ...estado, tareas: nuevasTareas });
  return tareaActualizada;
}

//cancelacion de tarea
export function cancelarTarea(id, motivo) {
  const estado = leerEstado();
  const tareaActual = estado.tareas.find((t) => t.id === id);
  if (!tareaActual) return null;

  const ahora = fechaAhora();

  const tareaActualizada = {
    ...tareaActual,
    estado: 'cancelada',
    fechaFinalizacion: ahora,
    historial: [
      ...(tareaActual.historial ?? []),
      {
        fecha: ahora,
        estado: 'cancelada',
        motivo: motivo || 'Sin motivo especificado',
      },
    ],
  };

  const nuevasTareas = estado.tareas.map((t) =>
    t.id === id ? tareaActualizada : t
  );

  guardarEstado({ ...estado, tareas: nuevasTareas });
  return tareaActualizada;
}