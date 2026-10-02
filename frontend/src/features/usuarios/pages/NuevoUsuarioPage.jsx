import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FaUser, FaPlus, FaArrowLeft, FaCircleInfo } from 'react-icons/fa6';
import { crearUsuario, existeUsuario } from '../services/usuariosService';
import '../styles/NuevoUsuarioPage.css';

const ROLES = [ { valor: 'ordenanza', texto: 'Ordenanza' }, { valor: 'directivo', texto: 'Directivo' }, { valor: 'jefeMantenimiento', texto: 'Jefe de Mantenimiento' }, ];
const CARGOS_DIRECTIVO = [ 'Rector', 'Vicerrector', 'Secretaria', 'Director de Estudios', 'Administrador', ];
const FORM_INICIAL = { nombre: '', apellido: '', usuario: '', email: '', dni: '', rol: '', cargo: '', };

function NuevoUsuarioPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  const esDirectivo = formData.rol === 'directivo';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => {
      const nuevo = { ...f, [name]: value };
      //si cambia el rol y ya no es directivo, limpiamos el cargo
      if (name === 'rol' && value !== 'directivo') nuevo.cargo = '';
      return nuevo;
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
    if (!formData.usuario.trim() || formData.usuario.includes(' ')) {
      setError('El nombre de usuario es obligatorio y no puede tener espacios.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (!formData.dni.trim() || !/^\d+$/.test(formData.dni.replace(/\./g, ''))) {
      setError('El DNI debe contener solo números.');
      return;
    }
    if (!formData.rol) {
      setError('Tenés que seleccionar un rol.');
      return;
    }
    if (esDirectivo && !formData.cargo) {
      setError('El cargo es obligatorio para un Directivo.');
      return;
    }
    if (existeUsuario(formData.usuario, formData.email)) {
      setError('Ya existe un usuario con ese nombre de usuario o correo.');
      return;
    }

    setCreando(true);

    try {
      const datos = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        usuario: formData.usuario.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        dni: formData.dni.replace(/\./g, ''),
        rol: formData.rol,
      };
      if (esDirectivo) datos.cargo = formData.cargo;

      crearUsuario(datos);
      navigate('/gestor/usuarios', { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.');
    } finally {
      setCreando(false);
    }
  };

  return (
    <div className="nuevo-usuario">
      {/* encabezado─ */}
      <div className="mb-4">
        <Link to="/gestor/usuarios" className="nuevo-usuario__volver">
          <FaArrowLeft size={14} /> Volver al listado
        </Link>
        <h1 className="nuevo-usuario__titulo">Agregar nueva cuenta</h1>
        <p className="nuevo-usuario__subtitulo">
          Completá los datos para crear una nueva cuenta de usuario en el sistema.
        </p>
      </div>

      {/* error */}
      {error && (
        <div className="alert alert-danger mb-3" role="alert">
          {error}
        </div>
      )}

      {/* card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h3 className="nuevo-usuario__seccion-titulo">
            <FaUser /> Datos de la cuenta
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* nombre */}
              <div className="col-12 col-md-6">
                <label className="form-label nuevo-usuario__label">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control nuevo-usuario__input"
                  placeholder="Ej: María"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>

              {/* apellido */}
              <div className="col-12 col-md-6">
                <label className="form-label nuevo-usuario__label">
                  Apellido <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control nuevo-usuario__input"
                  placeholder="Ej: López"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>

              {/* nombre de usuario */}
              <div className="col-12 col-md-6">
                <label className="form-label nuevo-usuario__label">
                  Nombre de usuario <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="usuario"
                  className="form-control nuevo-usuario__input"
                  placeholder="Ej: mlopez"
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </div>

              {/* email */}
              <div className="col-12 col-md-6">
                <label className="form-label nuevo-usuario__label">
                  Correo electrónico <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control nuevo-usuario__input"
                  placeholder="Ej: maria.lopez@colegiodonbosco.edu.ar"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* DNI */}
              <div className="col-12 col-md-6">
                <label className="form-label nuevo-usuario__label">
                  DNI <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  className="form-control nuevo-usuario__input"
                  placeholder="Ej: 32.987.456"
                  value={formData.dni}
                  onChange={handleChange}
                />
              </div>

              {/* rol */}
              <div className="col-12 col-md-6">
                <label className="form-label nuevo-usuario__label">
                  Rol <span className="text-danger">*</span>
                </label>
                <select
                  name="rol"
                  className="form-select nuevo-usuario__input"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="">Seleccionar rol</option>
                  {ROLES.map((r) => (
                    <option key={r.valor} value={r.valor}>{r.texto}</option>
                  ))}
                </select>
              </div>

              {/* cargo (solo si es Directivo) */}
              {esDirectivo && (
                <div className="col-12 col-md-6">
                  <label className="form-label nuevo-usuario__label">
                    Cargo <span className="text-danger">*</span>
                  </label>
                  <select
                    name="cargo"
                    className="form-select nuevo-usuario__input"
                    value={formData.cargo}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar cargo</option>
                    {CARGOS_DIRECTIVO.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* nota */}
            <div className="nuevo-usuario__nota mt-4">
              <FaCircleInfo />
              <span>
                El usuario recibira un correo con sus datos de acceso al sistema
              </span>
            </div>

            {/* botones */}
            <div className="d-flex justify-content-end gap-2 pt-4 mt-2 border-top">
              <button
                type="button"
                className="btn btn-outline-primary nuevo-usuario__btn-cancelar"
                onClick={() => navigate('/gestor/usuarios')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary nuevo-usuario__btn-crear"
                disabled={creando}
              >
                <FaPlus size={13} /> {creando ? 'Creando…' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NuevoUsuarioPage;