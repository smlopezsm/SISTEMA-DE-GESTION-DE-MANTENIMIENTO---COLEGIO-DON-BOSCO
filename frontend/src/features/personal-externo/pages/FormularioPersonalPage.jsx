import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { FaArrowLeft, FaUsers } from 'react-icons/fa6';
import '../styles/FormularioPersonalPage.css';

import { obtenerPersonalPorId, crearPersonal, actualizarPersonal, } from '../services/personalService';
import { useToast } from '../../../shared/context/ToastContext';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';

import DatosPersonalesPersonal from '../components/DatosPersonalesPersonal';
import ContactoPersonal from '../components/ContactoPersonal';
import InfoLaboralPersonal from '../components/InfoLaboralPersonal';
import ResumenPersonal from '../components/ResumenPersonal';
import AccionesPersonal from '../components/AccionesPersonal';

const ESPECIALIDADES = [ 'Electricista', 'Plomería', 'Albañilería', 'Pintura', 'Carpintería', 'Gasista', 'Herrería', 'Climatización', 'Mantenimiento general', 'Vidriería', ];
const VALORES_INICIALES = { nombre: '', apellido: '', dni: '', genero: '', telefono: '', email: '', especialidad: '', matricula: '', observaciones: '', activo: true, };

function FormularioPersonalPage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const modoEdicion = Boolean(id);

  const datosIniciales = useMemo(() => {
    if (modoEdicion) return obtenerPersonalPorId(id) ?? null;
    return VALORES_INICIALES;
  }, [id, modoEdicion]);

  const [valores, setValores] = useState(datosIniciales);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  const [modalConfirmacion, setModalConfirmacion] = useState({ abierto: false, tipo: null, });

  if (modoEdicion && !datosIniciales) {
    return (
      <div className="container-fluid py-5 text-center">
        <p className="text-muted">No se encontró el personal solicitado.</p>
        <Link to="/gestor/personal-externo" className="btn btn-primary">
          Volver al listado
        </Link>
      </div>
    );
  }

  function manejarCambio(campo, valor) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  }

  function validar() {
    const nuevos = {};
    if (!valores.nombre?.trim()) nuevos.nombre = 'El nombre es obligatorio';
    if (!valores.apellido?.trim()) nuevos.apellido = 'El apellido es obligatorio';
    if (!valores.dni?.trim()) nuevos.dni = 'El DNI es obligatorio';
    if (!valores.telefono?.trim()) nuevos.telefono = 'El teléfono es obligatorio';
    if (!valores.email?.trim()) nuevos.email = 'El correo es obligatorio';
    if (!valores.especialidad?.trim()) nuevos.especialidad = 'La especialidad es obligatoria';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  }

  function manejarGuardar() {
    if (!validar()) return;
    setGuardando(true);

    if (modoEdicion) {
      actualizarPersonal(id, valores);
      mostrarToast('Personal actualizado correctamente', 'success');
    } else {
      crearPersonal(valores);
      mostrarToast('Personal agregado correctamente', 'success');
    }

    setGuardando(false);
    navigate('/gestor/personal-externo');
  }

  function manejarCancelar() {
    navigate('/gestor/personal-externo');
  }

  function abrirConfirmacion(tipo) {
    setModalConfirmacion({ abierto: true, tipo });
  }

  function cerrarConfirmacion() {
    setModalConfirmacion({ abierto: false, tipo: null });
  }

  function confirmarAccion() {
    const { tipo } = modalConfirmacion;

    if (tipo === 'dar-de-baja') {
      actualizarPersonal(id, { ...valores, activo: false });
      mostrarToast('Personal dado de baja', 'success');
      navigate('/gestor/personal-externo');
    } else if (tipo === 'dar-de-alta') {
      actualizarPersonal(id, { ...valores, activo: true });
      mostrarToast('Personal dado de alta', 'success');
      navigate('/gestor/personal-externo');
    }

    cerrarConfirmacion();
  }

  return (
    <div className="formulario-personal-page">
      <div className="mb-4">
        <Link to="/gestor/personal-externo" className="btn btn-link text-decoration-none text-muted p-0 mb-2 d-inline-flex align-items-center gap-2" >
          <FaArrowLeft size={14} />
          Volver al listado
        </Link>

        <div className="d-flex gap-3 align-items-start">
          <div className="icono-titulo"><FaUsers size={22} /></div>
          <div>
            <h1 className="h3 mb-1">
              {modoEdicion ? 'Editar personal externo' : 'Nuevo personal externo'}
            </h1>
            <p className="text-muted mb-0">
              {modoEdicion
                ? 'Modificacion del personal externo registrado'
                : 'Registre los datos de un nuevo personal externo'}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <DatosPersonalesPersonal valores={valores} errores={errores} onCambiar={manejarCambio} />
          <ContactoPersonal valores={valores} errores={errores} onCambiar={manejarCambio} />
          <InfoLaboralPersonal valores={valores} errores={errores} especialidades={ESPECIALIDADES} onCambiar={manejarCambio} />
        </div>

        <div className="col-12 col-xl-4">
          {modoEdicion && <ResumenPersonal persona={valores} />}

          <AccionesPersonal
            modoEdicion={modoEdicion}
            estaActivo={valores.activo}
            guardando={guardando}
            onGuardar={manejarGuardar}
            onCancelar={manejarCancelar}
            onDarDeBaja={() => abrirConfirmacion('dar-de-baja')}
            onDarDeAlta={() => abrirConfirmacion('dar-de-alta')}
          />
        </div>
      </div>

      <ModalConfirmacion
        abierto={modalConfirmacion.abierto}
        titulo={
          modalConfirmacion.tipo === 'dar-de-baja'
            ? 'Dar de baja al personal'
            : 'Dar de alta al personal'
        }
        mensaje={
          modalConfirmacion.tipo === 'dar-de-baja'
            ? `¿Estás seguro que querés dar de baja a ${valores.nombre} ${valores.apellido}? Se conservará el historial de tareas asignadas.`
            : `¿Querés dar de alta a ${valores.nombre} ${valores.apellido}?`
        }
        textoConfirmar={
          modalConfirmacion.tipo === 'dar-de-baja' ? 'Dar de baja' : 'Dar de alta'
        }
        variante={modalConfirmacion.tipo === 'dar-de-baja' ? 'danger' : 'success'}
        onConfirmar={confirmarAccion}
        onCancelar={cerrarConfirmacion}
      />
    </div>
  );
}

export default FormularioPersonalPage;