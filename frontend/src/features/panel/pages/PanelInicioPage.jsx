import { useOutletContext, Navigate } from "react-router";
import PanelInicioJefe from "./PanelInicioJefe";
import PanelInicioDirectivo from "./PanelInicioDirectivo"
import { EmitirRequerimientoPage } from "../../requerimientos";

function PanelInicioPage() {
  const usuario = useOutletContext();

  if (usuario.rol === "jefeMantenimiento") {
    return <PanelInicioJefe />;
  }

  if (usuario.rol === "ordenanza") {
    return <Navigate to="/gestor/requerimientos/nuevo-requerimiento" replace />;
  }

  if (usuario.rol === "directivo") return < PanelInicioDirectivo />;
  return (
    <div className="text-center mt-5">
      <h1 className="h4">¡Hola, {usuario.nombre}!</h1>
      <p className="text-muted">No encontramos un panel para tu rol.</p>
    </div>
  );

}


export default PanelInicioPage;
