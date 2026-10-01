import { Link } from "react-router";
import { FaBell } from "react-icons/fa6";
import SeccionCard from "../../../shared/components/SeccionCard";

// tipo de notificación -> clave de estado (para el color del punto)
const TONO_POR_TIPO = {
  "nuevo-requerimiento": "pendiente",
  "tarea-finalizada": "finalizada",
  "tarea-rechazada": "rechazada",
};

function NotificacionesDirectivo({ notificaciones, maximo = 4 }) {
  const recientes = [...notificaciones]
    .sort((a, b) => b.hora.localeCompare(a.hora))
    .slice(0, maximo);

  return (
    <SeccionCard
      icono={FaBell}
      titulo="Notificaciones"
      accion={
        <Link to="/gestor/notificaciones" className="small">
          Ver todas
        </Link>
      }
    >
      <ul className="lista-notificaciones">
        {recientes.map((n) => (
          <li
            key={n.id}
            className={`notificacion ${n.leida ? "" : "notificacion--nueva"}`}
          >
            <span
              className="notificacion__punto"
              style={{
                background: `var(--estado-${TONO_POR_TIPO[n.tipo] ?? "cancelada"}-solid)`,
              }}
              aria-hidden="true"
            />
            <div>
              <strong>{n.titulo}</strong>
              <p>{n.texto}</p>
              <small>{n.hora}</small>
            </div>
          </li>
        ))}
      </ul>
    </SeccionCard>
  );
}

export default NotificacionesDirectivo;
