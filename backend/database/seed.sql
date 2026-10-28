-- Datos de prueba - Sistema de Gestión de Mantenimiento
-- Ejecutar después de schema.sql:
--   psql -U postgres -d donbosco_mantenimiento -f seed.sql
-- (la base se crea antes: CREATE DATABASE donbosco_mantenimiento;)
\encoding UTF8

TRUNCATE TABLE notificaciones, compras, historial, tareas, requerimientos,
  personal_externo, usuarios, especialidades, sectores, cargos, roles, categorias
  RESTART IDENTITY CASCADE;

-- ------------------------------------------------------------
-- Catálogos
-- ------------------------------------------------------------

INSERT INTO roles (id_rol, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'ordenanza'),
  (2, 'jefeMantenimiento'),
  (3, 'directivo');

INSERT INTO cargos (id_cargo, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Rector'),
  (2, 'Vicerrector'),
  (3, 'Secretaria'),
  (4, 'Director de Estudios'),
  (5, 'Administrador'),
  (6, 'Secretario');

INSERT INTO sectores (id_sector, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Aula 12'),
  (2, 'Baño Pabellón B'),
  (3, 'Patio'),
  (4, 'Laboratorio 3'),
  (5, 'Dirección'),
  (6, 'Pasillo principal'),
  (7, 'Biblioteca'),
  (8, 'Gimnasio'),
  (9, 'Cocina'),
  (10, 'Otro'),
  (11, 'Aula 8'),
  (12, 'Pabellón B (Aula 12 - Pasillo)'),
  (13, 'Pabellón C - Cocina'),
  (14, 'Pabellón B - Baño'),
  (15, 'Laboratorio de informática'),
  (16, 'Pabellón B');

INSERT INTO especialidades (id_especialidad, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Electricista'),
  (2, 'Plomería'),
  (3, 'Albañilería'),
  (4, 'Pintura'),
  (5, 'Carpintería'),
  (6, 'Gasista'),
  (7, 'Herrería'),
  (8, 'Climatización'),
  (9, 'Mantenimiento general'),
  (10, 'Vidriería');

INSERT INTO categorias (id_categoria, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Plomería'),
  (2, 'Electricidad'),
  (3, 'Pintura'),
  (4, 'Carpintería'),
  (5, 'Albañilería'),
  (6, 'Climatización'),
  (7, 'Limpieza'),
  (8, 'Otros');

-- ------------------------------------------------------------
-- Personal externo
-- ------------------------------------------------------------
\ir usuarios.sql
INSERT INTO personal_externo (
  id_personal, nombre, apellido, telefono, id_especialidad, activo, created_at
) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Juan Carlos', 'Gómez', '+54 9 2664 12-3456', 1, TRUE, '2025-02-01 09:00:00-03'),
  (2, 'María Laura', 'Torres', '+54 9 2664 22-3344', 2, TRUE, '2025-02-01 09:00:00-03'),
  (3, 'Ramiro', 'Sánchez', '+54 9 2664 33-7788', 3, TRUE, '2025-02-01 09:00:00-03'),
  (4, 'Fernando', 'Vega', '+54 9 2664 44-5566', 4, TRUE, '2025-02-01 09:00:00-03'),
  (5, 'Lucía', 'Rojas', '+54 9 2664 55-4433', 5, TRUE, '2025-02-01 09:00:00-03'),
  (6, 'Pablo', 'Álvarez', '+54 9 2664 66-2211', 9, TRUE, '2025-02-01 09:00:00-03'),
  (7, 'Diego', 'Martínez', '+54 9 2664 77-8899', 6, FALSE, '2025-02-01 09:00:00-03'),
  (8, 'Sofía', 'Gutiérrez', '+54 9 2664 88-6677', 7, FALSE, '2025-02-01 09:00:00-03'),
  (9, 'ClimaSur', 'S.A.', '+54 9 2664 98-7654', 8, TRUE, '2025-02-01 09:00:00-03');

-- ------------------------------------------------------------
-- Requerimientos
-- ------------------------------------------------------------

INSERT INTO requerimientos (
  id_requerimiento, descripcion, id_sector, imagen, id_usuario,
  estado, fecha_emision, id_categoria
) OVERRIDING SYSTEM VALUE VALUES
  (342, 'Se observa filtración de agua en el techo del pabellón B, principalmente en la zona del pasillo. En días de lluvia el agua se filtra hacia el interior y afecta las luminarias y el cielorraso.',
   12, 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800', 7,
   'en-proceso', TO_TIMESTAMP('25/06/2025 09:12', 'DD/MM/YYYY HH24:MI'), 1),
  (341, 'La luz de emergencia del pasillo principal no enciende. Se verificó que no es problema del tubo LED.',
   6, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800', 8,
   'finalizada', TO_TIMESTAMP('24/06/2025 08:47', 'DD/MM/YYYY HH24:MI'), 2),
  (340, 'La puerta del aula 12 está dañada y no cierra correctamente. Se necesita revisar la cerradura y ajustar la bisagra.',
   1, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 7,
   'en-proceso', TO_TIMESTAMP('24/06/2025 16:30', 'DD/MM/YYYY HH24:MI'), 4),
  (339, 'El aire acondicionado del laboratorio de informática no enfría. Hace ruido extraño al encender.',
   15, NULL, 9,
   'en-proceso', TO_TIMESTAMP('24/06/2025 14:22', 'DD/MM/YYYY HH24:MI'), 6),
  (338, 'Se observa pintura descascarada en la pared del patio. Necesita lijado y repintado.',
   3, 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800', 1,
   'en-proceso', TO_TIMESTAMP('24/06/2025 11:15', 'DD/MM/YYYY HH24:MI'), 3),
  (337, 'La calefacción del aula 8 no prende. Se verificó que el termostato está en buen estado.',
   11, NULL, 10,
   'finalizada', TO_TIMESTAMP('23/06/2025 17:40', 'DD/MM/YYYY HH24:MI'), 6),
  (336, 'Se siente olor a gas en la cocina del pabellón C. Se recomienda revisar las conexiones de la cocina.',
   13, 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800', 11,
   'cancelada', TO_TIMESTAMP('23/06/2025 12:18', 'DD/MM/YYYY HH24:MI'), 1),
  (335, 'La toma del laboratorio 3 está suelta y hace mal contacto. Puede ser peligroso.',
   4, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', 12,
   'finalizada', TO_TIMESTAMP('22/06/2025 10:05', 'DD/MM/YYYY HH24:MI'), 2);

-- ------------------------------------------------------------
-- Tareas
-- ------------------------------------------------------------

INSERT INTO tareas (
  id_tarea, id_requerimiento, prioridad, estado, fecha_creacion, fecha_inicio,
  fecha_fin, observaciones, id_directivo, id_responsable, id_personal_externo,
  costo_personal_externo
) OVERRIDING SYSTEM VALUE VALUES
  (128, 342, 'alta', 'en-proceso',
   TO_TIMESTAMP('25/06/2025 09:12', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('25/06/2025 10:30', 'DD/MM/YYYY HH24:MI'),
   NULL, 'Se necesita cerrar el paso de agua antes de reparar.', NULL, 8, NULL, NULL),
  (127, 341, 'media', 'finalizada',
   TO_TIMESTAMP('24/06/2025 08:47', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('24/06/2025 10:15', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('24/06/2025 14:00', 'DD/MM/YYYY HH24:MI'),
   '', NULL, NULL, 1, 40000.00),
  (126, 340, 'alta', 'en-proceso',
   TO_TIMESTAMP('24/06/2025 16:30', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('25/06/2025 08:00', 'DD/MM/YYYY HH24:MI'),
   NULL, '', NULL, 13, NULL, NULL),
  (125, 339, 'media', 'en-proceso',
   TO_TIMESTAMP('24/06/2025 14:22', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('25/06/2025 09:00', 'DD/MM/YYYY HH24:MI'),
   NULL, '', NULL, NULL, 9, 35000.00),
  (124, 338, 'baja', 'demorada',
   TO_TIMESTAMP('24/06/2025 11:15', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('24/06/2025 13:00', 'DD/MM/YYYY HH24:MI'),
   NULL, 'Se demora por lluvia.', NULL, 7, NULL, NULL),
  (123, 337, 'alta', 'finalizada',
   TO_TIMESTAMP('23/06/2025 17:40', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('24/06/2025 09:00', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('24/06/2025 15:00', 'DD/MM/YYYY HH24:MI'),
   '', NULL, 10, NULL, NULL),
  (122, 336, 'alta', 'cancelada',
   TO_TIMESTAMP('23/06/2025 12:18', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('23/06/2025 14:00', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('23/06/2025 18:00', 'DD/MM/YYYY HH24:MI'),
   'Se canceló porque el gasista no pudo venir.', NULL, NULL, 7, NULL),
  (121, 335, 'media', 'aprobada',
   TO_TIMESTAMP('22/06/2025 10:05', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('22/06/2025 11:30', 'DD/MM/YYYY HH24:MI'),
   TO_TIMESTAMP('22/06/2025 16:30', 'DD/MM/YYYY HH24:MI'),
   '', 4, 13, NULL, NULL);

-- ------------------------------------------------------------
-- Historial
-- ------------------------------------------------------------

INSERT INTO historial (id_tarea, estado, motivo, id_usuario, fecha_hora) VALUES
  (128, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0342', 6,
   TO_TIMESTAMP('25/06/2025 09:12', 'DD/MM/YYYY HH24:MI')),
  (128, 'en-proceso', 'El técnico Carlos Méndez inició la reparación.', 8,
   TO_TIMESTAMP('25/06/2025 10:30', 'DD/MM/YYYY HH24:MI')),
  (127, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0341', 6,
   TO_TIMESTAMP('24/06/2025 08:47', 'DD/MM/YYYY HH24:MI')),
  (127, 'en-proceso', 'Juan Carlos Gómez inició el cambio de luminaria.', 6,
   TO_TIMESTAMP('24/06/2025 10:15', 'DD/MM/YYYY HH24:MI')),
  (127, 'finalizada', 'El personal externo completó el cambio de luminaria.', 6,
   TO_TIMESTAMP('24/06/2025 14:00', 'DD/MM/YYYY HH24:MI')),
  (126, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0340', 6,
   TO_TIMESTAMP('24/06/2025 16:30', 'DD/MM/YYYY HH24:MI')),
  (126, 'en-proceso', 'Se retiró la cerradura rota para su reemplazo.', 13,
   TO_TIMESTAMP('25/06/2025 08:00', 'DD/MM/YYYY HH24:MI')),
  (125, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0339', 6,
   TO_TIMESTAMP('24/06/2025 14:22', 'DD/MM/YYYY HH24:MI')),
  (125, 'en-proceso', 'ClimaSur S.A. se presentó para revisar el equipo.', 6,
   TO_TIMESTAMP('25/06/2025 09:00', 'DD/MM/YYYY HH24:MI')),
  (124, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0338', 6,
   TO_TIMESTAMP('24/06/2025 11:15', 'DD/MM/YYYY HH24:MI')),
  (124, 'en-proceso', 'Se inició la preparación de la superficie.', 7,
   TO_TIMESTAMP('24/06/2025 13:00', 'DD/MM/YYYY HH24:MI')),
  (124, 'demorada', 'Se demora por lluvia. Se retomará cuando el clima mejore.', 7,
   TO_TIMESTAMP('25/06/2025 08:30', 'DD/MM/YYYY HH24:MI')),
  (123, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0337', 6,
   TO_TIMESTAMP('23/06/2025 17:40', 'DD/MM/YYYY HH24:MI')),
  (123, 'en-proceso', 'Pedro Ruiz comenzó la revisión de la caldera.', 10,
   TO_TIMESTAMP('24/06/2025 09:00', 'DD/MM/YYYY HH24:MI')),
  (123, 'finalizada', 'Tarea finalizada. Pendiente de evaluación del Directivo.', 10,
   TO_TIMESTAMP('24/06/2025 15:00', 'DD/MM/YYYY HH24:MI')),
  (122, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0336', 6,
   TO_TIMESTAMP('23/06/2025 12:18', 'DD/MM/YYYY HH24:MI')),
  (122, 'en-proceso', 'Se asignó al gasista para la revisión.', 6,
   TO_TIMESTAMP('23/06/2025 14:00', 'DD/MM/YYYY HH24:MI')),
  (122, 'cancelada', 'Se canceló porque el gasista no pudo venir.', 6,
   TO_TIMESTAMP('23/06/2025 18:00', 'DD/MM/YYYY HH24:MI')),
  (121, 'pendiente', 'Tarea creada a partir del requerimiento REQ-0335', 6,
   TO_TIMESTAMP('22/06/2025 10:05', 'DD/MM/YYYY HH24:MI')),
  (121, 'en-proceso', 'Juan Torres inició el reemplazo de la toma.', 13,
   TO_TIMESTAMP('22/06/2025 11:30', 'DD/MM/YYYY HH24:MI')),
  (121, 'finalizada', 'Tarea finalizada. Pendiente de evaluación del Directivo.', 13,
   TO_TIMESTAMP('22/06/2025 16:30', 'DD/MM/YYYY HH24:MI')),
  (121, 'aprobada', 'El Directivo aprobó la tarea. Trabajo conforme.', 4,
   TO_TIMESTAMP('23/06/2025 09:15', 'DD/MM/YYYY HH24:MI'));

-- ------------------------------------------------------------
-- Compras
-- ------------------------------------------------------------

INSERT INTO compras (id_tarea, monto, detalle, categoria, fecha, factura) VALUES
  (126, 12450.00,
   'Cerradura de embutir y juego de bisagras.',
   'materiales', TO_TIMESTAMP('25/06/2025 08:30', 'DD/MM/YYYY HH24:MI'), NULL),
  (127, 12500.00,
   'Luminaria LED de emergencia 20W.', 'materiales',
   TO_TIMESTAMP('24/06/2025 09:30', 'DD/MM/YYYY HH24:MI'), NULL),
  (124, 8900.00,
   'Pintura exterior + rodillo.', 'materiales',
   TO_TIMESTAMP('24/06/2025 12:00', 'DD/MM/YYYY HH24:MI'), NULL),
  (121, 4300.00,
   'Toma Schuko + cable.', 'materiales',
   TO_TIMESTAMP('22/06/2025 11:00', 'DD/MM/YYYY HH24:MI'), NULL),
  (125, 15000.00,
   'Visita técnica de ClimaSur para diagnóstico.', 'servicios',
   TO_TIMESTAMP('25/06/2025 10:00', 'DD/MM/YYYY HH24:MI'), NULL);

-- ------------------------------------------------------------
-- Notificaciones
-- ------------------------------------------------------------

INSERT INTO notificaciones (
  id_usuario, id_requerimiento, id_tarea, tipo, titulo, mensaje, leida, created_at
) VALUES
  (6, 342, NULL, 'requerimiento', 'Nuevo requerimiento',
   'Se emitió el requerimiento REQ-0342: Filtración en techo - Pabellón B.',
   FALSE, TO_TIMESTAMP('25/06/2025 09:12', 'DD/MM/YYYY HH24:MI')),
  (6, 341, NULL, 'requerimiento', 'Nuevo requerimiento',
   'Se emitió el requerimiento REQ-0341: Luz de emergencia sin funcionar.',
   TRUE, TO_TIMESTAMP('24/06/2025 08:47', 'DD/MM/YYYY HH24:MI')),
  (4, NULL, 123, 'tarea-finalizada', 'Tarea finalizada',
   'La tarea T-0123: Revisión de caldera pasó a finalizada y espera tu aprobación.',
   FALSE, TO_TIMESTAMP('24/06/2025 15:00', 'DD/MM/YYYY HH24:MI')),
  (6, NULL, 121, 'tarea-aprobada', 'Tarea aprobada',
   'El Directivo aprobó la tarea T-0121: Reemplazo de toma eléctrica.',
   FALSE, TO_TIMESTAMP('23/06/2025 09:15', 'DD/MM/YYYY HH24:MI')),
  (6, NULL, 122, 'tarea-cancelada', 'Tarea cancelada',
   'La tarea T-0122 fue cancelada. Motivo: el gasista no pudo venir.',
   TRUE, TO_TIMESTAMP('23/06/2025 18:00', 'DD/MM/YYYY HH24:MI')),
  (5, NULL, 127, 'tarea-finalizada', 'Tarea finalizada',
   'La tarea T-0127: Cambio de luminaria pasó a finalizada.',
   FALSE, TO_TIMESTAMP('24/06/2025 14:00', 'DD/MM/YYYY HH24:MI')),
  (6, 335, NULL, 'requerimiento', 'Nuevo requerimiento',
   'Se emitió el requerimiento REQ-0335: Toma eléctrica suelta.',
   TRUE, TO_TIMESTAMP('22/06/2025 10:05', 'DD/MM/YYYY HH24:MI'));

-- ------------------------------------------------------------
-- Ajustar secuencias después de insertar IDs explícitos
-- ------------------------------------------------------------

SELECT setval(pg_get_serial_sequence('roles', 'id_rol'), (SELECT MAX(id_rol) FROM roles));
SELECT setval(pg_get_serial_sequence('cargos', 'id_cargo'), (SELECT MAX(id_cargo) FROM cargos));
SELECT setval(pg_get_serial_sequence('sectores', 'id_sector'), (SELECT MAX(id_sector) FROM sectores));
SELECT setval(pg_get_serial_sequence('especialidades', 'id_especialidad'), (SELECT MAX(id_especialidad) FROM especialidades));
SELECT setval(pg_get_serial_sequence('usuarios', 'id_usuario'), (SELECT MAX(id_usuario) FROM usuarios));
SELECT setval(pg_get_serial_sequence('personal_externo', 'id_personal'), (SELECT MAX(id_personal) FROM personal_externo));
SELECT setval(pg_get_serial_sequence('requerimientos', 'id_requerimiento'), (SELECT MAX(id_requerimiento) FROM requerimientos));
SELECT setval(pg_get_serial_sequence('tareas', 'id_tarea'), (SELECT MAX(id_tarea) FROM tareas));
SELECT setval(pg_get_serial_sequence('categorias', 'id_categoria'), (SELECT MAX(id_categoria) FROM categorias));