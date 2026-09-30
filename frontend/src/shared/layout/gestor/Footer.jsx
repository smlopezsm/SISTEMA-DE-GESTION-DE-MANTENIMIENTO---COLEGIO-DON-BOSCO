import './Footer.css';

function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer-gestor">
      <div className="container-fluid px-3 px-md-4">
        <p className="footer-gestor__linea mb-0">
          Colegio Don Bosco — Sistema de Gestión de Mantenimiento
        </p>
        <p className="footer-gestor__copyright mb-0">
          © {anio} · Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}

export default Footer;