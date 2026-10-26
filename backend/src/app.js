import express from 'express';
import cors from 'cors';
import { corsOptions } from './config/cors.js';
import { registrarPeticion } from './middlewares/registrarPeticion.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import usuariosRoutes from './modules/usuarios/usuarios.routes.js';
import requerimientosRoutes from './modules/requerimientos/requerimientos.routes.js';
import tareasRoutes from './modules/tareas/tareas.routes.js';
import comprasRoutes from './modules/compras/compras.routes.js';
import historialRoutes from './modules/historial/historial.routes.js';
import personalRoutes from './modules/personal-externo/personal.routes.js';
import notificacionesRoutes from './modules/notificaciones/notificaciones.routes.js';
import estadisticasRoutes from './modules/estadisticas/estadisticas.routes.js';

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(registrarPeticion);

app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true, servicio: 'Don Bosco Mantenimiento API' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/requerimientos', requerimientosRoutes);

// Las rutas anidadas de tareas se montan antes del router de tareas.
app.use('/api/v1/tareas/:id/compras', comprasRoutes);
app.use('/api/v1/tareas/:id/historial', historialRoutes);
app.use('/api/v1/tareas', tareasRoutes);

app.use('/api/v1/personal-externos', personalRoutes);
app.use('/api/v1/notificaciones', notificacionesRoutes);
app.use('/api/v1/estadisticas', estadisticasRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
