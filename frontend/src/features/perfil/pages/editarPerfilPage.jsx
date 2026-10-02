import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { FaCamera, FaFloppyDisk, FaCircleInfo } from 'react-icons/fa6';
import { actualizarUsuario } from '../services/perfilService';
import { camposDeRol, esEditable, ETIQUETA_CAMPO } from '../../../shared/config/camposPerfilPorRol';
import '../styles/EditarPerfilPage.css';

function iniciales(nombre, apellido) {
  const n = (nombre || '').trim()[0] ?? '';
  const a = (apellido || '').trim()[0] ?? '';
  return `${n}${a}`.toUpperCase() || '?';
}

function EditarPerfilPage() {
  const usuarioActual = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', apellido: '', telefono: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (usuarioActual) {
      setFormData({
        nombre: usuarioActual.nombre || '',
        apellido: usuarioActual.apellido || '',
        telefono: usuarioActual.telefono || '',
      });
      setAvatarPreview(usuarioActual.avatar || null);
    }
  }, [usuarioActual]);

  if (!usuarioActual) {
    return <p className="text-secondary">Cargando perfil…</p>;
  }

  const campos = camposDeRol(usuarioActual.rol);
  const puedeEditarTelefono = esEditable(usuarioActual.rol, 'telefono');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCambiarAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes.');
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      alert('La imagen no puede superar 1 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Redimensionar antes de guardar
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 200;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setAvatarPreview(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosAGuardar = {};
    if (esEditable(usuarioActual.rol, 'nombre')) datosAGuardar.nombre = formData.nombre.trim();
    if (esEditable(usuarioActual.rol, 'apellido')) datosAGuardar.apellido = formData.apellido.trim();
    if (puedeEditarTelefono) datosAGuardar.telefono = formData.telefono.trim();

    // 👇 Guardar avatar en la misma operación
    if (avatarPreview !== usuarioActual.avatar) {
      datosAGuardar.avatar = avatarPreview;
    }

    actualizarUsuario(datosAGuardar);
    window.location.href = '/gestor/perfil';
  };

  return (
    <div className="editar-perfil">
      <div className="editar-perfil__encabezado">
        <h1 className="editar-perfil__titulo">Editar perfil</h1>
        <p className="editar-perfil__subtitulo">
          Modificá tus datos personales. Los cambios se guardarán en el sistema.
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row g-4">
            {/* columna izquierda */}
            <div className="col-12 col-md-4 col-lg-3 text-center">
              <div className="editar-perfil__avatar">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" />
                ) : (
                  <span>{iniciales(usuarioActual.nombre, usuarioActual.apellido)}</span>
                )}
              </div>

              <label className="editar-perfil__btn-cambiar">
                <FaCamera size={14} />
                Cambiar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCambiarAvatar}
                  hidden
                />
              </label>
            </div>

            {/* columna derecha */}
            <div className="col-12 col-md-8 col-lg-9">
              <form onSubmit={handleSubmit}>
                {campos.map((campo) => {
                  const editable = esEditable(usuarioActual.rol, campo);
                  const valor = editable
                    ? formData[campo] ?? ''
                    : usuarioActual[campo] ?? '';

                  return (
                    <div key={campo} className="mb-3">
                      <label className="form-label editar-perfil__label">
                        {ETIQUETA_CAMPO[campo]}
                      </label>
                      <input
                        type={campo === 'email' ? 'email' : 'text'}
                        name={campo}
                        className="form-control editar-perfil__input"
                        value={valor}
                        onChange={editable ? handleChange : undefined}
                        disabled={!editable}
                        readOnly={!editable}
                        required={editable && campo !== 'telefono'}
                      />
                      {!editable && campo === 'usuario' && (
                        <small className="editar-perfil__hint">
                          El nombre de usuario no puede modificarse.
                        </small>
                      )}
                      {!editable && campo !== 'usuario' && (
                        <small className="editar-perfil__hint">
                          Este campo no puede modificarse.
                        </small>
                      )}
                    </div>
                  );
                })}

                <div className="d-flex justify-content-end gap-2 pt-3 mt-2 border-top">
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={() => navigate('/gestor/perfil')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary editar-perfil__btn-guardar">
                    <FaFloppyDisk size={13} /> Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="editar-perfil__nota mt-3">
        <FaCircleInfo />
        <span>Los cambios se guardan en tu sesión. Cuando exista la API, se sincronizarán con el servidor.</span>
      </div>
    </div>
  );
}

export default EditarPerfilPage;