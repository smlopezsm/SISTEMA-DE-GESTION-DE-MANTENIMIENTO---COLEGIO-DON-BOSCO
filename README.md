# Sistema de Gestión de Mantenimiento — Colegio Don Bosco

Permite registrar y dar seguimiento a requerimientos de infraestructura, asignar tareas de mantenimiento a personal interno o externo, registrar gastos, aprobar o rechazar trabajos finalizados, y visualizar estadísticas para la toma de decisiones.

El sistema distingue **tres roles** con permisos diferenciados:

|            Rol            |                            Descripción                              |
|---------------------------|---------------------------------------------------------------------|
|       **Ordenanza**       | Emite requerimientos, consulta los suyos y edita su perfil.         |
| **Jefe de Mantenimiento** | Gestiona tareas, asigna personal, registra gastos y da seguimiento. |
|       **Directivo**       | Aprueba o rechaza tareas, accede a estadísticas y gestiona cuentas. |


## 🛠 Tecnologías utilizadas

### Front-end
- **React 19** + **Vite 8**
- **React Router 8** (con `createBrowserRouter`, `loader`, `errorElement`)
- **Bootstrap 5** para estilos y componentes
- **React Icons** (Font Awesome 6) para iconografía
- **Context API** para notificaciones (toasts)
- **SessionStorage** para persistencia de sesión

## Instalación y ejecución

### Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Navegador moderno (Chrome, Firefox, Edge)

### Pasos

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd SISTEMA-DE-GESTION-DE-M...
```

2. **Instalar dependencias del front-end**

```bash
cd frontend
npm install
```

3. **Levantar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

4. **Compilar para producción** (opcional)

```bash
npm run build
npm run preview
```

---

## 👥 Usuarios de prueba

Los usuarios están definidos en los JSON dentro de `src/data/`:

| Rol                   | Usuario     | Contraseña |
|-----------------------|-------------|------------|
| Ordenanza             | `atorres`   | `1234`     |
| Jefe de Mantenimiento | `jrodriguez`| `1234`     |
| Directivo             | `cperez`    | `1234`     |

**Importante:** estas credenciales son de prueba. En producción, las contraseñas deben ir hasheadas (bcrypt) y gestionadas por el back-end con JWT.

## Funcionalidades por rol

### Ordenanza
- Iniciar sesión
- Emitir un nuevo requerimiento (título, descripción, lugar, imagen opcional)
- Consultar sus propios requerimientos en formato lista
- Filtrar por estado, lugar y fecha
- Ver el detalle de un requerimiento propio
- Editar su perfil

### Jefe de Mantenimiento
- Ver panel de inicio con resumen (requerimientos pendientes, tareas en proceso, demoradas, finalizadas)
- Ver listado de requerimientos pendientes
- Crear una tarea a partir de un requerimiento
- Asignar la tarea a sí mismo, a personal interno o externo
- Definir prioridad de la tarea (baja, media, alta)
- Cambiar el estado de la tarea (pendiente, en proceso, demorada, cancelada, finalizada)
- Registrar fecha y hora de inicio y fin
- Registrar observaciones
- Registrar compras de materiales o servicios adelantados de su bolsillo
- Marcar tarea como "demorada por aprobación"
- Dar de alta/baja personal externo (nombre, apellido, teléfono, especialidad)
- Cancelar tarea y generar una nueva equivalente
- Recibir notificaciones internas y por correo al emitirse un nuevo requerimiento

### Directivo
- Ver panel de estadísticas (espacios con más requerimientos, gastos en personal externo, gastos en materiales)
- Aprobar tareas finalizadas
- Rechazar tareas finalizadas (genera una nueva tarea equivalente)
- Consultar historial completo y detallado de cada requerimiento
- Gestionar cuentas de personal (alta, baja, modificación)
- Recibir notificaciones internas y por correo al finalizar una tarea


## Flujo principal del sistema

```
1. Ordenanza detecta un problema
   └── Emite un requerimiento (título, descripción, lugar, imagen)

2. Jefe de Mantenimiento recibe notificación
   └── Crea una tarea a partir del requerimiento
       ├── Asigna prioridad
       ├── Asigna responsable (él mismo, personal interno o externo)
       └── Registra fecha y hora de inicio

3. Jefe de Mantenimiento gestiona la tarea
   ├── En proceso → registra avance
   ├── Demorada → por aprobación externa
   ├── Cancelada → registra motivo y genera nueva tarea
   └── Finalizada → registra fecha, hora y observaciones

4. Directivo evalúa la tarea finalizada
   ├── Aprueba → tarea cerrada
   └── Rechaza → se genera una nueva tarea equivalente

5. Cada cambio de estado queda en el historial de auditoría
```

## Guía de uso rápida

### 1. Iniciar sesión
Ingresá con tu usuario o correo y contraseña. El sistema valida las credenciales y redirige al panel correspondiente según tu rol.

### 2. Emitir un requerimiento (Ordenanza)
- Ir a **Requerimientos → Nuevo requerimiento**
- Completar título, descripción y lugar
- Opcionalmente adjuntar una imagen (JPG/PNG, máx. 5 MB)
- Presionar **Emitir requerimiento**

### 3. Crear una tarea (Jefe de Mantenimiento)
- Ir a **Requerimientos pendientes**
- Presionar **Iniciar tarea** en el requerimiento deseado
- Completar prioridad, responsable y observaciones
- Guardar

### 4. Gestionar una tarea
- Ir a **Tareas**
- Cambiar el estado según corresponda
- Registrar fechas, horas y observaciones
- Si se cancela, registrar el motivo

### 5. Aprobar o rechazar (Directivo)
- Ir a **Tareas** → filtrar por "Finalizadas"
- Presionar **Aprobar** o **Rechazar**
- Si se rechaza, se genera una nueva tarea equivalente


## Consideraciones técnicas

### Seguridad
- La sesión se guarda en `sessionStorage` (no `localStorage`) para mayor seguridad.
- Las rutas privadas están protegidas con `protegerRuta` y `requerirRol`.
- El acceso no autorizado redirige a `/login` o muestra `AccesoDenegadoPage`.

### Manejo de errores
- Los loaders de React Router lanzan `redirect` o `Response` con status 403.
- Las páginas usan `errorElement` para mostrar pantallas amigables.

### UX
- Diseño responsive con Bootstrap 5.
- Vistas adaptadas a móvil, tablet y escritorio.
- Feedback visual con spinners, toasts y alertas.
- Validaciones en cliente antes de enviar datos.

### Control de versiones
- Git con ramas por feature.
- Commits descriptivos.
- Pull requests para integración.



## Módulos del front-end

| Módulo                    | Ruta                                        | Acceso                |
|---------------------------|---------------------------------------------|-----------------------|
| Home / Landing            | `/`                                         | Público               |
| Contacto                  | `/contacto`                                 | Público               |
| Login                     | `/login`                                    | Público               |
| Panel del Jefe            | `/gestor/inicio`                            | Jefe de Mantenimiento |
| Requerimientos pendientes | `/gestor/requerimientos`                    | Jefe de Mantenimiento |
| Detalle de requerimiento  | `/gestor/requerimientos/:id`                | Jefe de Mantenimiento |
| Emitir requerimiento      | `/gestor/requerimientos/nuevo-requerimiento`| Autenticados          |
| Mis requerimientos        | `/gestor/requerimientos/mis-requerimientos` | Ordenanza             |
| Tareas                    | `/gestor/tareas`                            | Jefe / Directivo      |
| Nueva tarea               | `/gestor/tareas/nueva`                      | Jefe de Mantenimiento |
| Editar tarea              | `/gestor/tareas/:id/editar`                 | Jefe de Mantenimiento |
| Detalle de tarea          | `/gestor/tareas/:id`                        | Jefe / Directivo      |
| Personal externo          | `/gestor/personal-externo`                  | Jefe de Mantenimiento |
| Nuevo personal externo    | `/gestor/personal-externo/nuevo`            | Jefe de Mantenimiento |
| Editar personal externo   | `/gestor/personal-externo/:id/editar`       | Jefe de Mantenimiento |
| Dashboard / Estadísticas  | `/gestor/dashboard`                         | Directivo             |
| Usuarios                  | `/gestor/usuarios`                          | Directivo             |
| Notificaciones            | `/gestor/notificaciones`                    | Jefe / Directivo      |
| Perfil                    | `/gestor/perfil`                            | Autenticados          |
| Editar perfil             | `/gestor/perfil/editar`                     | Autenticados          |
| Acceso denegado           | (errorElement)                              | —                     |

---