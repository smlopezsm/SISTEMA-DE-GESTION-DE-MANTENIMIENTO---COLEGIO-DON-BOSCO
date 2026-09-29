import { useOutletContext } from "react-router";

function PanelInicioPage() {
  // LayoutGestor pasa el usuario logueado por el context del Outlet
  const usuario = useOutletContext();

  return (
    <div className="text-center mt-4 mb-5">
      <h1 className="display-6 fw-bold">¡Bienvenido/a, {usuario.nombre}!</h1>
      <p className="text-muted fs-5 mt-2">
        Sistema de gestión de mantenimiento del Colegio Don Bosco
      </p>
    </div>
  );
}

export default PanelInicioPage;