export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  //atrapa el codigo de postgres y lo convierte en un mensaje de error
  if (err.code === '23505') {
    return res
      .status(409)
      .json({ error: 'Ya existe un registro con esos datos' });
  }

  if (err.code === '23503') {
    return res
      .status(400)
      .json({ error: 'El registro relacionado no existe o está en uso' });
  }

  if (err.code === '23514') {
    return res
      .status(400)
      .json({ error: 'Los datos no cumplen una restricción de la base' });
  }

  if (err.code === '22P02') {
    return res.status(400).json({ error: 'Formato de dato inválido' });
  }

  const status = err.status ?? 500;

  if (status === 500) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

  res.status(status).json({ error: err.message });
};
