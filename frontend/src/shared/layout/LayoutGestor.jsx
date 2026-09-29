// area privada

import { Outlet, useLoaderData, useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import './LayoutGestor.css';

function LayoutGestor() {
  const usuario = useLoaderData();
  const navigate = useNavigate();

  
  const handleCerrarSesion = () => {
    // cerrarSesion();
    navigate('/login');
  };

  return (
    <div className="layout-gestor">
      <Sidebar usuario={usuario} />
      <div className="layout-gestor__main">
        <Header usuario={usuario} onCerrarSesion={handleCerrarSesion} />
        <main className="layout-gestor__contenido">
          <Outlet context={usuario} />
        </main>
      </div>
    </div>
  );
}

export default LayoutGestor;