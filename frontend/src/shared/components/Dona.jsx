import { colorDeEstado } from "../utils/colores";
import "./Dona.css";

function Dona({ datos, total, tamano = 180, etiqueta = "Total", totalTexto }) {
  let acumulado = 0;
  const segmentos = datos.map((d) => {
    const inicio = (acumulado / total) * 100;
    acumulado += d.valor;
    const fin = (acumulado / total) * 100;
    const color = d.color ?? colorDeEstado(d.clave);
    return `${color} ${inicio}% ${fin}%`;
  });

  const fondo = `conic-gradient(${segmentos.join(", ")})`;

  return (
    <div
      className="dona position-relative rounded-circle mx-auto"
      style={{ background: fondo, width: tamano, height: tamano }}
    >
      <div
        className="dona__centro position-absolute top-50 start-50 translate-middle rounded-circle d-flex flex-column align-items-center justify-content-center"
        style={{ width: tamano * 0.6, height: tamano * 0.6 }}
      >
        <small className="dona__etiqueta">{etiqueta}</small>
        <strong className="fs-4">{totalTexto ?? total}</strong>
      </div>
    </div>
  );
}

export default Dona;
