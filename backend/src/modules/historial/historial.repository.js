import { pool } from '../../config/db.js';

export async function listarPorTarea(idTarea) {
  const { rows } = await pool.query(
    `SELECT
       h.id_historial AS id,
       h.estado,
       h.motivo,
       h.fecha_hora AS fecha,
       COALESCE(u.nombre || ' ' || u.apellido, 'Sistema') AS usuario
     FROM historial h
     LEFT JOIN usuarios u ON u.id_usuario = h.id_usuario
     WHERE h.id_tarea = $1
     ORDER BY h.fecha_hora ASC`,
    [idTarea],
  );

  return rows;
}

export async function crear(
  idTarea,
  { estado, motivo, idUsuario },
  db = pool,
) {
  const { rows } = await db.query(
    `INSERT INTO historial (id_tarea, estado, motivo, id_usuario)
     VALUES ($1, $2, $3, $4)
     RETURNING id_historial`,
    [idTarea, estado, motivo ?? null, idUsuario ?? null],
  );

  return rows[0].id_historial;
}
