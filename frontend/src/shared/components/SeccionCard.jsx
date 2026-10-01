import './SeccionCard.css';

// Contenedor blanco con encabezado (icono, título, subtítulo y acción opcional)
function SeccionCard({ icono: Icono, titulo, subtitulo, accion, className = '', children }) {
  return (
    <section className={`seccion-card ${className}`}>
      {titulo && (
        <header className="seccion-card__header">
          {Icono && <Icono className="seccion-card__icono" />}
          <div className="seccion-card__titulos">
            <h2>{titulo}</h2>
            {subtitulo && <p>{subtitulo}</p>}
          </div>
          {accion}
        </header>
      )}
      {children}
    </section>
  );
}

export default SeccionCard;
