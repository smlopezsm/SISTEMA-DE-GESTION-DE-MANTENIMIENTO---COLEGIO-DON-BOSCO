import { Link } from 'react-router';
import { FaGear, FaPenToSquare, FaCircleCheck, FaCircleXmark, FaCircleInfo, } from 'react-icons/fa6';
import '../styles/AccionesDetalleTarea.css';

function AccionesDetalleTarea({ tarea, usuario, onAceptar, onRechazar }) {

    const esJefe = usuario?.rol === 'jefeMantenimiento';
    const esDirectivo = usuario?.rol === 'directivo';
    const tareaFinalizada = tarea.estado === 'finalizada';   //para el directivo

    return (

        <div className="card border-0 shadow-sm mb-4 acciones-detalle-tarea">
            <div className="card-body">
                <h6 className="mb-3 d-flex align-items-center gap-2">
                    <FaGear /> Acciones
                </h6>

                {/* muestra esto solo si es el jefe*/}
                {esJefe && (
                    <Link to={`/gestor/tareas/${tarea.id}/editar`} className="btn btn-primary w-100" >
                        <FaPenToSquare className="me-2" />
                        Editar tarea
                    </Link>
                )}

                {/*muestra esto solo si es diirectivo */}
                {esDirectivo && (
                    <>
                        <button type="button" className="btn btn-success w-100 mb-2" onClick={() => onAceptar?.(tarea.id)} disabled={!tareaFinalizada} >
                            <FaCircleCheck className="me-2" />
                            Aceptar tarea
                        </button>
                        <button type="button" className="btn btn-outline-danger w-100" onClick={() => onRechazar?.(tarea.id)} disabled={!tareaFinalizada} >
                            <FaCircleXmark className="me-2" />
                            Rechazar tarea
                        </button>

                        {/* un mensaje si la tarea no ha finalizado */}
                        {!tareaFinalizada && (
                            <div className="alert alert-info mt-3 mb-0 small d-flex gap-2">
                                <FaCircleInfo className="flex-shrink-0" />
                                <span>
                                    La tarea no ha finalizado todavia. Cuando el Jefe de
                                    Mantenimiento la finalice, se podra aceptar o rechazar
                                </span>
                            </div>
                        )}
                    </>
                )}

                {/* control por las dudas */}
                {!esJefe && !esDirectivo && (
                    <p className="text-muted small mb-0 text-center">
                        No hay acciones disponibles
                    </p>
                )}
            </div>
        </div>
    );
}

export default AccionesDetalleTarea;