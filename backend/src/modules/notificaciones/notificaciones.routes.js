import { Router } from 'express';
import * as controller from './notificaciones.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';

const router = Router();

router.use(verificarToken);
router.use(verificarRol('jefeMantenimiento', 'directivo'));

router.get('/', asyncHandler(controller.listar));
router.put('/:id', asyncHandler(controller.marcarLeida));

export default router;
