import './Etiqueta.css';


const CLASE_POR_ESTADO = {
  pendiente: 'pendiente',
  'en-proceso': 'en-proceso',
  demorada: 'demorada',
  cancelada: 'cancelada',
  finalizada: 'finalizada',
  aprobada: 'aprobada',
  rechazada: 'rechazada',

  alta: 'alta',
  media: 'media',
  baja: 'baja',
};

const TEXTO_POR_ESTADO = {
  pendiente: 'Pendiente',
  'en-proceso': 'En proceso',
  demorada: 'Demorada',
  cancelada: 'Cancelada',
  finalizada: 'Finalizada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',

  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

function Etiqueta({ estado, children }) {
  const sufijo = CLASE_POR_ESTADO[estado] ?? 'default';
  const texto = children ?? TEXTO_POR_ESTADO[estado] ?? estado;

  return (
    <span className={`badge-estado badge-estado--${sufijo}`}>
      {texto}
    </span>
  );
}

export default Etiqueta;