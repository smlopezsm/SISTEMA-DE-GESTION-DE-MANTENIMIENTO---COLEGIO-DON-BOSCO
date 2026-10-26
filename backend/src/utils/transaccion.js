import { pool } from '../config/db.js';

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const resultado = await callback(client);
    await client.query('COMMIT');
    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
