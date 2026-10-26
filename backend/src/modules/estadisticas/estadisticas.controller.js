import * as service from './estadisticas.service.js';

export async function obtener(req, res) {
  const hace = Number(req.query.hace ?? 30);
  const dias = Number.isFinite(hace) ? Math.min(Math.max(hace, 1), 365) : 30;

  const estadisticas = await service.obtener(dias);
  res.json(estadisticas);
}
