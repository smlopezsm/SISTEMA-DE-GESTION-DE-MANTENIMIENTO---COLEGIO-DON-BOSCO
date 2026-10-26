import { Router } from 'express';
import * as controller from './compras.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';
import { validar } from '../../middlewares/validar.js';

const router = Router({ mergeParams: true });

router.use(verificarToken);

router.get(
  '/',
  verificarRol('jefeMantenimiento', 'directivo'),
  asyncHandler(controller.listar),
);

router.post(
  '/',
  verificarRol('jefeMantenimiento'),
  validar({
    monto: { requerido: true, tipo: 'numero', minNumero: 0.01 },
    detalle: { requerido: true, tipo: 'string', min: 3, max: 255 },
    categoria: {
      tipo: 'string',
      enum: ['materiales', 'servicios', 'otros'],
    },
    factura: { tipo: 'string', max: 500 },
  }),
  asyncHandler(controller.crear),
);

export default router;
