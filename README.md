# Sistema de Gestión de Mantenimiento — Colegio Don Bosco

Permite registrar y dar seguimiento a requerimientos de infraestructura, asignar tareas de mantenimiento a personal interno o externo, registrar gastos, aprobar o rechazar trabajos finalizados y visualizar estadísticas para la toma de decisiones.

El sistema distingue **tres roles** con permisos diferenciados:

| Rol | Descripción |
|---|---|
| **Ordenanza** | Emite requerimientos, consulta los suyos y edita su perfil. |
| **Jefe de Mantenimiento** | Gestiona tareas, asigna personal, registra gastos y da seguimiento. |
| **Directivo** | Aprueba o rechaza tareas, accede a estadísticas y gestiona cuentas. |

## Tecnologías utilizadas

### Frontend
- **React 19** + **Vite 8**
- **React Router 8** (`createBrowserRouter`, `loader`, `errorElement`)
- **Bootstrap 5** para estilos y componentes
- **React Icons** (Font Awesome 6)
- **Context API** para notificaciones (toasts)
- **SessionStorage** para persistir el token y la sesión

### Backend
- **Node.js 20.12+** (probado con Node 24)
- **Express 5**
- **PostgreSQL 16** con `pg` y pool de conexiones
- **JWT** (`jsonwebtoken`) para autenticación
- **bcryptjs** para hashear contraseñas
- **CORS** configurado para el frontend
- Arquitectura en capas: `routes → controller → service → repository`

---

## Estructura del repositorio

```text
.
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── postman/
│   │   └── DonBosco-Mantenimiento.postman_collection.json
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── modules/
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    ├── .env.example
    └── package.json
```

---

## Requisitos previos

- **Node.js** 20.12 o superior
- **npm** 9 o superior
- **PostgreSQL 16** con `psql` o pgAdmin
- **Postman** para probar la API

### Si `psql` no está en el PATH (Windows)

Se puede usar la ruta completa:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" --version
```

Si la versión instalada es otra, cambiar `16` por la carpeta correspondiente dentro de `C:\Program Files\PostgreSQL`.

---

## 1. Crear la base de datos

Desde la raíz del repositorio:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE donbosco_mantenimiento;"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d donbosco_mantenimiento -f backend\database\schema.sql
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d donbosco_mantenimiento -f backend\database\seed.sql
```

Cada comando pide la contraseña del usuario `postgres`.

> `schema.sql` recrea las tablas y `seed.sql` carga los datos de prueba. Si se vuelven a ejecutar, se pierden los datos anteriores.

### Alternativa con pgAdmin

1. Crear la base `donbosco_mantenimiento`.
2. Abrir **Query Tool** sobre esa base.
3. Ejecutar `backend/database/schema.sql`.
4. Ejecutar `backend/database/seed.sql`.

---

## 2. Configurar y levantar el backend

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Editar `backend/.env` y completar como mínimo:

```dotenv
PORT=3000
CORS_ORIGIN=http://localhost:5173

PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=tu-contraseña-de-postgres
PGDATABASE=donbosco_mantenimiento

JWT_SECRET=una-clave-larga-y-aleatoria
JWT_EXPIRES_IN=1h
```

Para generar `JWT_SECRET`:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

El servidor queda disponible en:

```text
http://localhost:3000/api/v1
```

Comprobar:

```powershell
curl http://localhost:3000/api/v1/health
```

> El archivo `.env` no se sube al repositorio. `JWT_SECRET` no tiene valor por defecto: si falta, el servidor no arranca.

---

## 3. Levantar el frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

Opcionalmente, crear `frontend/.env.local` si la API corre en otra URL:

```dotenv
VITE_API_URL=http://localhost:3000/api/v1
```

Si no se define, el frontend usa `http://localhost:3000/api/v1` por defecto.

---

## 4. Usuarios de prueba

Todas las cuentas del seed usan la contraseña **`1234`**.

| Rol | Usuario | Contraseña |
|---|---|---|
| Ordenanza | `atorres` | `1234` |
| Ordenanza | `lfernandez` | `1234` |
| Jefe de Mantenimiento | `jrodriguez` | `1234` |
| Directivo | `cperez` | `1234` |
| Directivo | `mgomez` | `1234` |

También se puede iniciar sesión con el correo electrónico, por ejemplo `atorres@donbosco.org.ar`.

El endpoint público de registro crea únicamente cuentas de **Ordenanza**. Las cuentas de Directivo y Jefe se crean desde el panel del Directivo o desde `POST /api/v1/usuarios`.

---

## 5. Probar la API con Postman

1. Importar `backend/postman/DonBosco-Mantenimiento.postman_collection.json`.
2. Ejecutar primero la carpeta **01 · Autenticación**: guarda automáticamente `tokenJefe`, `tokenDirectivo`, `tokenOrdenanza` y `token`.
3. Ejecutar el resto de las carpetas en orden.

La colección incluye:

- Variables de colección (`baseUrl`, `token`, tokens por rol e IDs creados).
- Carpetas por recurso.
- Casos exitosos y casos de error (`400`, `401`, `403`, `404`, `409`).
- Login incorrecto, acceso sin token, token adulterado, rol incorrecto y recurso inexistente.

### Flujo mínimo recomendado

1. **Login Jefe**, **Login Directivo** y **Login Ordenanza**.
2. **Perfil con token**.
3. Listar requerimientos y tareas.
4. Crear un requerimiento como Ordenanza.
5. Crear una tarea a partir de ese requerimiento como Jefe.
6. Cambiar la tarea a `en-proceso` y luego a `finalizada`.
7. Aprobar o rechazar la tarea como Directivo.
8. Registrar una compra y consultar el historial.
9. Consultar notificaciones y estadísticas.

---

## 6. Endpoints implementados

Base: `http://localhost:3000/api/v1`

| Método | Endpoint | Acceso |
|---|---|---|
| POST | `/auth/registro` | Público (Ordenanza) |
| POST | `/auth/login` | Público |
| GET | `/auth/perfil` | Token |
| GET | `/usuarios` | Directivo |
| GET | `/usuarios/:id` | Directivo o el propio usuario |
| POST | `/usuarios` | Directivo |
| PUT | `/usuarios/:id` | Directivo o el propio usuario |
| DELETE | `/usuarios/:id` | Directivo (baja lógica) |
| GET | `/requerimientos` | Autenticado, filtrado por rol |
| GET | `/requerimientos/categorias` | Autenticado |
| GET | `/requerimientos/:id` | Jefe o el dueño |
| POST | `/requerimientos` | Autenticado |
| PUT | `/requerimientos/:id` | Jefe o el dueño si está pendiente |
| DELETE | `/requerimientos/:id` | Jefe (baja lógica) |
| GET | `/tareas` | Jefe y Directivo |
| GET | `/tareas/:id` | Jefe y Directivo |
| POST | `/tareas` | Jefe |
| PUT | `/tareas/:id` | Jefe |
| PUT | `/tareas/:id/estado` | Jefe |
| PUT | `/tareas/:id/evaluacion` | Directivo |
| GET | `/tareas/:id/compras` | Jefe y Directivo |
| POST | `/tareas/:id/compras` | Jefe |
| GET | `/tareas/:id/historial` | Jefe y Directivo |
| GET | `/personal-externos` | Jefe |
| GET | `/personal-externos/:id` | Jefe |
| POST | `/personal-externos` | Jefe |
| PUT | `/personal-externos/:id` | Jefe |
| DELETE | `/personal-externos/:id` | Jefe (baja lógica) |
| GET | `/notificaciones` | Jefe y Directivo |
| PUT | `/notificaciones/:id` | Jefe y Directivo |
| GET | `/estadisticas` | Directivo |

Filtros disponibles:

- `GET /requerimientos?sector=&estado=&desde=&hasta=`
- `GET /tareas?estado=&prioridad=&sector=&desde=&hasta=`
- `GET /personal-externos?especialidad=&activo=&busqueda=`
- `GET /notificaciones?leida=`
- `GET /estadisticas?hace=30`

---

## 7. Autenticación y seguridad

- Las contraseñas se guardan hasheadas con **bcryptjs**; nunca en texto plano.
- Ninguna respuesta de la API devuelve la contraseña ni su hash.
- El login devuelve `{ token, usuario }`; el token incluye `sub`, `rol` y `nombreUsuario`.
- Las rutas protegidas esperan `Authorization: Bearer <token>`.
- `verificarToken` valida firma y vencimiento; `verificarRol` controla el acceso por rol.
- `validar` valida el body antes de llegar al service.
- `errorHandler` centraliza los errores y evita devolver detalles internos al cliente.
- El secreto JWT y las credenciales de PostgreSQL están en variables de entorno.

### Middlewares propios

| Middleware | Función |
|---|---|
| `verificarToken` | Valida el JWT y carga `req.usuario`. |
| `verificarRol(...roles)` | Restringe el acceso según el rol. |
| `validar(reglas)` | Valida tipos, campos obligatorios, enums y longitudes. |
| `registrarPeticion` | Registra método, URL, estado y duración. |
| `errorHandler` / `notFound` | Manejo centralizado de errores y rutas inexistentes. |

---

## 8. Estado de la integración con el frontend

Integrado con la API:

- Login con JWT.
- Registro público de Ordenanza.
- Persistencia del token en `sessionStorage`.
- Envío de `Authorization` en las peticiones protegidas.
- Redirección a `/login` cuando no hay sesión y control de acceso por rol.
- **Emitir requerimiento**: el formulario consume `POST /api/v1/requerimientos`, guarda categoría, descripción, sector e imagen en PostgreSQL y muestra estados de carga y error. Las categorías se cargan desde `GET /api/v1/requerimientos/categorias`.
- **Mis requerimientos**: consume `GET /api/v1/requerimientos` y muestra los requerimientos reales del usuario, con estados de carga, error y reintento.
- La imagen del requerimiento se guarda como texto (URL o data URL) en la columna `imagen`.

Los demás módulos todavía usan los JSON/localStorage del frontend para no romper la demo. Se pueden integrar reutilizando `frontend/src/shared/api/apiClient.js`.

---

## 9. Scripts útiles

### Backend

```powershell
cd backend
npm run dev      # desarrollo con recarga automática
npm start        # producción
```

### Frontend

```powershell
cd frontend
npm run dev      # desarrollo
npm run build    # compilar para producción
npm run preview  # previsualizar el build
```

---

## 10. Consideraciones para la entrega

- No subir `.env`, `node_modules` ni credenciales reales.
- El repositorio incluye `backend/.env.example` y `frontend/.env.example`.
- El script SQL permite levantar la base desde cero.
- La colección de Postman se puede importar y ejecutar contra el backend local.
- Antes de la defensa: base creada con `schema.sql` y `seed.sql`, backend y frontend levantados, y Postman importado.

### Notas sobre IA

El uso de herramientas de IA debe declararse en el documento de entrega, indicando herramienta, modelo, usos y prompts relevantes, según lo solicita la cátedra.
