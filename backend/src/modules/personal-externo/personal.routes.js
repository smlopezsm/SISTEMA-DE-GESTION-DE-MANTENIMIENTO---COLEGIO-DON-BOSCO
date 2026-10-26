import { Router } from 'express';
import * as controller from './personal.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';
import { validar } from '../../middlewares/validar.js';

const router = Router();

router.use(verificarToken);
router.use(verificarRol('jefeMantenimiento'));

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.obtener));

router.post(
  '/',
  validar({
    nombre: { requerido: true, tipo: 'string', min: 2, max: 100 },
    apellido: { requerido: true, tipo: 'string', min: 2, max: 100 },
    telefono: { requerido: true, tipo: 'string', min: 5, max: 25 },
    especialidad: { requerido: true, tipo: 'string', min: 3, max: 80 },
    dni: {
      tipo: 'string',
      regex: /^[0-9.]+$/,
      mensaje: 'El DNI debe contener solo números',
    },
    email: { tipo: 'email' },
    activo: { tipo: 'boolean' },
  }),
  asyncHandler(controller.crear),
);

router.put(
  '/:id',
  validar({
    nombre: { tipo: 'string', min: 2, max: 100 },
    apellido: { tipo: 'string', min: 2, max: 100 },
    telefono: { tipo: 'string', min: 5, max: 25 },
    especialidad: { tipo: 'string', min: 3, max: 80 },
    dni: {
      tipo: 'string',
      regex: /^[0-9.]+$/,
      mensaje: 'El DNI debe contener solo números',
    },
    email: { tipo: 'email' },
    activo: { tipo: 'boolean' },
  }),
  asyncHandler(controller.actualizar),
);

router.delete('/:id', asyncHandler(controller.eliminar));

export default router;
