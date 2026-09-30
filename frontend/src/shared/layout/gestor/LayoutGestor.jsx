// area privada
import { Outlet, useLoaderData, useNavigate } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import './LayoutGestor.css';

function LayoutGestor() {
  const usuario = useLoaderData();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
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

        <Footer />
      </div>
    </div>
  );
}

export default LayoutGestor;