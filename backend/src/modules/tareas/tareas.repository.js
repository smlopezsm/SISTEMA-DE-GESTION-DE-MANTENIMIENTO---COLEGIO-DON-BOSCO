import { pool } from '../../config/db.js';

const SELECT_TAREA = `
  SELECT
    t.id_tarea AS id,
    t.id_requerimiento AS "idRequerimiento",
    c.nombre AS "requerimientoTitulo",
    c.nombre AS titulo,               
    r.descripcion,
    r.id_sector AS "idSector",
    s.nombre AS sector,
    s.nombre AS lugar,
    u.nombre || ' ' || u.apellido AS "reportadoPor",
    rr.nombre AS "rolReportante",
    t.prioridad,
    t.estado,
    t.fecha_creacion AS "fechaCreacion",
    t.fecha_inicio AS "fechaInicio",
    t.fecha_fin AS "fechaFin",
    t.observaciones,
    t.id_directivo AS "idDirectivo",
    t.id_responsable AS "idResponsable",
    t.id_personal_externo AS "idPersonalExterno",
    t.id_tarea_origen AS "idTareaOrigen",
    t.costo_personal_externo AS "costoPersonalExterno",
    CASE
      WHEN t.id_responsable IS NOT NULL THEN u2.nombre || ' ' || u2.apellido
      WHEN t.id_personal_externo IS NOT NULL THEN p.nombre || ' ' || p.apellido
      ELSE NULL
    END AS "responsableNombre",
    CASE
      WHEN t.id_responsable IS NOT NULL THEN 'interno'
      WHEN t.id_personal_externo IS NOT NULL THEN 'externo'
      ELSE NULL
    END AS "responsableTipo",
    COALESCE(u2.telefono, p.telefono) AS telefono
  FROM tareas t
  JOIN requerimientos r ON r.id_requerimiento = t.id_requerimiento
  JOIN categorias c ON c.id_categoria = r.id_categoria
  JOIN sectores s ON s.id_sector = r.id_sector
  JOIN usuarios u ON u.id_usuario = r.id_usuario
  JOIN roles rr ON rr.id_rol = u.id_rol
  LEFT JOIN usuarios u2 ON u2.id_usuario = t.id_responsable
  LEFT JOIN personal_externo p ON p.id_personal = t.id_personal_externo
`;

export async function listar({
  estado,
  prioridad,
  sector,
  desde,
  hasta,
} = {}) {
  const condiciones = [];
  const valores = [];

  if (estado) {
    valores.push(estado);
    condiciones.push(`t.estado = $${valores.length}`);
  }

  if (prioridad) {
    valores.push(prioridad);
    condiciones.push(`t.prioridad = $${valores.length}`);
  }

  if (sector) {
    valores.push(`%${sector}%`);
    condiciones.push(`s.nombre ILIKE $${valores.length}`);
  }

  if (desde) {
    valores.push(desde);
    condiciones.push(`t.fecha_creacion >= $${valores.length}::timestamptz`);
  }

  if (hasta) {
    valores.push(hasta);
    condiciones.push(`t.fecha_creacion <= $${valores.length}::timestamptz`);
  }

  const where = condiciones.length
    ? `WHERE ${condiciones.join(' AND ')}`
    : '';

  const { rows } = await pool.query(
    `${SELECT_TAREA} ${where} ORDER BY t.fecha_creacion DESC`,
    valores,
  );

  return rows;
}

export async function obtenerPorId(id, db = pool) {
  const { rows } = await db.query(
    `${SELECT_TAREA} WHERE t.id_tarea = $1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function obtenerUsuarioActivo(id) {
  const { rows } = await pool.query(
    'SELECT id_usuario FROM usuarios WHERE id_usuario = $1 AND activo = TRUE',
    [id],
  );

  return rows[0] ?? null;
}

export async function obtenerPersonalActivo(id) {
  const { rows } = await pool.query(
    'SELECT id_personal FROM personal_externo WHERE id_personal = $1 AND activo = TRUE',
    [id],
  );

  return rows[0] ?? null;
}

export async function existeTareaActivaParaRequerimiento(idRequerimiento) {
  const { rows } = await pool.query(
    `SELECT id_tarea
     FROM tareas
     WHERE id_requerimiento = $1
       AND estado IN ('pendiente', 'en-proceso', 'demorada')
     LIMIT 1`,
    [idRequerimiento],
  );

  return rows[0] ?? null;
}

export async function crear(datos, db = pool) {
  const { rows } = await db.query(
    `INSERT INTO tareas (
       id_requerimiento, prioridad, estado, observaciones, id_responsable,
       id_personal_externo, id_tarea_origen, costo_personal_externo
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id_tarea`,
    [
      datos.idRequerimiento,
      datos.prioridad,
      datos.estado ?? 'pendiente',
      datos.observaciones ?? null,
      datos.idResponsable ?? null,
      datos.idPersonalExterno ?? null,
      datos.idTareaOrigen ?? null,
      datos.costoPersonalExterno ?? null,
    ],
  );

  return rows[0].id_tarea;
}

export async function actualizar(id, datos, db = pool) {
  const { rows } = await db.query(
    `UPDATE tareas
     SET prioridad = $1,
         observaciones = $2,
         id_responsable = $3,
         id_personal_externo = $4,
         costo_personal_externo = $5,
         fecha_inicio = $6,
         fecha_fin = $7
     WHERE id_tarea = $8
     RETURNING id_tarea`,
    [
      datos.prioridad,
      datos.observaciones,
      datos.idResponsable,
      datos.idPersonalExterno,
      datos.costoPersonalExterno,
      datos.fechaInicio,
      datos.fechaFin,
      id,
    ],
  );

  return rows[0] ?? null;
}

// ESTA ES LA FUNCION QUE ESTABA MAL Y TE ROMPIA TODO
export async function cambiarEstado(id, datos, idUsuario, db = pool) {
  // 1. Actualizamos la tarea (sin abrir conexion nueva)
  const { rows } = await db.query(
    `UPDATE tareas
     SET estado = $1,
         fecha_inicio = COALESCE($2, fecha_inicio),
         fecha_fin = COALESCE($3, fecha_fin),
         id_directivo = COALESCE($4, id_directivo),
         observaciones = COALESCE($5, observaciones)
     WHERE id_tarea = $6
     RETURNING id_tarea`,
    [
      datos.estado ?? null,
      datos.fechaInicio ?? null,
      datos.fechaFin ?? null,
      datos.idDirectivo ?? null,
      datos.observaciones ?? null,
      id,
    ],
  );

  if (rows.length === 0) throw new Error('Tarea no encontrada');

  // 2. Guardamos en el historial
  await db.query(
    `INSERT INTO historial (id_tarea, estado, motivo, id_usuario)
     VALUES ($1, $2, $3, $4)`,
    [id, datos.estado, datos.motivo || `Cambio a ${datos.estado}`, idUsuario],
  );

  return rows[0];
}