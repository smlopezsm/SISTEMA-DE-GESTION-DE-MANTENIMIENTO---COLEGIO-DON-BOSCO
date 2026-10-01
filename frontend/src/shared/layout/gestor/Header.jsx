// Barra superior del area privada: fecha, hora y datos del usuario
import { useEffect, useState } from 'react';
import { FaCalendarDays } from 'react-icons/fa6';
import MenuUsuario from './MenuUsuario';
import './Header.css';


function Header({ usuario, onCerrarSesion }) {
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const fecha = ahora.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  
  const hora = ahora.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="header-gestor d-flex align-items-center justify-content-between px-3 px-md-4 py-2 bg-white border-bottom">
      {/* fecha y hora */}
      <div className="d-none d-md-flex align-items-center gap-3 text-secondary small">
        <span className="d-flex align-items-center gap-2">
          <FaCalendarDays />
          <span className="text-capitalize">{fecha}</span>
        </span>
        <span className="text-muted">|</span>
        <span>{hora}</span>
      </div>

      {/* usuario */}
      <div className="ms-auto">
        <MenuUsuario usuario={usuario} onCerrarSesion={onCerrarSesion} />
      </div>
    </header>
  );
}

export default Header;