import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { iniciarSesion, registrarUsuario } from '../services/authService';

const VALORES_INICIALES = {
  nombre: '',
  apellido: '',
  usuario: '',
  dni: '',
  email: '',
  telefono: '',
  password: '',
  confirmar: '',
};

function RegistroForm() {
  const navigate = useNavigate();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }

  function validar() {
    if (!valores.nombre.trim() || !valores.apellido.trim()) {
      return 'Nombre y apellido son obligatorios.';
    }

    if (!valores.usuario.trim() || valores.usuario.includes(' ')) {
      return 'El nombre de usuario es obligatorio y no puede tener espacios.';
    }

    if (!valores.email.trim() || !valores.email.includes('@')) {
      return 'Ingresá un correo electrónico válido.';
    }

    if (!valores.telefono.trim()) {
      return 'El teléfono es obligatorio.';
    }

    if (valores.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (valores.password !== valores.confirmar) {
      return 'Las contraseñas no coinciden.';
    }

    return null;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    const mensajeValidacion = validar();
    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    setCargando(true);

    try {
      await registrarUsuario({
        nombre: valores.nombre.trim(),
        apellido: valores.apellido.trim(),
        nombreUsuario: valores.usuario.trim().toLowerCase(),
        dni: valores.dni.trim() || null,
        email: valores.email.trim().toLowerCase(),
        telefono: valores.telefono.trim(),
        password: valores.password,
      });

      await iniciarSesion(valores.usuario.trim().toLowerCase(), valores.password);
      navigate('/gestor', { replace: true });
    } catch (e) {
      setError(e.message || 'No se pudo crear la cuenta.');
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

      <div className="row g-3 text-start">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-nombre">
            Nombre
          </label>
          <input
            id="registro-nombre"
            type="text"
            name="nombre"
            className="form-control form-control-custom"
            placeholder="Ej: Ana"
            autoComplete="given-name"
            value={valores.nombre}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-apellido">
            Apellido
          </label>
          <input
            id="registro-apellido"
            type="text"
            name="apellido"
            className="form-control form-control-custom"
            placeholder="Ej: Torres"
            autoComplete="family-name"
            value={valores.apellido}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-usuario">
            Nombre de usuario
          </label>
          <input
            id="registro-usuario"
            type="text"
            name="usuario"
            className="form-control form-control-custom"
            placeholder="Ej: atorres"
            autoComplete="username"
            value={valores.usuario}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-dni">
            DNI (opcional)
          </label>
          <input
            id="registro-dni"
            type="text"
            name="dni"
            className="form-control form-control-custom"
            placeholder="Ej: 30123456"
            value={valores.dni}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-email">
            Correo electrónico
          </label>
          <input
            id="registro-email"
            type="email"
            name="email"
            className="form-control form-control-custom"
            placeholder="Ej: atorres@donbosco.org.ar"
            autoComplete="email"
            value={valores.email}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-telefono">
            Teléfono
          </label>
          <input
            id="registro-telefono"
            type="tel"
            name="telefono"
            className="form-control form-control-custom"
            placeholder="Ej: 266 4551234"
            autoComplete="tel"
            value={valores.telefono}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-password">
            Contraseña
          </label>
          <input
            id="registro-password"
            type="password"
            name="password"
            className="form-control form-control-custom"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            value={valores.password}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="registro-confirmar">
            Repetir contraseña
          </label>
          <input
            id="registro-confirmar"
            type="password"
            name="confirmar"
            className="form-control form-control-custom"
            placeholder="Repetí la contraseña"
            autoComplete="new-password"
            value={valores.confirmar}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn w-100 boton-ingresar mt-4"
        disabled={cargando}
      >
        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="mt-3 mb-0">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="link-custom">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}

export default RegistroForm;
