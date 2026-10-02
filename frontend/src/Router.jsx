import { createBrowserRouter } from "react-router";
//layouts
import LayoutPublico from "./shared/layout/publico/LayoutPublico";
import LayoutGestor from "./shared/layout/gestor/LayoutGestor";
//error
import AccesoDenegadoPage from "./shared/pages/AccesoDenegadoPage";
//publico
import { HomePage } from './features/home';
import { LoginPage } from './features/auth';
import { ContactoPage } from './features/contacto';
import { protegerRuta, requerirRol } from './features/auth/services/authService';
//panel segun rol
import { PanelInicioPage } from './features/panel';
//tareas y requerimientos
import { RequerimientosListadoPage, DetalleRequerimientoPage, EmitirRequerimientoPage, MisRequerimientosPage, } from './features/requerimientos';
import { TareasListadoPage, FormularioTareaPage, DetalleTareaPage, } from './features/tareas';
//personal externo
import { PersonalExternoPage, FormularioPersonalPage } from './features/personal-externo';
//notificaciones
import { NotificacionesPage } from './features/notificaciones';
//usuarios y perfil
import { PerfilPage, EditarPerfilPage } from './features/perfil';
import { UsuariosPage, EditarUsuarioPage, NuevoUsuarioPage } from "./features/usuarios";
//estadisticas de directivo
import { EstadisticasPage } from "./features/estadisticas";

export const router = createBrowserRouter([
  // publico
  {
    path: "/",
    element: <LayoutPublico />,

    children: [
      { index: true, element: <HomePage /> },
      { path: "contacto", element: <ContactoPage /> },
    ],
  },

  // login
  {
    path: "/login",
    element: <LoginPage />,
  },

  // privado
  {
    path: "/gestor",
    element: <LayoutGestor />,
    loader: protegerRuta,
    errorElement: <AccesoDenegadoPage />,
    children: [
      { index: true, element: <PanelInicioPage /> },

      { path: "requerimientos/nuevo-requerimiento", element: <EmitirRequerimientoPage />, loader: requerirRol(["ordenanza", "directivo", "jefeMantenimiento"]), }, 
      { path: "perfil", element: <PerfilPage /> },
      { path: "perfil/editar", element: <EditarPerfilPage /> },

      // Jefe de mantenimiento
      { path: "requerimientos", element: <RequerimientosListadoPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'requerimientos/:id', element: <DetalleRequerimientoPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'tareas/nueva', element: <FormularioTareaPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'tareas/:id/editar', element: <FormularioTareaPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'personal-externo', element: <PersonalExternoPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'personal-externo/:id/editar', element: <FormularioPersonalPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'personal-externo/nuevo', element: <FormularioPersonalPage />, loader: requerirRol(["jefeMantenimiento"]) },
      { path: 'notificaciones', element: <NotificacionesPage />, loader: requerirRol(["jefeMantenimiento", "directivo"]) },
      //Directivo
      { path: "dashboard", element: <EstadisticasPage />, loader: requerirRol(["directivo"]), },
      { path: "usuarios", element: <UsuariosPage />, loader: requerirRol(["directivo"]), },
      { path: "tareas", element: <TareasListadoPage />, loader: requerirRol(["directivo", "jefeMantenimiento"]), },
      { path: "tareas/:id", element: <DetalleTareaPage />, loader: requerirRol(["directivo", "jefeMantenimiento"]), },
      { path: "usuarios/nuevo", element: <NuevoUsuarioPage />, loader: requerirRol(["directivo"]), },
      { path: "usuarios/:clave", element: <EditarUsuarioPage />, loader: requerirRol(["directivo"]), },
      //Ordenanza
      { path: "requerimientos/mis-requerimientos", element: <MisRequerimientosPage />, loader: requerirRol(["ordenanza"]) },
    ]
  },
]);