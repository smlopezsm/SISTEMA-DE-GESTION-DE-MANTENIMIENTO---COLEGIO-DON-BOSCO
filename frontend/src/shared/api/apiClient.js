const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(message, status, detalles = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

export async function apiRequest(
  path,
  { method = 'GET', body, token, signal } = {},
) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;

    throw new ApiError(
      'No se pudo conectar con el servidor. Verificá que el backend esté levantado.',
      0,
    );
  }

  const texto = await response.text();
  let data = null;

  if (texto) {
    try {
      data = JSON.parse(texto);
    } catch {
      data = texto;
    }
  }

  if (!response.ok) {
    const mensaje =
      (data && typeof data === 'object' && data.error) ||
      'Error al comunicarse con el servidor';

    throw new ApiError(mensaje, response.status, data?.detalles ?? null);
  }

  return data;
}

export { API_URL };
