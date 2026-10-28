export const verificarRol = (...rolesPermitidos) => (req, res, next) => {

  //devuelve un error si el usuario no está autenticado o si su rol no esta permitido
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res
      .status(403)
      .json({ error: 'No tenés permisos para acceder a esta sección' });
  }

  next();
};
