import './Etiqueta.css';
//Muestra el estado de un requerimiento o tarea
const CLASE_POR_ESTADO = {
  // Estados del requerimiento
  pendiente: 'pendiente',
  'con-tarea': 'con-tarea',
  finalizado: 'finalizada',
  cancelado: 'cancelada',

  // Estados de la tarea
  'en-proceso': 'en-proceso',
  demorada: 'demorada',
  cancelada: 'cancelada',
  finalizada: 'finalizada',
  aprobada: 'aprobada',
  rechazada: 'rechazada',

  // Prioridades
  alta: 'alta',
  media: 'media',
  baja: 'baja',
};

function Etiqueta({ estado, children }) {
  const sufijo = CLASE_POR_ESTADO[estado] ?? 'default';
  return (
    <span className={`badge-estado badge-estado--${sufijo}`}>
      {children}
    </span>
  );
}

export default Etiqueta;