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

export async function buscarPorCredencial(identificador) {
  const { rows } = await pool.query(
    `${SELECT_USUARIO}
     WHERE LOWER(u.nombre_usuario) = LOWER($1)
        OR LOWER(u.email) = LOWER($1)
     LIMIT 1`,
    [identificador],
  );

  return rows[0] ?? null;
}

export async function buscarPorId(id) {
  const { rows } = await pool.query(
    `${SELECT_USUARIO} WHERE u.id_usuario = $1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function obtenerRolPorNombre(nombre) {
  const { rows } = await pool.query(
    'SELECT id_rol FROM roles WHERE nombre = $1',
    [nombre],
  );

  return rows[0] ?? null;
}

export async function existeConflicto({ nombreUsuario, email, dni }) {
  const { rows } = await pool.query(
    `SELECT id_usuario
     FROM usuarios
     WHERE LOWER(nombre_usuario) = LOWER($1)
        OR LOWER(email) = LOWER($2)
        OR ($3::text IS NOT NULL AND dni = $3::text)
     LIMIT 1`,
    [nombreUsuario, email, dni],
  );

  return rows[0] ?? null;
}

export async function crearUsuario(datos) {
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
