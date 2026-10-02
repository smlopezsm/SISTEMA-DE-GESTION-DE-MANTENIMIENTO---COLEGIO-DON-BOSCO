import { useNavigate } from "react-router";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__code">404</h1>

        <div className="not-found__line"></div>

        <h2 className="not-found__title">Página no encontrada</h2>

        <p className="not-found__text">
          La página que estás buscando no existe o fue movida.
        </p>

        <button className="not-found__button" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </div>
  );
}

export default NotFound;
