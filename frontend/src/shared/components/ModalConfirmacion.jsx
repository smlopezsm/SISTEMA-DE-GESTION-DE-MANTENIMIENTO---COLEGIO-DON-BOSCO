// src/shared/components/ModalConfirmacion.jsx
import { FaTriangleExclamation, FaCircleInfo, FaCircleCheck } from 'react-icons/fa6';
import './ModalConfirmacion.css';

const ICONOS = {
  danger: FaTriangleExclamation,
  info: FaCircleInfo,
  success: FaCircleCheck,
};

function ModalConfirmacion({
  abierto,
  titulo = 'Confirmar acción',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'danger',
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null;

  const Icono = ICONOS[variante] ?? ICONOS.info;

  return (
    <div className="modal-confirmacion-overlay" onClick={onCancelar}>
      <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
        <div className="modal-confirmacion__body">
          <div className={`modal-confirmacion__icono modal-confirmacion__icono--${variante}`}>
            <Icono size={24} />
          </div>
          <h5 className="modal-confirmacion__titulo">{titulo}</h5>
          <p className="modal-confirmacion__mensaje">{mensaje}</p>
        </div>

        <div className="modal-confirmacion__footer">
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className={`btn btn-${variante}`} onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacion;