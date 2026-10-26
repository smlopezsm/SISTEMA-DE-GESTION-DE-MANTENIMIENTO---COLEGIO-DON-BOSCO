import { pool } from '../../config/db.js';

export async function listarPorTarea(idTarea) {
  const { rows } = await pool.query(
    `SELECT
       id_compra AS id,
       id_tarea AS "idTarea",
       monto,
       detalle,
       detalle AS "detalleCompra",
       categoria,
       fecha,
       fecha AS "fechaCompra",
       factura
     FROM compras
     WHERE id_tarea = $1
     ORDER BY fecha ASC`,
    [idTarea],
  );

  return rows;
}

export async function crear(idTarea, datos, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO compras (
       id_tarea, monto, detalle, categoria, fecha, factura
     )
     VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, now()), $6)
     RETURNING
       id_compra AS id,
       id_tarea AS "idTarea",
       monto,
       detalle,
       detalle AS "detalleCompra",
       categoria,
       fecha,
       fecha AS "fechaCompra",
       factura`,
    [
      idTarea,
      datos.monto,
      datos.detalle,
      datos.categoria ?? 'materiales',
      datos.fecha ?? null,
      datos.factura ?? null,
    ],
  );

  return rows[0];
}
