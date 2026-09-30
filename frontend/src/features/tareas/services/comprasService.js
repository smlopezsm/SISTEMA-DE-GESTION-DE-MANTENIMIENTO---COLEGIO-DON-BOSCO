import dataInicial from '@data/compras.json';
import { leer, guardar } from '../../../shared/utils/storage';

const CLAVE = 'compras';

export function obtenerCompras() {
  return leer(CLAVE, dataInicial.compras ?? []);
}

export function obtenerCompraPorId(id) {
  return obtenerCompras().find((c) => c.id === id);
}

export function obtenerCompraPorTarea(tareaId) {
  return obtenerCompras().find((c) => c.tareaId === tareaId) ?? null;
}

export function crearCompra(datos) {
  const actual = obtenerCompras();
  const nuevoId = `COM-${String(actual.length + 1).padStart(3, '0')}`;

  const nuevaCompra = {
    id: nuevoId,
    tareaId: datos.tareaId,
    fechaCompra: datos.fechaCompra,
    montoTotal: Number(datos.montoTotal),
    detalleCompra: datos.detalleCompra,
    factura: datos.factura ?? null,
  };

  guardar(CLAVE, [...actual, nuevaCompra]);
  return nuevaCompra;
}

export function actualizarCompra(id, datos) {
  const actual = obtenerCompras();
  const actualizada = actual.map((c) =>
    c.id === id ? { ...c, ...datos, montoTotal: Number(datos.montoTotal) } : c
  );
  guardar(CLAVE, actualizada);
  return actualizada.find((c) => c.id === id);
}