import "./Footer.css";
import { Link } from "react-router";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaPhoneAlt,
  FaFacebookMessenger,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="container">
          <div className="row footer-info align-items-center">

            {/*columna izquierda*/}
            <div className="col-md-6 footer-medios">
              <h3 className="footer-info-title">Otros medios</h3>

              <div className="footer-medios-grupo">
                <span className="footer-medios-subtitulo">Para llamar</span>
                <a href="tel:+542664174663" className="footer-medio-item">
                  <span className="footer-medio-icono">
                    <FaPhoneAlt />
                  </span>
                  <span className="footer-medio-texto">
                    <strong>Celular Portería</strong>
                    <small>2664 174663 (solo llamadas)</small>
                  </span>
                </a>
                <a href="tel:+542664424592" className="footer-medio-item">
                  <span className="footer-medio-icono">
                    <FaPhoneAlt />
                  </span>
                  <span className="footer-medio-texto">
                    <strong>Teléfono fijo</strong>
                    <small>266 4424592</small>
                  </span>
                </a>
              </div>

              <div className="footer-medios-grupo">
                <span className="footer-medios-subtitulo">Para escribir</span>
                <a
                  href="https://www.instagram.com/donboscosanluis/?hl=es-la"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-medio-item"
                >
                  <span className="footer-medio-icono">
                    <FaInstagram />
                  </span>
                  <span className="footer-medio-texto">
                    <strong>Instagram</strong>
                    <small>Mensaje directo</small>
                  </span>
                </a>
                <a
                  href="https://www.facebook.com/donboscosanluis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-medio-item"
                >
                  <span className="footer-medio-icono">
                    <FaFacebookMessenger />
                  </span>
                  <span className="footer-medio-texto">
                    <strong>Facebook</strong>
                    <small>Mensaje directo</small>
                  </span>
                </a>
              </div>
            </div>

            {/*columna derecha*/}
            <div className="col-md-6 footer-ubicacion">
              <h3 className="footer-info-title">Ubicación:</h3>
              <div className="footer-map-wrapper">
                <iframe
                  title="Ubicación Colegio Don Bosco"
                  src="https://www.google.com/maps?q=Colegio+Don+Bosco+Tomás+Jofre+1350+San+Luis&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/*linea divisoria*/}
        <div className="bottom-line1 bg-white"></div>

        {/*franja de abajo*/}
        <div className="container d-flex justify-content-between align-items-center footer-top">
          <div className="footer-left">
            <img
              src="/assets/colegio/logo2blanco.png"
              alt="Logo Don Bosco"
              className="footer-logo"
            />
            <span className="footer-text">
              Don Bosco | Todos los derechos reservados
            </span>
          </div>

          <div className="footer-right">
            <a href="https://www.youtube.com/@ColegioDonBoscoSL" target="_blank" rel="noopener noreferrer" className="social-icon rounded-circle border border-white d-flex align-items-center justify-content-center">
              <FaYoutube />
            </a>
            <a href="https://www.facebook.com/donboscosanluis/?locale=es_LA" target="_blank" rel="noopener noreferrer" className="social-icon rounded-circle border border-white d-flex align-items-center justify-content-center">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/donboscosanluis/?hl=es" target="_blank" rel="noopener noreferrer" className="social-icon rounded-circle border border-white d-flex align-items-center justify-content-center">
              <FaInstagram />
            </a>
            <Link to="/contacto" className="footer-contact">CONTACTO</Link>
          </div>
        </div>
      </div>
      <div className="bottom-line bg-white"></div>
    </footer >
  );
}

export default Footer;