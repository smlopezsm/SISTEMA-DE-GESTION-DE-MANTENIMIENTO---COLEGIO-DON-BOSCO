import { createBrowserRouter } from "react-router";
import LayoutPublico from "./shared/layout/LayoutPublico";
import LayoutGestor from "./shared/layout/LayoutGestor";
import AccesoDenegadoPage from "./shared/pages/AccesoDenegadoPage";
import { HomePage } from './features/home';
import { LoginPage } from './features/auth';
import ContactoPage from './features/contacto/pages/ContactoPage';
import { PanelInicioPage } from './features/panel';
import { protegerRuta } from './features/auth/services/authService';

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
      // Inicio
      { index: true, element: <PanelInicioPage /> },
    ],
  },
]);