import { Link } from 'react-router';
import { FaArrowRight } from 'react-icons/fa6';
import '../styles/Tarjeta.css';

function Tarjeta({ titulo, valor, icono: Icono, destino }) {
  const contenido = (
    <div className="card border-0 shadow-sm h-100 kpi-card">
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Icono size={28} className="kpi-card__icono" />
          <FaArrowRight className="text-muted small" />
        </div>
        <div>
          <div className="fs-2 fw-bold lh-1 mb-1 kpi-card__valor">{valor}</div>
          <small className="text-muted">{titulo}</small>
        </div>
      </div>
    </div>
  );

  return destino ? (
    <Link to={destino} className="text-decoration-none text-reset">
      {contenido}
    </Link>
  ) : (
    contenido
  );
}

export default Tarjeta;