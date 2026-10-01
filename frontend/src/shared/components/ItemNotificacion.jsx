import { Link } from 'react-router';
import {
  FaClipboardList,
  FaCircleCheck,
  FaCircleXmark,
} from 'react-icons/fa6';
import './ItemNotificacion.css';

// Config visual por tipo de notificación (5 tipos en total)
const CONFIG_POR_TIPO = {
  // Jefe de Mantenimiento
  requerimiento: { icono: FaClipboardList, color: 'azul', etiqueta: 'Requerimiento', },
  'tarea-aprobada': { icono: FaCircleCheck, color: 'verde', etiqueta: 'Tarea aprobada', },
  'tarea-rechazada': { icono: FaCircleXmark, color: 'rojo', etiqueta: 'Tarea rechazada', },
  // Directivo
  'tarea-finalizada': { icono: FaCircleCheck, color: 'verde', etiqueta: 'Tarea finalizada', },
  'tarea-cancelada': { icono: FaCircleXmark, color: 'rojo', etiqueta: 'Tarea cancelada', },
};

function ItemNotificacion({ notificacion, to }) {
  const config =
    CONFIG_POR_TIPO[notificacion.tipo] ?? CONFIG_POR_TIPO.requerimiento;
  const Icono = config.icono;

  const contenido = (
    <div
      className={`item-notificacion ${
        !notificacion.leida ? 'item-notificacion--no-leida' : ''
      }`}
    >
      {/* punto azul si no está leída */}
      {!notificacion.leida && <span className="item-notificacion__punto" />}

      {/* icono según tipo */}
      <div
        className={`item-notificacion__icono item-notificacion__icono--${config.color}`}
      >
        <Icono size={18} />
      </div>

      {/* contenido */}
      <div className="item-notificacion__contenido">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div>
            <div className="item-notificacion__titulo">
              {notificacion.titulo}
            </div>
            <p className="item-notificacion__texto mb-0">
              {notificacion.texto}
            </p>
            <small className="item-notificacion__fecha">
              {notificacion.fecha}, {notificacion.hora}
            </small>
          </div>
        </div>
      </div>
    </div>
  );

  // Si recibe `to`, envuelve en Link
  if (to) {
    return (
      <Link to={to} className="text-decoration-none text-reset d-block">
        {contenido}
      </Link>
    );
  }

  return contenido;
}

export default ItemNotificacion;