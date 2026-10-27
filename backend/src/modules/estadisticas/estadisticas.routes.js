import { Router } from 'express';
import * as controller from './estadisticas.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';

const router = Router();
router.get(
  '/',
  verificarToken,
  verificarRol('directivo', 'jefeMantenimiento'),
  asyncHandler(controller.obtener),
);

export default router;
