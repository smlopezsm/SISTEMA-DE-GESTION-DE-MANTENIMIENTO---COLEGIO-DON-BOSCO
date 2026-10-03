import { Link } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa6';
import './EncabezadoPagina.css';

function Encabezado({
  icono: Icono,
  titulo,
  subtitulo,
  volver,      // { to, texto }
  badge,       // ReactNode
  tono = 'primario',
  children,    // acción a la derecha
}) {
  return (
    <div className="encabezado">
      {volver && (
        <Link to={volver.to} className="encabezado__volver">
          <FaArrowLeft size={14} />
          {volver.texto ?? 'Volver'}
        </Link>
      )}

      <div className="encabezado__fila">
        <div className="encabezado__izq">
          {Icono && (
            <div className={`encabezado__icono encabezado__icono--${tono}`}>
              <Icono size={22} />
            </div>
          )}
          <div className="encabezado__textos">
            <h1 className="encabezado__titulo">{titulo}</h1>
            {subtitulo && <p className="encabezado__subtitulo">{subtitulo}</p>}
          </div>
        </div>

        {(badge || children) && (
          <div className="encabezado__der">
            {badge}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default Encabezado;