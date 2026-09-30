import { FaCalendarDays, FaClock, FaLocationDot, } from 'react-icons/fa6';
import '../styles/InfoPrincipalRequerimiento.css';

//divide la fecha de la hora
function separarFechaHora(fechaHora) {
  if (!fechaHora) return { fecha: '', hora: '' };
  const [fecha, hora] = fechaHora.split(' ');
  return {
    fecha: fecha ?? '',
    hora: hora ? `${hora} hs` : '',
  };
}

function InfoPrincipalRequerimiento({ requerimiento }) {
  const { fecha, hora } = separarFechaHora(requerimiento.fechaHora);
  const tieneImagen = Boolean(requerimiento.imagen);

  return (
    <div className="card border-0 shadow-sm mb-4 info-principal-requerimiento">
      <div className="card-body">
        <div className="row g-4">
          {/* colunma izquierda*/}
          <div className={tieneImagen ? 'col-12 col-lg-7' : 'col-12'}>
            {/* Titulo */}
            <h4 className="info-principal-requerimiento__titulo mb-3">
              {requerimiento.titulo}
            </h4>

            {/* descripcion */}
            <div className="mb-4">
              <small className="text-muted d-block mb-1 text-uppercase fw-medium">
                Descripción
              </small>
              <p className="info-principal-requerimiento__descripcion mb-0">
                {requerimiento.descripcion}
              </p>
            </div>

            <div className="row g-3 info-principal-requerimiento__meta-row">
              {/* fecha */}
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="info-principal-requerimiento__meta">
                  <span className="info-principal-requerimiento__meta-icono">
                    <FaCalendarDays size={16} />
                  </span>
                  <div>
                    <small className="text-muted d-block">Fecha de emisión</small>
                    <span className="fw-medium">{fecha}</span>
                  </div>
                </div>
              </div>

              {/* hora */}
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="info-principal-requerimiento__meta">
                  <span className="info-principal-requerimiento__meta-icono">
                    <FaClock size={16} />
                  </span>
                  <div>
                    <small className="text-muted d-block">Hora de emisión</small>
                    <span className="fw-medium">{hora}</span>
                  </div>
                </div>
              </div>

              {/* seltor */}
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="info-principal-requerimiento__meta">
                  <span className="info-principal-requerimiento__meta-icono">
                    <FaLocationDot size={16} />
                  </span>
                  <div>
                    <small className="text-muted d-block">Sector</small>
                    <span className="fw-medium">{requerimiento.lugar}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* columna derecha, donde va la imagen */}
          {tieneImagen && (
            <div className="col-12 col-lg-5">
              <div className="info-principal-requerimiento__imagen-contenedor">
                <img src={requerimiento.imagen} alt={`Imagen del requerimiento ${requerimiento.id}`} className="info-principal-requerimiento__imagen" />
                <a
                  href={requerimiento.imagen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-principal-requerimiento__imagen-boton"
                >
                  Ver imagen en tamaño completo
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InfoPrincipalRequerimiento;