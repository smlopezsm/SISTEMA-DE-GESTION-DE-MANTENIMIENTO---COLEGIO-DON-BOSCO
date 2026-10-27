import * as service from './requerimientos.service.js';

export async function listar(req, res) {
  const { sector, estado, desde, hasta } = req.query;
  const requerimientos = await service.listar(req.usuario, { sector, estado, desde, hasta });
  res.json(requerimientos);
}

export async function listarCategorias(req, res) {
  const categorias = await service.listarCategorias();
  res.json(categorias);
}

export async function obtener(req, res) {
  const requerimiento = await service.obtener(req.params.id, req.usuario);
  res.json(requerimiento);
}

export async function crear(req, res) {
  const requerimiento = await service.crear(req.body, req.usuario);
  res.status(201).json(requerimiento);
}

export async function actualizar(req, res) {
  const requerimiento = await service.actualizar(req.params.id, req.body, req.usuario);
  res.json(requerimiento);
}

export async function eliminar(req, res) {
  await service.eliminar(req.params.id);
  res.status(204).end();
}