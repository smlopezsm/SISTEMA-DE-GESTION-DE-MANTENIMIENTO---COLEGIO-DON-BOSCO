import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';


//devuelve un error si el token no es valido o no esta presente en la cabecera de autorizacion
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Falta el token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    req.usuario = {
      id: payload.sub,
      rol: payload.rol,
      nombreUsuario: payload.nombreUsuario,
    };

    next();
  } catch (error) {
    const mensaje =
      error.name === 'TokenExpiredError' ? 'Token vencido' : 'Token inválido';
    return res.status(401).json({ error: mensaje });
  }
};
