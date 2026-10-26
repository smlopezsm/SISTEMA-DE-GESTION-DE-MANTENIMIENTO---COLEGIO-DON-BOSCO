import * as service from './historial.service.js';

export async function listar(req, res) {
  const historial = await service.listar(req.params.id);
  res.json(historial);
}
