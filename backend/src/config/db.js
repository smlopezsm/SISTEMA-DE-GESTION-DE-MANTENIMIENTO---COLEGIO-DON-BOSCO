import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

/**
 * Pool de conexiones a PostgreSQL. Se reutiliza en toda la app
 */
export const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  database: env.PGDATABASE,
  max: 20,
  min: 0,
  idleTimeoutMillis: 30000, // define cuanto tiempo puede permanecer una conexion inactiva (sin usarse) dentro del pool antes de que el pool la cierre y la descarte
  connectionTimeoutMillis: 5000,
  query_timeout: 10000, // temporizador del lado del cliente, si una consulta tarda mas de 10 segundos en devolver un resultado, node-postgres deja de esperar y lanza un error 
  statement_timeout: 10000, // temporizador del lado del servidor, si una sentencia SQL tarda mas de 10 segundos, el propio PostgreSQL la cancela y devuelve un error
  allowExitOnIdle: false, // controla si el proceso de Node puede terminar cuando todas las conexiones del pool están inactivas
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones', err);
});
