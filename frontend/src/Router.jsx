import { createBrowserRouter } from "react-router";
import LayoutPublico from "./shared/layout/publico/LayoutPublico";
import LayoutGestor from "./shared/layout/gestor/LayoutGestor";
import AccesoDenegadoPage from "./shared/pages/AccesoDenegadoPage";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/auth";
import ContactoPage from "./features/contacto/pages/ContactoPage";
import { PanelInicioPage } from "./features/panel";
import { EstadisticasPage } from "./features/estadisticas";
import { UsuariosPage } from "./features/usuarios";
import {
  protegerRuta,
  requerirRol,
} from "./features/auth/services/authService";
import {
  RequerimientosListadoPage,
  DetalleRequerimientoPage,
} from "./features/requerimientos";
import {
  TareasListadoPage,
  FormularioTareaPage,
  DetalleTareaPage,
} from "./features/tareas";
import {
  PersonalExternoPage,
  FormularioPersonalPage,
} from "./features/personal-externo";
import PanelInicioJefe from "./features/panel/pages/PanelInicioJefe";
import { NotificacionesPage } from "./features/notificaciones";

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
      { path: "dashboard", element: <EstadisticasPage /> },
      { path: "usuarios", element: <UsuariosPage /> },
      {
        path: "inicio",
        element: <PanelInicioJefe />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      {
        path: "requerimientos",
        element: <RequerimientosListadoPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      {
        path: "requerimientos/:id",
        element: <DetalleRequerimientoPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      {
        path: "tareas",
        element: <TareasListadoPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      {
        path: "tareas/nueva",
        element: <FormularioTareaPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      {
        path: "tareas/:id/editar",
        element: <FormularioTareaPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      { path: "tareas/:id", element: <DetalleTareaPage /> },
      {
        path: "personal-externo",
        element: <PersonalExternoPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      {
        path: "personal-externo/:id/editar",
        element: <FormularioPersonalPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
      { path: "personal-externo/nuevo", element: <FormularioPersonalPage /> },
      {
        path: "notificaciones",
        element: <NotificacionesPage />,
        loader: requerirRol(["jefeMantenimiento"]),
      },
    ],
  },
]);
