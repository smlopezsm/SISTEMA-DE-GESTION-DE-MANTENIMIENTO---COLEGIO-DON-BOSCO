import { useState } from "react";
import { useNavigate } from "react-router";
import { iniciarSesion } from "../services/authService";

function LoginForm() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const hayErrorCredenciales = Boolean(error);

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setError("");

    if (!usuario.trim() || !password) {
      setError("Completá usuario y contraseña.");
      return;
    }

    setCargando(true);

    try {
      await iniciarSesion(usuario.trim(), password);
      navigate("/gestor", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form noValidate onSubmit={manejarEnvio}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className={`form-control form-control-custom ${
            hayErrorCredenciales ? "is-invalid" : ""
          }`}
          placeholder="Usuario o correo electrónico"
          aria-label="Usuario o correo electrónico"
          autoComplete="username"
          value={usuario}
          onChange={(e) => {
            setUsuario(e.target.value);
            if (error) setError("");
          }}
        />
        <div className="invalid-feedback">
          Ingresá tu usuario o correo.
        </div>
      </div>

      <div className="mb-3">
        <input
          type="password"
          className={`form-control form-control-custom ${
            hayErrorCredenciales ? "is-invalid" : ""
          }`}
          placeholder="Contraseña"
          aria-label="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
        />
        <div className="invalid-feedback">
          Ingresá tu contraseña.
        </div>
      </div>

      <button
        type="submit"
        className="btn w-100 boton-ingresar"
        disabled={cargando}
      >
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}

export default LoginForm;