function Navbar() {
  return (
    <>
      <div className="top-line"></div>

      <header className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#">
              <img
                src="/assets/colegio/logo1.png"
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

            <div className="collapse navbar-collapse justify-content-end" id="mainNav">
              <ul className="navbar-nav align-items-lg-center">
                <li className="nav-item">
                  <a className="nav-link" href="#">QUIÉNES SOMOS</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">NIVELES EDUCATIVOS</a>
                </li>
                <li className="nav-item dropdown">

                  <a className="nav-link dropdown-toggle"
                    href="#"
                    id="gestionDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    GESTIÓN
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="gestionDropdown">
                    <li>
                      <a className="dropdown-item" href="/login">Mantenimiento</a>
                    </li>
                    <li><a className="dropdown-item" href="#">Pastoral</a></li>
                    <li><a className="dropdown-item" href="#">Administracion</a></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">NOVEDADES</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header >
    </>
  );
}

export default Navbar;