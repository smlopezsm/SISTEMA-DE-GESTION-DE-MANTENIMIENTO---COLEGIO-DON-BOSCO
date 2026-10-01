import { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router';
import { FaArrowLeft, FaScrewdriverWrench } from 'react-icons/fa6';
import '../styles/FormularioTareaPage.css';
import { obtenerTareaPorId, obtenerRequerimientoParaTarea, obtenerOrdenanzas, obtenerPersonalExterno, crearTarea, actualizarTarea, finalizarTarea, cancelarTarea, } from '../services/tareasService';
import { obtenerCompraPorTarea, crearCompra, actualizarCompra, } from '../services/comprasService';

import { useToast } from '../../../shared/context/ToastContext';
import ModalConfirmacion from '../../../shared/components/ModalConfirmacion';
import ModalCancelarTarea from '../components/ModalCancelarTarea';

import DatosRequerimiento from '../components/DatosRequerimiento';
import DatosTarea from '../components/DatosTarea';
import AccionesTarea from '../components/AccionesTarea';
import ModalCompra from '../components/ModalCompra';

// estado que no permiten cambios
const ESTADOS_FINALES = ['finalizada', 'aprobada', 'rechazada', 'cancelada'];

const VALORES_INICIALES_CREAR = { prioridad: 'media', observaciones: '', tipoAsignacion: 'jefe', personalAsignado: '', telefono: '', estado: 'pendiente', };

function FormularioTareaPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requerimientoId = searchParams.get('requerimiento');
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

  const modoEdicion = Boolean(id);
  const ordenanzas = obtenerOrdenanzas();
  const personalExterno = obtenerPersonalExterno();

  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(false);

  // redirigir si es crear y no hay requerimiento
  useEffect(() => {
    if (!modoEdicion && !requerimientoId) {
      navigate('/gestor/requerimientos', { replace: true });
    }
  }, [modoEdicion, requerimientoId, navigate]);

  // cargar datos iniciales segun modo
  const datosIniciales = useMemo(() => {
    if (modoEdicion) {
      const tarea = obtenerTareaPorId(id);
      if (!tarea) return null;

      const requerimiento = { id: tarea.requerimientoId, titulo: tarea.requerimientoTitulo, descripcion: tarea.descripcion, lugar: tarea.lugar, reportadoPor: tarea.reportadoPor, rolReportante: tarea.rolReportante, fechaHora: tarea.fechaCreacion, };

      const valores = { prioridad: tarea.prioridad ?? 'media', observaciones: tarea.observaciones ?? '', estado: tarea.estado ?? 'pendiente', tipoAsignacion: tarea.responsable?.tipo ?? 'jefe', personalAsignado: tarea.responsable?.nombre ?? '', telefono: tarea.telefono ?? '', };

      return { valores, tarea, requerimiento };
    }

    if (requerimientoId) {
      const req = obtenerRequerimientoParaTarea(requerimientoId);
      if (!req) return null;
      return { valores: VALORES_INICIALES_CREAR, requerimiento: req };
    }

    return { valores: VALORES_INICIALES_CREAR };
  }, [id, requerimientoId, modoEdicion]);

  const [valores, setValores] = useState( datosIniciales?.valores ?? VALORES_INICIALES_CREAR );
  const [guardando, setGuardando] = useState(false);

  // compra asociada
  const [compra, setCompra] = useState(() => {
    if (modoEdicion && id) return obtenerCompraPorTarea(id) ?? null;
    return null;
  });

  const [modalCompraAbierto, setModalCompraAbierto] = useState(false);

  if (!datosIniciales) {
    return (
      <div className="container-fluid py-5 text-center">
        <p className="text-muted">No se encontró la tarea o el requerimiento.</p>
        <Link to="/gestor/tareas" className="btn btn-primary">
          Volver al listado
        </Link>
      </div>
    );
  }

  const { tarea, requerimiento } = datosIniciales;

  // determinar si la tarea esta finalizada
  const tareaCerrada = modoEdicion && ESTADOS_FINALES.includes(tarea?.estado);

  function manejarCambio(campo, valor) {
    setValores((prev) => {
      const nuevos = { ...prev, [campo]: valor };
      if (campo === 'tipoAsignacion') {
        nuevos.personalAsignado = '';
        nuevos.telefono = '';
      }
      return nuevos;
    });
  }

  function manejarSeleccionPersonal(nombre) {
    const lista = valores.tipoAsignacion === 'interno' ? ordenanzas : personalExterno;
    const persona = lista.find((p) => p.nombre === nombre);
    setValores((prev) => ({
      ...prev,
      personalAsignado: nombre,
      telefono: persona?.telefono ?? '',
    }));
  }

  function armarResponsable() {
    if (valores.tipoAsignacion === 'jefe') {
      return { nombre: 'Jefe de Mantenimiento', tipo: 'jefe' };
    }
    return { nombre: valores.personalAsignado, tipo: valores.tipoAsignacion };
  }

  function manejarGuardarCompra(datosCompra) {
    if (compra?.id) {
      const actualizada = actualizarCompra(compra.id, datosCompra);
      setCompra({ ...compra, ...actualizada });
      mostrarToast('Compra actualizada correctamente', 'success');
    } else {
      const nueva = crearCompra({ ...datosCompra, tareaId: id ?? null });
      setCompra(nueva);
      mostrarToast('Compra registrada correctamente', 'success');
    }
    setModalCompraAbierto(false);
  }

  function manejarGuardar() {
    setGuardando(true);

    if (modoEdicion) {
      // si la tarea esta finalizada, no se manda el estado
      const cambios = {
        prioridad: valores.prioridad,
        observaciones: valores.observaciones,
      };

      if (!tareaCerrada) {
        cambios.estado = valores.estado;
      }

      actualizarTarea(id, cambios);
      mostrarToast('Tarea actualizada correctamente', 'success');
    } else {
      crearTarea({
        ...valores,
        responsable: armarResponsable(),
        requerimiento,
        compraId: compra?.id ?? null,
      });
      mostrarToast('Tarea creada correctamente', 'success');
    }

    setGuardando(false);
    navigate('/gestor/tareas');
  }

  function confirmarFinalizar() {
    finalizarTarea(id);
    setModalFinalizar(false);
    mostrarToast('Tarea finalizada correctamente', 'success');
    navigate('/gestor/tareas');
  }

  function confirmarCancelar(motivo) {
    cancelarTarea(id, motivo);
    setModalCancelar(false);
    mostrarToast('Tarea cancelada', 'success');
    navigate('/gestor/tareas');
  }

  return (
    <div className="formulario-tarea-page">
      {/* encabezado */}
      <div className="mb-4">
        <Link
          to="/gestor/tareas"
          className="btn btn-link text-decoration-none text-muted p-0 mb-2 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft size={14} />
          Volver al listado
        </Link>

        <div className="d-flex gap-3 align-items-start titulo">
          <div className="icono-titulo">
            <FaScrewdriverWrench size={25} />
          </div>
          <div>
            <h1 className="h3 mb-1">
              {modoEdicion ? 'Editar tarea' : 'Nueva tarea'}
            </h1>
            <p className="text-muted mb-0">
              {modoEdicion
                ? 'Modificacion de la tarea'
                : 'Creacion de nueva tarea'}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* columna izquierda */}
        <div className="col-12 col-xl-8">
          <DatosRequerimiento requerimiento={requerimiento} />

          <DatosTarea
            modoEdicion={modoEdicion}
            valores={valores}
            ordenanzas={ordenanzas}
            personalExterno={personalExterno}
            compra={compra}
            onCambiar={manejarCambio}
            onSeleccionarPersonal={manejarSeleccionPersonal}
            onRegistrarCompra={() => setModalCompraAbierto(true)}
            onEditarCompra={() => setModalCompraAbierto(true)}
          />
        </div>

        {/* columna derecha */}
        <div className="col-12 col-xl-4">
          <AccionesTarea
            modoEdicion={modoEdicion}
            valores={valores}
            guardando={guardando}
            onCambiar={manejarCambio}
            onGuardar={manejarGuardar}
            onFinalizar={() => setModalFinalizar(true)}
            onCancelar={() => setModalCancelar(true)}
          />
        </div>
      </div>

      {/* compra */}
      <ModalCompra
        abierto={modalCompraAbierto}
        compra={compra}
        tareaId={id}
        onCerrar={() => setModalCompraAbierto(false)}
        onGuardar={manejarGuardarCompra}
      />

      {/* confirmacion finalizacion */}
      <ModalConfirmacion
        abierto={modalFinalizar}
        titulo="Finalizar tarea"
        mensaje="¿Marcar esta tarea como finalizada? Una vez finalizada, quedará pendiente de evaluación por parte del Directivo."
        textoConfirmar="Finalizar"
        variante="success"
        onConfirmar={confirmarFinalizar}
        onCancelar={() => setModalFinalizar(false)}
      />

      {/*confirmacion cancelacion */}
      <ModalCancelarTarea
        abierto={modalCancelar}
        onCerrar={() => setModalCancelar(false)}
        onConfirmar={confirmarCancelar}
      />
    </div>
  );
}

export default FormularioTareaPage;