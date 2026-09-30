import { useEffect } from 'react';
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaXmark, } from 'react-icons/fa6';
import './Toast.css';

const ICONOS = { success: FaCircleCheck, error: FaCircleExclamation, info: FaCircleInfo, };

function Toast({ abierto, tipo = 'success', mensaje, onCerrar, duracion = 3500 }) {
  useEffect(() => {
    if (!abierto) return;
    const timer = setTimeout(onCerrar, duracion);
    return () => clearTimeout(timer);
  }, [abierto, duracion, onCerrar]);

  if (!abierto) return null;

  const Icono = ICONOS[tipo] ?? ICONOS.info;

  return (
    <div className={`toast-custom toast-custom--${tipo}`} role="alert">
      <Icono size={20} className="toast-custom__icono" />
      <span className="toast-custom__mensaje">{mensaje}</span>
      <button type="button" className="toast-custom__cerrar" onClick={onCerrar} aria-label="Cerrar" >
        <FaXmark size={14} />
      </button>
    </div>
  );
}

export default Toast;