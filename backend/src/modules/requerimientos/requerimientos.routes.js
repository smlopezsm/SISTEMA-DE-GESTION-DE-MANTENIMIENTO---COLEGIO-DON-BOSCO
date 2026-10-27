import { Router } from 'express';
import * as controller from './requerimientos.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { verificarToken } from '../../middlewares/verificarToken.js';
import { verificarRol } from '../../middlewares/verificarRol.js';
import { validar } from '../../middlewares/validar.js';

const router = Router();
router.use(verificarToken);

// Ruta de categorías (TIENE QUE IR ANTES DE /:id)
router.get('/categorias', asyncHandler(controller.listarCategorias));

router.get('/', asyncHandler(controller.listar));
router.get('/:id', asyncHandler(controller.obtener));

router.post(
  '/',
  validar({
    idCategoria: { requerido: true, tipo: 'numero', entero: true, minNumero: 1 },
    descripcion: { requerido: true, tipo: 'string', min: 5, max: 2000 },
    imagen: { tipo: 'string', max: 8000000 },
  }),
  asyncHandler(controller.crear),
);

router.put(
  '/:id',
  validar({
    idCategoria: { tipo: 'numero', entero: true, minNumero: 1 },
    descripcion: { tipo: 'string', min: 5, max: 2000 },
    imagen: { tipo: 'string', max: 8000000 },
  }),
  asyncHandler(controller.actualizar),
);

router.delete('/:id', verificarRol('jefeMantenimiento'), asyncHandler(controller.eliminar));

export default router;