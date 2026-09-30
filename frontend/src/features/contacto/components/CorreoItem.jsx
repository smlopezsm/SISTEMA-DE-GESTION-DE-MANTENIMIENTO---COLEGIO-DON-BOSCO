import { FaEnvelope } from "react-icons/fa";

function CorreoItem({ area, email }) {
  return (
    <div className="correo-item">
      <span className="correo-icono">
        <FaEnvelope />
      </span>
      <div className="correo-texto">
        <strong>{area}:</strong>
        <a href={`mailto:${email}`}>{email}</a>
      </div>
    </div>
  );
}

export default CorreoItem;