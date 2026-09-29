// src/Router.jsx
import { createBrowserRouter } from "react-router";
import LayoutPublico from "./shared/layout/LayoutPublico";
import LayoutGestor from "./shared/layout/LayoutGestor";
import AccesoDenegadoPage from "./shared/layout/AccesoDenegadoPage";
import HomePage from "./features/home/pages/HomePage";
import LoginPage from "./features/auth/pages/LoginPage";
import ContactoPage from "./features/contacto/pages/ContactoPage";
import PanelInicioPage from "./features/panel/pages/PanelInicioPage";
import { protegerRuta, requerirRol } from "./features/auth/services/authService";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublico />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "contacto", element: <ContactoPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/gestor",
    element: <LayoutGestor />,
    loader: protegerRuta,
    errorElement: <AccesoDenegadoPage />,
    children: [
      { index: true, element: <PanelInicioPage /> },

    ],
  },
]);