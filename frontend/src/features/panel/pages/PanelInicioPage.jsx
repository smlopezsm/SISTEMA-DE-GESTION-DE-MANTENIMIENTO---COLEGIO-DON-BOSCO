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
    return <EmitirRequerimientoPage />;
  }


  if (usuario.rol === "directivo") return <PanelInicioDirectivo />;
}


export default PanelInicioPage;
