import { pool } from '../../config/db.js';

const SELECT_PERSONAL = `
  SELECT
    p.id_personal AS id,
    p.nombre,
    p.apellido,
    p.dni,
    p.email,
    p.telefono,
    p.id_especialidad AS "idEspecialidad",
    e.nombre AS especialidad,
    p.matricula,
    p.genero,
    p.observaciones,
    p.activo,
    p.created_at AS "fechaAlta"
  FROM personal_externo p
  JOIN especialidades e ON e.id_especialidad = p.id_especialidad
`;

export async function listar({ especialidad, activo, busqueda } = {}) {
  const condiciones = [];
  const valores = [];

  if (especialidad) {
    valores.push(`%${especialidad}%`);
    condiciones.push(`e.nombre ILIKE $${valores.length}`);
  }

  if (activo !== undefined) {
    valores.push(activo);
    condiciones.push(`p.activo = $${valores.length}`);
  }else {
    condiciones.push(`p.activo = TRUE`);
  }

  if (busqueda) {
    valores.push(`%${busqueda}%`);
    const i = valores.length;
    condiciones.push(
      `(p.nombre ILIKE $${i} OR p.apellido ILIKE $${i} OR e.nombre ILIKE $${i} OR COALESCE(p.email, '') ILIKE $${i})`,
    );
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `${SELECT_PERSONAL} ${where} ORDER BY p.apellido, p.nombre`,
    valores,
  );

  return rows;
}

export async function obtenerPorId(id) {
  const { rows } = await pool.query(
    `${SELECT_PERSONAL} WHERE p.id_personal = $1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function obtenerOCrearEspecialidad(nombre) {
  const { rows } = await pool.query(
    `INSERT INTO especialidades (nombre)
     VALUES ($1)
     ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
     RETURNING id_especialidad`,
    [nombre],
  );

  return rows[0].id_especialidad;
}

export async function crear(datos) {
  const { rows } = await pool.query(
    `INSERT INTO personal_externo (
       nombre, apellido, dni, email, telefono, id_especialidad,
       matricula, genero, observaciones
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id_personal`,
    [
      datos.nombre,
      datos.apellido,
      datos.dni,
      datos.email,
      datos.telefono,
      datos.idEspecialidad,
      datos.matricula,
      datos.genero,
      datos.observaciones,
    ],
  );

  return rows[0].id_personal;
}

export async function actualizar(id, datos) {
  const { rows } = await pool.query(
    `UPDATE personal_externo
     SET nombre = $1,
         apellido = $2,
         dni = $3,
         email = $4,
         telefono = $5,
         id_especialidad = $6,
         matricula = $7,
         genero = $8,
         observaciones = $9,
         activo = $10
     WHERE id_personal = $11
     RETURNING id_personal`,
    [
      datos.nombre,
      datos.apellido,
      datos.dni,
      datos.email,
      datos.telefono,
      datos.idEspecialidad,
      datos.matricula,
      datos.genero,
      datos.observaciones,
      datos.activo,
      id,
    ],
  );

  return rows[0] ?? null;
}

export async function desactivar(id) {
  const { rowCount } = await pool.query(
    'UPDATE personal_externo SET activo = FALSE WHERE id_personal = $1',
    [id],
  );

  return rowCount > 0;
}

export async function existeDni(dni, excluirId = null) {
  if (!dni) return null;

  const { rows } = await pool.query(
    `SELECT id_personal
     FROM personal_externo
     WHERE dni = $1
       AND ($2::int IS NULL OR id_personal <> $2::int)
     LIMIT 1`,
    [dni, excluirId],
  );

  return rows[0] ?? null;
}
