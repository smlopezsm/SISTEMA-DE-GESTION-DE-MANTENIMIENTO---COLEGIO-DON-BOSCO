import { Router } from 'express';
import * as controller from './auth.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { validar } from '../../middlewares/validar.js';

const router = Router();

router.post(
  '/registro',
  validar({
    nombre: { requerido: true, tipo: 'string', min: 2, max: 60 },
    email: { requerido: true, tipo: 'email' },
    password: { requerido: true, tipo: 'string', min: 6, max: 72 },
    nombreUsuario: { tipo: 'string', min: 3, max: 50 },
    dni: { tipo: 'string', regex: /^[0-9.]+$/, mensaje: 'El DNI debe contener solo números' },
  }),
  asyncHandler(controller.registro),
);

router.post(
  '/login',
  validar({
    password: { requerido: true, tipo: 'string' },
  }),
  asyncHandler(controller.login),
);

router.get('/perfil', verificarToken, asyncHandler(controller.perfil));

export default router;
