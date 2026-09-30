import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import './Paginacion.css';

function Paginacion({ pagina, totalPaginas, onCambiar }) {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav className="paginacion" aria-label="Paginación">
      <button
        type="button"
        className="paginacion__btn"
        disabled={pagina <= 1}
        onClick={() => onCambiar(pagina - 1)}
        aria-label="Página anterior"
      >
        <FaChevronLeft />
      </button>
      {paginas.map((n) => (
        <button
          key={n}
          type="button"
          className={`paginacion__btn ${n === pagina ? 'paginacion__btn--activa' : ''}`}
          onClick={() => onCambiar(n)}
          aria-current={n === pagina ? 'page' : undefined}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className="paginacion__btn"
        disabled={pagina >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
        aria-label="Página siguiente"
      >
        <FaChevronRight />
      </button>
    </nav>
  );
}

export default Paginacion;
