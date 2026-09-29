import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App.jsx";
import { obtenerTodosLosColores } from './shared/utils/colores';
import './shared/styles/variables.css';

// precargar los colores despues de importar el CSS
obtenerTodosLosColores();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
