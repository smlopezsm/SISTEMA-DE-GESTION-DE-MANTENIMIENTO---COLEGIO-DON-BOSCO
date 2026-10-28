-- Usuarios de prueba (todos usan la contraseña 1234):
--   atorres      Ordenanza
--   jrodriguez   Jefe de Mantenimiento
--   cperez       Directivo

-- Usuarios (hash de bcrypt para la contraseña 1234)

INSERT INTO usuarios (
  id_usuario, nombre_usuario, nombre, apellido, dni, email, password_hash,
  id_rol, telefono, id_cargo, activo, created_at
) OVERRIDING SYSTEM VALUE VALUES
  (1, 'atorres', 'Ana', 'Torres', '30123456', 'atorres@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4551234', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (2, 'lfernandez', 'Luis', 'Fernández', '31234567', 'lfernandez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4552345', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (3, 'smartinez', 'Sofía', 'Martínez', '32345678', 'smartinez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4553456', NULL, FALSE, '2025-01-10 08:00:00-03'),
  (4, 'cperez', 'Carlos', 'Pérez', '20123456', 'cperez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   3, NULL, 1, TRUE, '2025-01-10 08:00:00-03'),
  (5, 'mgomez', 'María', 'Gómez', '21234567', 'mgomez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   3, NULL, 3, TRUE, '2025-01-10 08:00:00-03'),
  (6, 'jrodriguez', 'Juan', 'Rodríguez', '22345678', 'jrodriguez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   2, NULL, NULL, TRUE, '2025-01-10 08:00:00-03'),
  (7, 'laurafernandez', 'Laura', 'Fernández', '33456789', 'laurafernandez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4557890', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (8, 'cmendez', 'Carlos', 'Méndez', '34567890', 'cmendez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4558901', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (9, 'jvillar', 'Jorge', 'Villar', '23456789', 'jvillar@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   3, NULL, 6, TRUE, '2025-01-10 08:00:00-03'),
  (10, 'pruiz', 'Pedro', 'Ruiz', '35678901', 'pruiz@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4569012', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (11, 'lgomez', 'Lucía', 'Gómez', '24567890', 'lgomez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   3, NULL, 3, TRUE, '2025-01-10 08:00:00-03'),
  (12, 'msilva', 'Matías', 'Silva', '36789012', 'msilva@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4560123', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (13, 'jtorres', 'Juan', 'Torres', '37890123', 'jtorres@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4561234', NULL, TRUE, '2025-01-10 08:00:00-03'),
  (14, 'mgonzalez', 'María', 'González', '38901234', 'mgonzalez@donbosco.org.ar',
   '$2b$10$MdAWYQmY/Ad3ejF6JByxHORzZfhywigohgRnzU0r17CECKem0UBTm',
   1, '266 4562345', NULL, TRUE, '2025-01-10 08:00:00-03');