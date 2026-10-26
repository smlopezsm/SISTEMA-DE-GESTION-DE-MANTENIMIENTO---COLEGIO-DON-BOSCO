import * as service from './usuarios.service.js';

export async function listar(req, res) {
  const { rol, activo, busqueda } = req.query;

  const usuarios = await service.listar({
    rol,
    activo:
      activo === undefined
        ? undefined
        : activo === 'true' || activo === '1',
    busqueda,
  });

  res.json(usuarios);
}

export async function obtener(req, res) {
  const usuario = await service.obtener(req.params.id, req.usuario);
  res.json(usuario);
}

export async function crear(req, res) {
  const usuario = await service.crear(req.body);
  res.status(201).json(usuario);
}

export async function actualizar(req, res) {
  const usuario = await service.actualizar(
    req.params.id,
    req.body,
    req.usuario,
  );
  res.json(usuario);
}

export async function eliminar(req, res) {
  await service.eliminar(req.params.id, req.usuario);
  res.status(204).end();
}
