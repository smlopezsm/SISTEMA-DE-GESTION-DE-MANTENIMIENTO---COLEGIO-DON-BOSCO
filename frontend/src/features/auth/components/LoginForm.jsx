import { useState } from "react";

function LoginForm() {
  const [validado, setValidado] = useState(false);

  function manejarEnvio(evento) {
    const formulario = evento.currentTarget;
    if (!formulario.checkValidity()) {
      evento.preventDefault();
      evento.stopPropagation();
    }
    setValidado(true);
  }

  return (
    <form
      noValidate
      className={validado ? "was-validated" : ""}
      onSubmit={manejarEnvio}
    >
      <div className="mb-3">
        <input
          type="email"
          className="form-control-custom"
          placeholder="Correo electrónico"
          required
        />
        <div className="invalid-feedback">Ingresá un correo válido.</div>
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control-custom"
          placeholder="Contraseña"
          required
          minLength={6}
        />
        <div className="invalid-feedback">La contraseña debe tener al menos 6 caracteres.</div>
      </div>
      <div className="form-check mb-3 d-flex align-items-center">
        <input className="form-check-input" type="checkbox" id="rememberMe" />
        <label className="form-check-label" htmlFor="rememberMe">Recordarme</label>
      </div>
      <button type="submit" className="btn-primary-custom">Ingresar</button>
      <div className="mt-4 text-center">
        <a href="#" className="link-custom">¿Olvidaste tu contraseña?</a>
      </div>
    </form>
  );
}

export default LoginForm;