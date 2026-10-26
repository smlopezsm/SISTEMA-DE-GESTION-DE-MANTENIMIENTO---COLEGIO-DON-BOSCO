export const verificarRol = (...rolesPermitidos) => (req, res, next) => {
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
