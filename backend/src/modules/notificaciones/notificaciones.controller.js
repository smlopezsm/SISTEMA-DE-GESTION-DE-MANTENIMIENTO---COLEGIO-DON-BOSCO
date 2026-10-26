import * as service from './notificaciones.service.js';

export async function listar(req, res) {
  const { leida } = req.query;
  const notificaciones = await service.listar(req.usuario, {
    leida:
      leida === undefined ? undefined : leida === 'true' || leida === '1',
  });

  res.json(notificaciones);
}

export async function marcarLeida(req, res) {
  const notificacion = await service.marcarLeida(
    req.params.id,
    req.usuario,
  );
  res.json(notificacion);
}
