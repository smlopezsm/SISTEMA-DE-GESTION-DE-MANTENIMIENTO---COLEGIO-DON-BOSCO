import { createBrowserRouter } from "react-router";
import LayoutPublico from "./shared/layout/LayoutPublico";
import HomePage from "./features/home/pages/HomePage";
import LoginPage from "./features/auth/pages/LoginPage";
import ContactoPage from "./features/contacto/pages/ContactoPage";

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
]);