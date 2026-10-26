import { Router } from 'express';
import * as controller from './historial.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';

const router = Router({ mergeParams: true });

router.get(
  '/',
  verificarToken,
  verificarRol('jefeMantenimiento', 'directivo'),
  asyncHandler(controller.listar),
);

export default router;
