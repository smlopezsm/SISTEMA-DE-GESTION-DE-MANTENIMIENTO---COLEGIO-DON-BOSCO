import * as service from './compras.service.js';

export async function listar(req, res) {
  const compras = await service.listar(req.params.id);
  res.json(compras);
}

export async function crear(req, res) {
  const compra = await service.crear(req.params.id, req.body);
  res.status(201).json(compra);
}
