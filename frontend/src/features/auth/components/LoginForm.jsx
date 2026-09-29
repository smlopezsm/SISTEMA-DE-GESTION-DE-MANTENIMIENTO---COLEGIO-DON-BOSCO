import { useState } from "react";
import { useNavigate } from "react-router";
import { iniciarSesion } from "../services/authService";

function LoginForm() {

  // useNavigate() devuelve una funcion para navegar
  const navigate = useNavigate();

  //campos controlados
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  //estados para validacion y error
  const [validado, setValidado] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  //funcion para manejar el envio del formulario
  async function manejarEnvio(evento) {

    //evitar recargar la pagina
    evento.preventDefault();

    setError("");
    setValidado(true);

    //si el formulario no es valido, no hacer nada
    if (!evento.currentTarget.checkValidity()) return;

    setCargando(true);

    //llamar al servicio de inicio de sesion
    try {
      
      await iniciarSesion(usuario.trim(), password);
      navigate("/gestor", { replace: true });
    
    } catch (e) {
      //si hay un error, mostrarlo
      setError(e.message);
    } finally {
      
      setCargando(false);
    
    }
  }

  return (
    //formulario de login
    <form noValidate className={validado ? "was-validated" : ""} onSubmit={manejarEnvio}>
      {/* mostrar mensaje de error si existe */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control form-control-custom"
          placeholder="Usuario o correo electrónico"
          aria-label="Usuario o correo electrónico"
          autoComplete="username"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <div className="invalid-feedback">Ingresá tu usuario o correo.</div>
      </div>

      <div className="mb-3">
        <input
          type="password"
          className="form-control form-control-custom"
          placeholder="Contraseña"
          aria-label="Contraseña"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="invalid-feedback">Ingresá tu contraseña.</div>
      </div>

      {/* boton de envio */}
      <button type="submit" className="btn w-100 boton-ingresar" disabled={cargando}>
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>

      <div className="mt-4 text-center">
        {/* implementar para recuperar contraseña */}
        <a href="#" className="link-custom">¿Olvidaste tu contraseña?</a>
      </div>
    </form>
  );
}

export default LoginForm;