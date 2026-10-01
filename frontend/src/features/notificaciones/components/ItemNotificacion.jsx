import { FaClipboardList, FaCircleCheck, FaCircleXmark, } from 'react-icons/fa6';
import '../styles/ItemNotificacion.css';

const CONFIG_POR_TIPO = {
  requerimiento: {
    icono: FaClipboardList,
    color: 'azul',
    etiqueta: 'Requerimiento',
  },
  aprobacion: {
    icono: FaCircleCheck,
    color: 'verde',
    etiqueta: 'Aprobación',
  },
  rechazo: {
    icono: FaCircleXmark,
    color: 'rojo',
    etiqueta: 'Rechazo',
  },
};

function ItemNotificacion({ notificacion }) {
  const config = CONFIG_POR_TIPO[notificacion.tipo] ?? CONFIG_POR_TIPO.requerimiento;
  const Icono = config.icono;

  return (
    <div className={`item-notificacion ${!notificacion.leida ? 'item-notificacion--no-leida' : ''}`}>
      {/* punto */}
      {!notificacion.leida && <span className="item-notificacion__punto" />}

      {/* icono */}
      <div className={`item-notificacion__icono item-notificacion__icono--${config.color}`}>
        <Icono size={18} />
      </div>

      {/* contenido */}
      <div className="item-notificacion__contenido">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div>
            <div className="item-notificacion__titulo">{notificacion.titulo}</div>
            <p className="item-notificacion__texto mb-0">{notificacion.texto}</p>
            <small className="item-notificacion__fecha">
              {notificacion.fecha}, {notificacion.hora}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemNotificacion;