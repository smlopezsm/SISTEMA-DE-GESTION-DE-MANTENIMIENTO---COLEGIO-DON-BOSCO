import { pool } from '../../config/db.js';

const SELECT_REQUERIMIENTO = `
  SELECT
    r.id_requerimiento AS id,
    r.titulo,
    r.descripcion,
    r.id_sector AS "idSector",
    s.nombre AS sector,
    s.nombre AS lugar,
    r.imagen,
    r.estado,
    r.activo,
    r.id_categoria AS "idCategoria",
    c.nombre AS categoria,
    r.id_usuario AS "idUsuario",
    u.nombre || ' ' || u.apellido AS "reportadoPor",
    ro.nombre AS "rolReportante",
    r.fecha_emision AS "fechaHora"
  FROM requerimientos r
  JOIN sectores s ON s.id_sector = r.id_sector
  LEFT JOIN categorias c ON c.id_categoria = r.id_categoria
  JOIN usuarios u ON u.id_usuario = r.id_usuario
  JOIN roles ro ON ro.id_rol = u.id_rol
`;

const SELECT_REQUERIMIENTO_RESUMEN = `
  SELECT
    r.id_requerimiento AS id,
    r.titulo,
    r.descripcion,
    r.id_sector AS "idSector",
    s.nombre AS sector,
    s.nombre AS lugar,
    CASE WHEN length(r.imagen) > 500 THEN NULL ELSE r.imagen END AS imagen,
    r.estado,
    r.activo,
    r.id_categoria AS "idCategoria",
    c.nombre AS categoria,
    r.id_usuario AS "idUsuario",
    u.nombre || ' ' || u.apellido AS "reportadoPor",
    ro.nombre AS "rolReportante",
    r.fecha_emision AS "fechaHora"
  FROM requerimientos r
  JOIN sectores s ON s.id_sector = r.id_sector
  LEFT JOIN categorias c ON c.id_categoria = r.id_categoria
  JOIN usuarios u ON u.id_usuario = r.id_usuario
  JOIN roles ro ON ro.id_rol = u.id_rol
`;

export async function listar({ idUsuario, rol, sector, estado, desde, hasta } = {}) {
  const condiciones = ['r.activo = TRUE'];
  const valores = [];

  if (rol !== 'jefeMantenimiento' && idUsuario) {
    valores.push(idUsuario);
    condiciones.push(`r.id_usuario = $${valores.length}`);
  }
  if (sector) {
    valores.push(`%${sector}%`);
    condiciones.push(`s.nombre ILIKE $${valores.length}`);
  }
  if (estado) {
    valores.push(estado);
    condiciones.push(`r.estado = $${valores.length}`);
  }
  if (desde) {
    valores.push(desde);
    condiciones.push(`r.fecha_emision >= $${valores.length}::timestamptz`);
  }
  if (hasta) {
    valores.push(hasta);
    condiciones.push(`r.fecha_emision <= $${valores.length}::timestamptz`);
  }

  const { rows } = await pool.query(
    `${SELECT_REQUERIMIENTO_RESUMEN} WHERE ${condiciones.join(' AND ')} ORDER BY r.fecha_emision DESC`,
    valores,
  );
  return rows;
}

export async function obtenerPorId(id, db = pool) {
  const { rows } = await db.query(`${SELECT_REQUERIMIENTO} WHERE r.id_requerimiento = $1`, [id]);
  return rows[0] ?? null;
}

export async function listarCategorias() {
  const { rows } = await pool.query('SELECT id_categoria, nombre FROM categorias ORDER BY nombre');
  return rows;
}

export async function obtenerOCrearSector(nombre) {
  const { rows } = await pool.query(
    `INSERT INTO sectores (nombre) VALUES ($1) ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre RETURNING id_sector`,
    [nombre],
  );
  return rows[0].id_sector;
}

export async function obtenerSectorPorId(id) {
  const { rows } = await pool.query('SELECT id_sector, nombre FROM sectores WHERE id_sector = $1', [id]);
  return rows[0] ?? null;
}

export async function crear(datos, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO requerimientos (titulo, descripcion, id_sector, id_categoria, imagen, id_usuario)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id_requerimiento`,
    [datos.titulo, datos.descripcion, datos.idSector, datos.idCategoria ?? null, datos.imagen ?? null, datos.idUsuario],
  );
  return rows[0].id_requerimiento;
}

export async function actualizar(id, datos, db = pool) {
  const { rows } = await db.query(
    `UPDATE requerimientos SET titulo = $1, descripcion = $2, id_sector = $3, id_categoria = $4, imagen = $5 WHERE id_requerimiento = $6 RETURNING id_requerimiento`,
    [datos.titulo, datos.descripcion, datos.idSector, datos.idCategoria ?? null, datos.imagen ?? null, id],
  );
  return rows[0] ?? null;
}

export async function cambiarEstado(id, estado, db = pool) {
  const { rows } = await db.query(
    `UPDATE requerimientos SET estado = $1 WHERE id_requerimiento = $2 RETURNING id_requerimiento, estado`,
    [estado, id],
  );
  return rows[0] ?? null;
}

export async function desactivar(id) {
  const { rowCount } = await pool.query('UPDATE requerimientos SET activo = FALSE WHERE id_requerimiento = $1', [id]);
  return rowCount > 0;
}

export async function contarTareas(id) {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM tareas WHERE id_requerimiento = $1', [id]);
  return rows[0].total;
}