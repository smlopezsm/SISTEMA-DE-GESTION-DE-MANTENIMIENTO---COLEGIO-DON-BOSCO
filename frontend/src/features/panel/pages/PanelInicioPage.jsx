import { useOutletContext, Navigate } from "react-router";
import PanelInicioJefe from "./PanelInicioJefe";
import InicioDirectivoPage from "./InicioDirectivoPage";

function PanelInicioPage() {
  const usuario = useOutletContext();

  if (usuario.rol === "jefeMantenimiento") {
    return <PanelInicioJefe />;
  }

  if (usuario.rol === "ordenanza") {
    return <Navigate to="/gestor/requerimientos/nuevo" replace />;
  }

<<<<<<< HEAD
  // directivo
=======
  if (usuario.rol === "directivo") return <InicioDirectivoPage />;
  // Directivo (placeholder hasta que exista PanelDirectivoPage)
>>>>>>> directivos
  return (
    <div className="text-center mt-5">
      <h1 className="h4">¡Hola, {usuario.nombre}!</h1>
      <p className="text-muted">Panel del Directivo en construccion.</p>
    </div>
  );
}

export default PanelInicioPage;
