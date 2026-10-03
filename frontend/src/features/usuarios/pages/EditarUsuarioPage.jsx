import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { FaUser,FaPen, FaArrowLeft, FaFloppyDisk, FaCircleInfo, FaUserCheck, FaUserXmark, } from 'react-icons/fa6';
import { ETIQUETA_ROL } from '../../../shared/config/MenuPorRol';
import EncabezadoPagina from '../../../shared/components/EncabezadoPagina';
import { obtenerUsuarioPorClave, actualizarUsuario, cambiarEstadoUsuario, } from '../services/usuariosService';
import '../styles/EditarUsuarioPage.css';

const ROLES = [{ valor: 'directivo', texto: 'Directivo' }, { valor: 'jefeMantenimiento', texto: 'Jefe de Mantenimiento' }, { valor: 'ordenanza', texto: 'Ordenanza' },];
const CARGOS_DIRECTIVO = ['Rector', 'Vicerrector', 'Secretaria', 'Director de Estudios', 'Administrador',];

function iniciales(nombre, apellido) {
    const n = (nombre || '').trim()[0] ?? '';
    const a = (apellido || '').trim()[0] ?? '';
    return `${n}${a}`.toUpperCase() || '?';
}

function EditarUsuarioPage() {
    const { clave } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({ usuario: '', email: '', telefono: '', cargo: '', });
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState(null);

    // cargar el usuario
    useEffect(() => {
        const u = obtenerUsuarioPorClave(clave);
        if (!u) return;
        setUsuario(u);
        setFormData({
            usuario: u.usuario || '',
            email: u.email || '',
            telefono: u.telefono || '',
            cargo: u.cargo || '',
        });
    }, [clave]);

    if (!usuario) {
        return (
            <div className="container-fluid py-5 text-center">
                <p className="text-muted mb-3">No se encontro el usuario solicitado.</p>
                <Link to="/gestor/usuarios" className="btn btn-primary">
                    Volver al listado
                </Link>
            </div>
        );
    }

    const esDirectivo = usuario.rol === 'directivo';
    const esOrdenanza = usuario.rol === 'ordenanza';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (mensaje) setMensaje(null);
    };

    const handleGuardar = (e) => {
        e.preventDefault(); setGuardando(true);
        // guardamos los campos editables segun el rol
        const datos = {
            usuario: formData.usuario.trim(),
            email: formData.email.trim(),
        };
        if (esOrdenanza) datos.telefono = formData.telefono.trim();
        if (esDirectivo) datos.cargo = formData.cargo;

        try {
            actualizarUsuario(usuario.clave, datos);
            setMensaje({ tipo: 'success', texto: 'Los cambios se guardaron correctamente.' });
            setTimeout(() => navigate('/gestor/usuarios'), 900);
        } catch (err) {
            setMensaje({ tipo: 'danger', texto: err.message });
        } finally {
            setGuardando(false);
        }
    };

    const handleCambiarEstado = () => {
        const nuevoEstado = !usuario.activo;
        const accion = nuevoEstado ? 'dar de alta' : 'dar de baja';
        if (!window.confirm(`¿Estás seguro de ${accion} a ${usuario.nombre} ${usuario.apellido}?`)) return;

        cambiarEstadoUsuario(usuario.clave, nuevoEstado);
        setUsuario({ ...usuario, activo: nuevoEstado });
        setMensaje({
            tipo: 'success',
            texto: nuevoEstado ? 'El usuario fue dado de alta.' : 'El usuario fue dado de baja.',
        });
    };

    return (
        <div className="editar-usuario">
            <EncabezadoPagina
                volver={{ to: '/gestor/usuarios', texto: 'Volver al listado' }}
                icono={FaPen}
                titulo="Editar Usuario"
                subtitulo="Aqui podras editar los datos del usuario, darlo de alta o de baja"
            />

            {/* mensaje*/}
            {mensaje && (
                <div className={`alert alert-${mensaje.tipo} mb-3`} role="alert">
                    {mensaje.texto}
                </div>
            )}

            <div className="row g-3">
                {/* columna izquierda*/}
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            {/* Cabecera con avatar */}
                            <div className="editar-usuario__cabecera">
                                <div className="editar-usuario__avatar">
                                    {iniciales(usuario.nombre, usuario.apellido)}
                                </div>
                                <div>
                                    <h2 className="editar-usuario__nombre">
                                        {usuario.nombre} {usuario.apellido}
                                    </h2>
                                    <span className="editar-usuario__rol">
                                        {ETIQUETA_ROL[usuario.rol] ?? usuario.rol}
                                    </span>
                                    <div className="editar-usuario__usuario">
                                        Usuario: <strong>{usuario.usuario}</strong>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            {/* formulario */}
                            <form onSubmit={handleGuardar}>
                                <div className="row g-3">
                                    {/* nombre de usuario */}
                                    <div className="col-12 col-md-6">
                                        <label className="form-label editar-usuario__label">
                                            Nombre de usuario <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="usuario"
                                            className="form-control editar-usuario__input"
                                            value={formData.usuario}
                                            onChange={handleChange}
                                            required
                                        />
                                        <small className="editar-usuario__hint">
                                            Debe ser único y sin espacios.
                                        </small>
                                    </div>

                                    {/* email */}
                                    <div className="col-12 col-md-6">
                                        <label className="form-label editar-usuario__label">
                                            E-mail <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control editar-usuario__input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <small className="editar-usuario__hint">
                                            Debe ser una dirección de correo válida.
                                        </small>
                                    </div>

                                    {/* telefono (solo ordenanza) */}
                                    {esOrdenanza && (
                                        <div className="col-12 col-md-6">
                                            <label className="form-label editar-usuario__label">
                                                Teléfono <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                className="form-control editar-usuario__input"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                placeholder="Ej: 2664 123456"
                                            />
                                            <small className="editar-usuario__hint">
                                                Ej: 2664 123456
                                            </small>
                                        </div>
                                    )}

                                    {/* cargo (solo directivo) */}
                                    {esDirectivo && (
                                        <div className="col-12 col-md-6">
                                            <label className="form-label editar-usuario__label">
                                                Cargo <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                name="cargo"
                                                className="form-select editar-usuario__input"
                                                value={formData.cargo}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Seleccioná un cargo</option>
                                                {CARGOS_DIRECTIVO.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* datos del usuario (solo lectura) */}
                                <div className="editar-usuario__datos-info">
                                    <h6 className="editar-usuario__datos-titulo">
                                        <FaUser size={14} /> Datos del usuario
                                    </h6>
                                    <div className="row g-3">
                                        <div className="col-6 col-md-3">
                                            <small className="editar-usuario__dato-label">Nombre</small>
                                            <div className="editar-usuario__dato-valor">{usuario.nombre}</div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <small className="editar-usuario__dato-label">Apellido</small>
                                            <div className="editar-usuario__dato-valor">{usuario.apellido}</div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <small className="editar-usuario__dato-label">DNI</small>
                                            <div className="editar-usuario__dato-valor">{usuario.dni}</div>
                                        </div>
                                        <div className="col-6 col-md-3">
                                            <small className="editar-usuario__dato-label">E-mail</small>
                                            <div className="editar-usuario__dato-valor editar-usuario__dato-valor--email">
                                                {usuario.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* columna derecha */}
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            {/* estado */}
                            <h6 className="editar-usuario__seccion-titulo">Estado de la cuenta</h6>
                            <span
                                className={`editar-usuario__estado ${usuario.activo
                                    ? 'editar-usuario__estado--activo'
                                    : 'editar-usuario__estado--inactivo'
                                    }`}
                            >
                                <span className="editar-usuario__estado-punto" />
                                {usuario.activo ? 'Activa' : 'Inactiva'}
                            </span>

                            <hr className="my-4" />

                            {/* acciones */}
                            <h6 className="editar-usuario__seccion-titulo">Acciones</h6>

                            <button
                                type="button"
                                className="btn btn-primary w-100 mb-2 d-inline-flex align-items-center justify-content-center gap-2 editar-usuario__btn-guardar"
                                onClick={handleGuardar}
                                disabled={guardando}
                            >
                                <FaFloppyDisk size={14} />
                                {guardando ? 'Guardando…' : 'Guardar cambios'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-primary w-100 mb-2 d-inline-flex align-items-center justify-content-center gap-2"
                                onClick={handleCambiarEstado}
                                disabled={usuario.activo}
                            >
                                <FaUserCheck size={14} /> Dar de alta
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-danger w-100 mb-3 d-inline-flex align-items-center justify-content-center gap-2"
                                onClick={handleCambiarEstado}
                                disabled={!usuario.activo}
                            >
                                <FaUserXmark size={14} /> Dar de baja
                            </button>

                            <div className="editar-usuario__nota">
                                <FaCircleInfo />
                                <span>
                                    Al dar de baja, el usuario no podra acceder al sistema y su
                                    cuenta quedara inactiva. Podes volver a darlo de alta en
                                    cualquier momento.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditarUsuarioPage;