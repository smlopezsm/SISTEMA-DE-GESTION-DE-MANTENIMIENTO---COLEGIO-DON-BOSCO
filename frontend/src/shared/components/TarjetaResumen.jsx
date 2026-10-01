import './TarjetaResumen.css';

// Tarjeta de indicador. "tono" usa las claves de estado de variables.css:
// pendiente | en-proceso | con-tarea | demorada | finalizada | aprobada | rechazada | cancelada
function TarjetaResumen({ icono: Icono, etiqueta, valor, tono = 'en-proceso', children }) {
  return (
    <div className={`tarjeta-resumen tarjeta-resumen--${tono}`}>
      <div className="tarjeta-resumen__fila">
        <span className="tarjeta-resumen__icono">
          <Icono />
        </span>
        <span className="tarjeta-resumen__etiqueta">{etiqueta}</span>
      </div>
      <strong className="tarjeta-resumen__valor">{valor}</strong>
      {children}
    </div>
  );
}

export default TarjetaResumen;
