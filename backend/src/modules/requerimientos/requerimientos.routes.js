import { Router } from 'express';
import * as controller from './requerimientos.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';
import { validar } from '../../middlewares/validar.js';

const router = Router();

router.use(verificarToken);

router.get('/', asyncHandler(controller.listar));

router.get('/:id', asyncHandler(controller.obtener));

router.post(
  '/',
  validar({
    titulo: { requerido: true, tipo: 'string', min: 3, max: 100 },
    descripcion: { requerido: true, tipo: 'string', min: 5, max: 2000 },
    imagen: { tipo: 'string', max: 8000000 },
  }),
  asyncHandler(controller.crear),
);

router.put(
  '/:id',
  validar({
    titulo: { tipo: 'string', min: 3, max: 100 },
    descripcion: { tipo: 'string', min: 5, max: 2000 },
    imagen: { tipo: 'string', max: 8000000 },
  }),
  asyncHandler(controller.actualizar),
);

router.delete(
  '/:id',
  verificarRol('jefeMantenimiento'),
  asyncHandler(controller.eliminar),
);

export default router;
