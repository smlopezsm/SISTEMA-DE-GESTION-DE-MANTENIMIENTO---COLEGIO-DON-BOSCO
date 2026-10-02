import './EncabezadoPagina.css';

function EncabezadoPagina({ icono: Icono, titulo, subtitulo, children }) {
  return (
    <div className="encabezado-pagina">
      <div className="encabezado-pagina__icono">
        <Icono />
      </div>
      <div className="encabezado-pagina__texto">
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>
      {children && <div className="encabezado-pagina__accion">{children}</div>}
    </div>
  );
}

export default EncabezadoPagina;
