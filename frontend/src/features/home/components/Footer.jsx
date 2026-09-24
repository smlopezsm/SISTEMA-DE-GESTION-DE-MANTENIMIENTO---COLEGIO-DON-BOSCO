import "../styles/Footer.css";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="footer-left">
          <img
            src="assets/colegio/logo2blanco.png"
            alt="Logo Don Bosco"
            className="footer-logo"
          />

          <span className="footer-text">
            Don Bosco | Todos los derechos reservados
          </span>
        </div>

        <div className="footer-right">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaYoutube />
          </a>

          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaFacebook />
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <FaInstagram />
          </a>

          <span className="footer-contact">CONTACTO</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
