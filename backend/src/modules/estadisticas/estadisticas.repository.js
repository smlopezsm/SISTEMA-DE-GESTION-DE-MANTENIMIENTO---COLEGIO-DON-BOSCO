import { pool } from '../../config/db.js';

export async function obtenerResumen(desde, hasta, desdeAnterior) {
  const { rows } = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM requerimientos
        WHERE activo = TRUE AND fecha_emision >= $1 AND fecha_emision <= $2) AS total_requerimientos,
       (SELECT COUNT(*)::int FROM requerimientos
        WHERE activo = TRUE AND fecha_emision >= $3 AND fecha_emision < $1) AS total_requerimientos_anterior,

       (SELECT COUNT(*)::int FROM tareas
        WHERE fecha_fin >= $1 AND fecha_fin <= $2
          AND estado IN ('finalizada', 'aprobada')) AS finalizadas,
       (SELECT COUNT(*)::int FROM tareas
        WHERE fecha_fin >= $3 AND fecha_fin < $1
          AND estado IN ('finalizada', 'aprobada')) AS finalizadas_anterior,

       (SELECT COUNT(*)::int FROM tareas WHERE estado = 'en-proceso') AS en_proceso,
       (SELECT COUNT(*)::int FROM tareas WHERE estado = 'demorada') AS demoradas,

       (SELECT COUNT(*)::int FROM tareas
        WHERE estado = 'rechazada'
          AND fecha_creacion >= $1 AND fecha_creacion <= $2) AS rechazadas,
       (SELECT COUNT(*)::int FROM tareas
        WHERE estado = 'rechazada'
          AND fecha_creacion >= $3 AND fecha_creacion < $1) AS rechazadas_anterior,

       (SELECT COALESCE(SUM(monto), 0) FROM compras
        WHERE fecha >= $1 AND fecha <= $2) AS gastos_compras,
       (SELECT COALESCE(SUM(monto), 0) FROM compras
        WHERE fecha >= $3 AND fecha < $1) AS gastos_compras_anterior,

       (SELECT COALESCE(SUM(costo_personal_externo), 0) FROM tareas
        WHERE fecha_creacion >= $1 AND fecha_creacion <= $2) AS gastos_personal,
       (SELECT COALESCE(SUM(costo_personal_externo), 0) FROM tareas
        WHERE fecha_creacion >= $3 AND fecha_creacion < $1) AS gastos_personal_anterior`,
    [desde, hasta, desdeAnterior],
  );

  return rows[0];
}

export async function obtenerSectores(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT s.nombre, COUNT(*)::int AS cantidad
     FROM requerimientos r
     JOIN sectores s ON s.id_sector = r.id_sector
     WHERE r.activo = TRUE
       AND r.fecha_emision >= $1
       AND r.fecha_emision <= $2
     GROUP BY s.nombre
     ORDER BY cantidad DESC, s.nombre ASC
     LIMIT 10`,
    [desde, hasta],
  );

  return rows;
}

export async function obtenerGastosPorCategoria(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT categoria, COALESCE(SUM(monto), 0) AS valor
     FROM compras
     WHERE fecha >= $1 AND fecha <= $2
     GROUP BY categoria`,
    [desde, hasta],
  );

  return rows;
}

export async function obtenerGastoPersonal(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT COALESCE(SUM(costo_personal_externo), 0) AS valor
     FROM tareas
     WHERE fecha_creacion >= $1 AND fecha_creacion <= $2`,
    [desde, hasta],
  );

  return Number(rows[0].valor);
}

export async function obtenerEvolucionCompras(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT
       EXTRACT(YEAR FROM fecha)::int AS anio,
       EXTRACT(MONTH FROM fecha)::int AS mes,
       categoria,
       COALESCE(SUM(monto), 0) AS valor
     FROM compras
     WHERE fecha >= $1 AND fecha <= $2
     GROUP BY 1, 2, 3
     ORDER BY 1, 2`,
    [desde, hasta],
  );

  return rows;
}

export async function obtenerPersonal(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(
         u.nombre || ' ' || u.apellido,
         p.nombre || ' ' || p.apellido
       ) AS nombre,
       COUNT(*)::int AS realizadas,
       COUNT(*) FILTER (
         WHERE t.estado IN ('finalizada', 'aprobada')
       )::int AS exitosas
     FROM tareas t
     LEFT JOIN usuarios u ON u.id_usuario = t.id_responsable
     LEFT JOIN personal_externo p ON p.id_personal = t.id_personal_externo
     WHERE t.fecha_creacion >= $1
       AND t.fecha_creacion <= $2
       AND (u.id_usuario IS NOT NULL OR p.id_personal IS NOT NULL)
     GROUP BY 1
     ORDER BY realizadas DESC, nombre ASC
     LIMIT 10`,
    [desde, hasta],
  );

  return rows;
}

export async function obtenerTiempoResolucion(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT
       COALESCE(
         ROUND(
           AVG(EXTRACT(EPOCH FROM (fecha_fin - fecha_creacion)) / 86400)::numeric,
           1
         ),
         0
       ) AS dias
     FROM tareas
     WHERE fecha_fin >= $1
       AND fecha_fin <= $2
       AND fecha_creacion IS NOT NULL`,
    [desde, hasta],
  );

  return Number(rows[0].dias);
}

export async function obtenerEstados(desde, hasta) {
  const { rows } = await pool.query(
    `SELECT estado, COUNT(*)::int AS valor
     FROM tareas
     WHERE fecha_creacion >= $1 AND fecha_creacion <= $2
     GROUP BY estado`,
    [desde, hasta],
  );

  return rows;
}
