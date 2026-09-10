function Footer() {
  return (
    <footer className="footer d-flex align-items-center">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="footer-left d-flex align-items-center">
          <img
            src="assets/colegio/logo2blanco.png"
            alt="Logo Don Bosco"
            style="height:60px;"
          />
          <span className="ms-3 text-white">
            Don Bosco | Todos los derechos reservados
          </span>
        </div>

        <div className="footer-right d-flex align-items-center">
          <a
            href="https://www.youtube.com"
            target="_blank"
            className="social-icon me-3"
          >
            <img src="assets/logos/youtube.png" alt="YouTube" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            className="social-icon me-3"
          >
            <img src="assets/logos/facebook.png" alt="Facebook" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            className="social-icon me-3"
          >
            <img src="assets/logos/intagram.png" alt="Instagram" />
          </a>
          <span className="text-white fw-bold ms-2">CONTACTO</span>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
