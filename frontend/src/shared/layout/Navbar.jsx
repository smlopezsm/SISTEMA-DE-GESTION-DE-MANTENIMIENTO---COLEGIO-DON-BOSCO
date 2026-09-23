import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="assets/colegio/logo1.png"
            alt="Don Bosco"
            className="header-logo"
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="mainNav"
        >
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <Link to="/quienes-somos" className="nav-link">
                QUIÉNES SOMOS
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/niveles-educativos" className="nav-link">
                NIVELES EDUCATIVOS
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/gestion"
                id="gestionDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                GESTIÓN
              </Link>
              <ul className="dropdown-menu" aria-labelledby="gestionDropdown">
                <li>
                  <Link to="/mantenimiento" className="dropdown-item">
                    Mantenimiento
                  </Link>
                </li>
                <li>
                  <Link to="/pastoral" className="dropdown-item">
                    Pastoral
                  </Link>
                </li>
                <li>
                  <Link to="/administracion" className="dropdown-item ">
                    Administracion
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/novedades" className="nav-link">
                NOVEDADES
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
