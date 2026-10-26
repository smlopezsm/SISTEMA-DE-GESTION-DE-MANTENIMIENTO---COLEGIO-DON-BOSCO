import { Router } from 'express';
import * as controller from './tareas.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';
import { validar } from '../../middlewares/validar.js';

const router = Router();

router.use(verificarToken);
router.use(verificarRol('jefeMantenimiento', 'directivo'));

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.obtener));

router.post(
  '/',
  verificarRol('jefeMantenimiento'),
  validar({
    idRequerimiento: {
      requerido: true,
      tipo: 'numero',
      entero: true,
      minNumero: 1,
    },
    prioridad: {
      requerido: true,
      tipo: 'string',
      enum: ['baja', 'media', 'alta'],
    },
    observaciones: { tipo: 'string', max: 2000 },
    costoPersonalExterno: { tipo: 'numero', minNumero: 0 },
  }),
  asyncHandler(controller.crear),
);

router.put(
  '/:id',
  verificarRol('jefeMantenimiento'),
  validar({
    prioridad: { tipo: 'string', enum: ['baja', 'media', 'alta'] },
    observaciones: { tipo: 'string', max: 2000 },
    costoPersonalExterno: { tipo: 'numero', minNumero: 0 },
  }),
  asyncHandler(controller.actualizar),
);

router.put(
  '/:id/estado',
  verificarRol('jefeMantenimiento'),
  validar({
    estado: {
      requerido: true,
      tipo: 'string',
      enum: ['pendiente', 'en-proceso', 'demorada', 'cancelada', 'finalizada'],
    },
    motivo: { tipo: 'string', max: 500 },
  }),
  asyncHandler(controller.cambiarEstado),
);

router.put(
  '/:id/evaluacion',
  verificarRol('directivo'),
  validar({
    estado: {
      requerido: true,
      tipo: 'string',
      enum: ['aprobada', 'rechazada'],
    },
    motivo: { tipo: 'string', max: 500 },
  }),
  asyncHandler(controller.evaluar),
);

export default router;
