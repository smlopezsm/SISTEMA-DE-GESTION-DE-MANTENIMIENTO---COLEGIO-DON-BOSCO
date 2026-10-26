import { Router } from 'express';
import * as controller from './usuarios.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';
import { validar } from '../../middlewares/validar.js';

const router = Router();

router.use(verificarToken);

router.get(
  '/',
  verificarRol('directivo'),
  asyncHandler(controller.listar),
);

router.get('/:id', asyncHandler(controller.obtener));

router.post(
  '/',
  verificarRol('directivo'),
  validar({
    nombre: { requerido: true, tipo: 'string', min: 2, max: 60 },
    apellido: { requerido: true, tipo: 'string', min: 2, max: 60 },
    email: { requerido: true, tipo: 'email' },
    rol: {
      requerido: true,
      tipo: 'string',
      enum: ['ordenanza', 'jefeMantenimiento', 'directivo'],
    },
    nombreUsuario: { tipo: 'string', min: 3, max: 50 },
    dni: {
      tipo: 'string',
      regex: /^[0-9.]+$/,
      mensaje: 'El DNI debe contener solo números',
    },
    password: { tipo: 'string', min: 6, max: 72 },
    activo: { tipo: 'boolean' },
  }),
  asyncHandler(controller.crear),
);

router.put(
  '/:id',
  validar({
    nombre: { tipo: 'string', min: 2, max: 60 },
    apellido: { tipo: 'string', min: 2, max: 60 },
    email: { tipo: 'email' },
    rol: {
      tipo: 'string',
      enum: ['ordenanza', 'jefeMantenimiento', 'directivo'],
    },
    nombreUsuario: { tipo: 'string', min: 3, max: 50 },
    dni: {
      tipo: 'string',
      regex: /^[0-9.]+$/,
      mensaje: 'El DNI debe contener solo números',
    },
    password: { tipo: 'string', min: 6, max: 72 },
    activo: { tipo: 'boolean' },
  }),
  asyncHandler(controller.actualizar),
);

router.delete(
  '/:id',
  verificarRol('directivo'),
  asyncHandler(controller.eliminar),
);

export default router;
