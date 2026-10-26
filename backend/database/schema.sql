-- ============================================================
-- Sistema de Gestión de Mantenimiento - Colegio Don Bosco
-- Esquema de la base de datos (PostgreSQL 16)
--
-- Uso:
--   1. Crear la base:  CREATE DATABASE donbosco_mantenimiento;
--   2. Ejecutar:       psql -U postgres -d donbosco_mantenimiento -f schema.sql
--
-- Este script recrea las tablas desde cero.
-- ============================================================

DROP TABLE IF EXISTS notificaciones CASCADE;
DROP TABLE IF EXISTS compras CASCADE;
DROP TABLE IF EXISTS historial CASCADE;
DROP TABLE IF EXISTS tareas CASCADE;
DROP TABLE IF EXISTS requerimientos CASCADE;
DROP TABLE IF EXISTS personal_externo CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS sectores CASCADE;
DROP TABLE IF EXISTS cargos CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ------------------------------------------------------------
-- Catálogos
-- ------------------------------------------------------------

CREATE TABLE roles (
  id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(30) NOT NULL UNIQUE
    CHECK (nombre IN ('ordenanza', 'jefeMantenimiento', 'directivo'))
);

CREATE TABLE cargos (
  id_cargo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE sectores (
  id_sector INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE especialidades (
  id_especialidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- Usuarios
-- ------------------------------------------------------------

CREATE TABLE usuarios (
  id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(60) NOT NULL,
  apellido VARCHAR(60) NOT NULL DEFAULT '',
  dni VARCHAR(10) UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  id_rol INTEGER NOT NULL REFERENCES roles(id_rol),
  telefono VARCHAR(25),
  id_cargo INTEGER REFERENCES cargos(id_cargo),
  avatar TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_dni_numerico CHECK (dni IS NULL OR dni ~ '^[0-9]+$')
);

CREATE UNIQUE INDEX usuarios_email_lower_idx ON usuarios (LOWER(email));
CREATE UNIQUE INDEX usuarios_nombre_usuario_lower_idx ON usuarios (LOWER(nombre_usuario));
CREATE INDEX usuarios_rol_idx ON usuarios (id_rol);

-- ------------------------------------------------------------
-- Personal externo
-- ------------------------------------------------------------

CREATE TABLE personal_externo (
  id_personal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(10) UNIQUE,
  email VARCHAR(100),
  telefono VARCHAR(25) NOT NULL,
  id_especialidad INTEGER NOT NULL REFERENCES especialidades(id_especialidad),
  matricula VARCHAR(50),
  genero VARCHAR(20),
  observaciones TEXT,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT personal_dni_numerico CHECK (dni IS NULL OR dni ~ '^[0-9]+$')
);

CREATE INDEX personal_externo_especialidad_idx ON personal_externo (id_especialidad);

-- ------------------------------------------------------------
-- Requerimientos
-- ------------------------------------------------------------

CREATE TABLE requerimientos (
  id_requerimiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  id_sector INTEGER NOT NULL REFERENCES sectores(id_sector),
  imagen TEXT,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN (
      'pendiente',
      'asignado',
      'en-proceso',
      'finalizada',
      'rechazada',
      'cancelada'
    )),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fecha_emision TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX requerimientos_usuario_idx ON requerimientos (id_usuario);
CREATE INDEX requerimientos_sector_idx ON requerimientos (id_sector);
CREATE INDEX requerimientos_estado_idx ON requerimientos (estado);
CREATE INDEX requerimientos_fecha_idx ON requerimientos (fecha_emision);

-- ------------------------------------------------------------
-- Tareas
-- ------------------------------------------------------------

CREATE TABLE tareas (
  id_tarea INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_requerimiento INTEGER NOT NULL REFERENCES requerimientos(id_requerimiento),
  prioridad VARCHAR(10) NOT NULL
    CHECK (prioridad IN ('baja', 'media', 'alta')),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN (
      'pendiente',
      'en-proceso',
      'demorada',
      'cancelada',
      'finalizada',
      'aprobada',
      'rechazada'
    )),
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_inicio TIMESTAMPTZ,
  fecha_fin TIMESTAMPTZ,
  observaciones TEXT,
  id_directivo INTEGER REFERENCES usuarios(id_usuario),
  id_responsable INTEGER REFERENCES usuarios(id_usuario),
  id_personal_externo INTEGER REFERENCES personal_externo(id_personal),
  id_tarea_origen INTEGER REFERENCES tareas(id_tarea),
  costo_personal_externo NUMERIC(10, 2)
    CHECK (costo_personal_externo IS NULL OR costo_personal_externo >= 0),
  CONSTRAINT tareas_un_solo_responsable CHECK (
    NOT (id_responsable IS NOT NULL AND id_personal_externo IS NOT NULL)
  )
);

CREATE INDEX tareas_requerimiento_idx ON tareas (id_requerimiento);
CREATE INDEX tareas_estado_idx ON tareas (estado);
CREATE INDEX tareas_responsable_idx ON tareas (id_responsable);
CREATE INDEX tareas_personal_idx ON tareas (id_personal_externo);
CREATE INDEX tareas_fecha_creacion_idx ON tareas (fecha_creacion);

-- ------------------------------------------------------------
-- Historial de auditoría
-- ------------------------------------------------------------

CREATE TABLE historial (
  id_historial INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_tarea INTEGER NOT NULL REFERENCES tareas(id_tarea) ON DELETE CASCADE,
  estado VARCHAR(20) NOT NULL,
  motivo VARCHAR(500),
  id_usuario INTEGER REFERENCES usuarios(id_usuario),
  fecha_hora TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX historial_tarea_idx ON historial (id_tarea);

-- ------------------------------------------------------------
-- Compras
-- ------------------------------------------------------------

CREATE TABLE compras (
  id_compra INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_tarea INTEGER NOT NULL REFERENCES tareas(id_tarea) ON DELETE CASCADE,
  monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
  detalle VARCHAR(255) NOT NULL,
  categoria VARCHAR(20) NOT NULL DEFAULT 'materiales'
    CHECK (categoria IN ('materiales', 'servicios', 'otros')),
  fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
  factura TEXT
);

CREATE INDEX compras_tarea_idx ON compras (id_tarea);

-- ------------------------------------------------------------
-- Notificaciones
-- ------------------------------------------------------------

CREATE TABLE notificaciones (
  id_notificacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
  id_requerimiento INTEGER REFERENCES requerimientos(id_requerimiento) ON DELETE CASCADE,
  id_tarea INTEGER REFERENCES tareas(id_tarea) ON DELETE CASCADE,
  tipo VARCHAR(30) NOT NULL
    CHECK (tipo IN (
      'requerimiento',
      'tarea-aprobada',
      'tarea-rechazada',
      'tarea-finalizada',
      'tarea-cancelada'
    )),
  titulo VARCHAR(100) NOT NULL,
  mensaje VARCHAR(200) NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notificaciones_usuario_idx ON notificaciones (id_usuario);
CREATE INDEX notificaciones_leida_idx ON notificaciones (leida);
