import { useState, useEffect } from 'react';
import { FaXmark, FaCartShopping, FaCalendarDays } from 'react-icons/fa6';
import '../styles/ModalCompra.css';

const VALORES_INICIALES = { fechaCompra: '', montoTotal: '', detalleCompra: '', factura: null, };

function ModalCompra({ abierto, compra, tareaId, onCerrar, onGuardar }) {

    const [valores, setValores] = useState(VALORES_INICIALES);
    const [errores, setErrores] = useState({});

    const modoEdicion = Boolean(compra?.id);

    useEffect(() => {
        if (abierto) {
            if (compra) {
                setValores({ ...VALORES_INICIALES, ...compra });
            } else {
                //fecha por defecto
                const hoy = new Date();
                const dia = String(hoy.getDate()).padStart(2, '0');
                const mes = String(hoy.getMonth() + 1).padStart(2, '0');
                const anio = hoy.getFullYear();
                setValores({ ...VALORES_INICIALES, fechaCompra: `${dia}/${mes}/${anio}`, });
            }
            setErrores({});
        }
    }, [abierto, compra]);

    if (!abierto) return null;

    //
    function manejarCambio(campo, valor) {
        setValores((prev) => ({ ...prev, [campo]: valor }));
    }

    function validar() {
        const nuevos = {};
        if (!valores.fechaCompra?.trim()) nuevos.fechaCompra = 'La fecha es obligatoria';
        if (!valores.montoTotal || Number(valores.montoTotal) <= 0) {
            nuevos.montoTotal = 'El monto debe ser mayor a 0';
        }
        if (!valores.detalleCompra?.trim()) {
            nuevos.detalleCompra = 'El detalle es obligatorio';
        }
        setErrores(nuevos);
        return Object.keys(nuevos).length === 0;
    }

    function manejarSubmit(e) {
        e.preventDefault();
        if (!validar()) return;
        onGuardar({ ...valores, tareaId });
    }

    return (
        <div className="modal-compra-overlay" onClick={onCerrar}>
            <div className="modal-compra" onClick={(e) => e.stopPropagation()}>
                {/* header */}
                <div className="modal-compra__header">
                    <div className="d-flex align-items-center gap-3">
                        <div className="modal-compra__icono">
                            <FaCartShopping size={22} />
                        </div>
                        <div>
                            <h5 className="mb-0">
                                {modoEdicion ? 'Editar compra' : 'Registrar compra'}
                            </h5>
                            <small className="text-muted">
                                {modoEdicion
                                    ? 'Modificar la informacion de la compra'
                                    : 'Completa la informacion de la compra de insumos o materiales'}
                            </small>
                        </div>
                    </div>
                    <button type="button" className="btn btn-link text-muted p-1" onClick={onCerrar} aria-label="Cerrar" >
                        <FaXmark size={20} />
                    </button>
                </div>

                {/* cuerpo del form */}
                <form onSubmit={manejarSubmit}>
                    <div className="modal-compra__body">
                        {/* fecha de compra */}
                        <div className="mb-3">
                            <label className="form-label">
                                Fecha de compra <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <FaCalendarDays className="text-muted" />
                                </span>
                                <input
                                    type="text"
                                    className={`form-control ${errores.fechaCompra ? 'is-invalid' : ''}`}
                                    placeholder="dd/mm/aaaa"
                                    value={valores.fechaCompra}
                                    onChange={(e) => manejarCambio('fechaCompra', e.target.value)}
                                />
                                {errores.fechaCompra && (
                                    <div className="invalid-feedback">{errores.fechaCompra}</div>
                                )}
                            </div>
                        </div>

                        {/* monto total */}
                        <div className="mb-3">
                            <label className="form-label">
                                Monto total <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-white">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={`form-control ${errores.montoTotal ? 'is-invalid' : ''}`}
                                    placeholder="12450"
                                    value={valores.montoTotal}
                                    onChange={(e) => manejarCambio('montoTotal', e.target.value)}
                                />
                                {errores.montoTotal && (
                                    <div className="invalid-feedback">{errores.montoTotal}</div>
                                )}
                            </div>
                        </div>

                        {/* detalle */}
                        <div className="mb-3">
                            <label className="form-label">
                                Detalle de la compra <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className={`form-control ${errores.detalleCompra ? 'is-invalid' : ''}`}
                                rows={4}
                                maxLength={500}
                                placeholder="Ej: 2 bultos de cemento (25 kg c/u) y 1 rollo de cinta de seguridad."
                                value={valores.detalleCompra}
                                onChange={(e) => manejarCambio('detalleCompra', e.target.value)}
                            />
                            {errores.detalleCompra && (
                                <div className="invalid-feedback">{errores.detalleCompra}</div>
                            )}
                            <small className="text-muted d-block text-end">
                                {valores.detalleCompra.length}/500
                            </small>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="modal-compra__footer">
                        <button type="button" className="btn btn-outline-secondary" onClick={onCerrar} >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary"> <FaCartShopping className="me-2" />
                            {modoEdicion ? 'Guardar cambios' : 'Guardar compra'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCompra;