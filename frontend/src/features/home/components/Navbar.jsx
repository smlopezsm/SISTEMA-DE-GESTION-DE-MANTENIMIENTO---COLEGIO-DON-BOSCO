import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGestionOpen, setIsGestionOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleGestion = () => setIsGestionOpen(!isGestionOpen);

  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <a href="#" className="navbar-brand">
            <img
              src="/assets/colegio/logo1.png"
              alt="Don Bosco"
              className="header-logo"
            />
          </a>

          {/* Hamburger Menu Button */}
          <button
            className="navbar-toggler"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Menu */}
          <div className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#" className="nav-link">
                  QUIÉNES SOMOS
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  NIVELES EDUCATIVOS
                </a>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  onClick={toggleGestion}
                >
                  GESTIÓN
                </button>
                {isGestionOpen && (
                  <ul className="dropdown-menu">
                    <li>
                      <a href="/login" className="dropdown-item">
                        Mantenimiento
                      </a>
                    </li>
                    <li>
                      <a href="#" className="dropdown-item">
                        Pastoral
                      </a>
                    </li>
                    <li>
                      <a href="#" className="dropdown-item">
                        Administración
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  NOVEDADES
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
