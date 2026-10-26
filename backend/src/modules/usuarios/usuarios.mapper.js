export function mapearUsuario(row) {
  if (!row) return null;

  return {
    id: row.id_usuario,
    nombre: row.nombre,
    apellido: row.apellido,
    usuario: row.nombre_usuario,
    nombreUsuario: row.nombre_usuario,
    dni: row.dni,
    email: row.email,
    rol: row.rol ?? row.rol_nombre,
    idRol: row.id_rol,
    telefono: row.telefono,
    cargo: row.cargo ?? null,
    idCargo: row.id_cargo,
    avatar: row.avatar ?? null,
    activo: row.activo,
    creadoEn: row.created_at,
  };
}
