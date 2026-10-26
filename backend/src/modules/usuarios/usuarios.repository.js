import { pool } from '../../config/db.js';

const SELECT_USUARIO = `
  SELECT
    u.*,
    r.nombre AS rol,
    c.nombre AS cargo
  FROM usuarios u
  JOIN roles r ON r.id_rol = u.id_rol
  LEFT JOIN cargos c ON c.id_cargo = u.id_cargo
`;

export async function listar({ rol, activo, busqueda } = {}) {
  const condiciones = [];
  const valores = [];

  if (rol) {
    valores.push(rol);
    condiciones.push(`r.nombre = $${valores.length}`);
  }

  if (activo !== undefined) {
    valores.push(activo);
    condiciones.push(`u.activo = $${valores.length}`);
  }

  if (busqueda) {
    valores.push(`%${busqueda}%`);
    const i = valores.length;
    condiciones.push(
      `(u.nombre ILIKE $${i} OR u.apellido ILIKE $${i} OR u.nombre_usuario ILIKE $${i} OR u.email ILIKE $${i})`,
    );
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `${SELECT_USUARIO} ${where} ORDER BY u.apellido, u.nombre`,
    valores,
  );

  return rows;
}

export async function obtenerPorId(id) {
  const { rows } = await pool.query(
    `${SELECT_USUARIO} WHERE u.id_usuario = $1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function crear(datos) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (
       nombre_usuario, nombre, apellido, dni, email, password_hash,
       id_rol, telefono, id_cargo, avatar
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id_usuario`,
    [
      datos.nombreUsuario,
      datos.nombre,
      datos.apellido,
      datos.dni,
      datos.email,
      datos.passwordHash,
      datos.idRol,
      datos.telefono ?? null,
      datos.idCargo ?? null,
      datos.avatar ?? null,
    ],
  );

  return rows[0].id_usuario;
}

export async function actualizar(id, datos) {
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET nombre_usuario = $1,
         nombre = $2,
         apellido = $3,
         dni = $4,
         email = $5,
         password_hash = $6,
         id_rol = $7,
         telefono = $8,
         id_cargo = $9,
         avatar = $10,
         activo = $11
     WHERE id_usuario = $12
     RETURNING id_usuario`,
    [
      datos.nombreUsuario,
      datos.nombre,
      datos.apellido,
      datos.dni,
      datos.email,
      datos.passwordHash,
      datos.idRol,
      datos.telefono,
      datos.idCargo,
      datos.avatar,
      datos.activo,
      id,
    ],
  );

  return rows[0] ?? null;
}

export async function desactivar(id) {
  const { rowCount } = await pool.query(
    'UPDATE usuarios SET activo = FALSE WHERE id_usuario = $1',
    [id],
  );

  return rowCount > 0;
}

export async function existeConflicto({
  nombreUsuario,
  email,
  dni,
  excluirId = null,
}) {
  const { rows } = await pool.query(
    `SELECT id_usuario
     FROM usuarios
     WHERE (
       LOWER(nombre_usuario) = LOWER($1)
       OR LOWER(email) = LOWER($2)
       OR ($3::text IS NOT NULL AND dni = $3::text)
     )
     AND ($4::int IS NULL OR id_usuario <> $4::int)
     LIMIT 1`,
    [nombreUsuario, email, dni, excluirId],
  );

  return rows[0] ?? null;
}

export async function obtenerIdRol(nombre) {
  const { rows } = await pool.query(
    'SELECT id_rol FROM roles WHERE nombre = $1',
    [nombre],
  );

  return rows[0] ?? null;
}

export async function obtenerIdCargo(nombre) {
  const { rows } = await pool.query(
    'SELECT id_cargo FROM cargos WHERE nombre = $1',
    [nombre],
  );

  return rows[0] ?? null;
}

export async function contarDirectivosActivos(excluirId = null) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM usuarios u
     JOIN roles r ON r.id_rol = u.id_rol
     WHERE r.nombre = 'directivo'
       AND u.activo = TRUE
       AND ($1::int IS NULL OR u.id_usuario <> $1::int)`,
    [excluirId],
  );

  return rows[0].total;
}
