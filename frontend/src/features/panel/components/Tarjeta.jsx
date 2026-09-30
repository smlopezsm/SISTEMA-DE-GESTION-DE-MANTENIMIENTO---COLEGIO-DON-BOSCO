import '../styles/Tarjeta.css';

function Tarjeta({ titulo, valor, icono: Icono }) {
  return (
    <div className="card border-0 shadow-sm h-100 kpi-card">
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Icono size={28} className="kpi-card__icono" />
        </div>

        <div>
          <div className="fs-2 fw-bold lh-1 mb-1 kpi-card__valor">{valor}</div>
          <small className="kpi-card__titulo">{titulo}</small>
        </div>
      </div>
    </div>
  );
}

export default Tarjeta;