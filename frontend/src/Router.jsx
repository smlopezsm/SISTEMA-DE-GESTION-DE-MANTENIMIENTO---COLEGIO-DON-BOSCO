import { createBrowserRouter } from "react-router";
import LayoutPublico from "./shared/layout/LayoutPublico";
import HomePage from "./features/home/pages/HomePage";
import LoginPage from "./features/auth/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublico />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);