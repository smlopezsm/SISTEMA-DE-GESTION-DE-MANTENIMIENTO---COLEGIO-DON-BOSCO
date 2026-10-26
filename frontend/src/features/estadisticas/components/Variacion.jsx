import { FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa6';


function Variacion({ valor, subeEsBueno }) {
  const sube = valor > 0;
  const neutra = valor === 0;
  const buena = neutra ? null : sube === subeEsBueno;
  const clase = neutra ? 'neutra' : buena ? 'buena' : 'mala';
  const Icono = neutra ? FaEquals : sube ? FaArrowUp : FaArrowDown;

  return (
    <span className={`variacion variacion--${clase}`}>
      <Icono aria-hidden="true" /> {Math.abs(valor)}%
    </span>
  );
}

export default Variacion;
