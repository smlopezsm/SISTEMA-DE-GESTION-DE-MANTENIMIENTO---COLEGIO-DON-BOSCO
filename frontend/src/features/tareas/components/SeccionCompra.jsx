import { FaCartShopping, FaPenToSquare, FaCirclePlus } from 'react-icons/fa6';
import '../styles/SeccionCompra.css';

function SeccionCompra({ compra, onRegistrar, onEditar }) {

  return (
    <div className="card border-0 shadow-sm mb-4 seccion-compra">
      <div className="card-body">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          <FaCartShopping /> Compra de insumos
        </h6>

        {compra ? (
          /* compra ya registrada */
          <div className="seccion-compra__registrada">
            <div className="seccion-compra__fila">
              <span className="seccion-compra__label">ID de compra</span>
              <span className="seccion-compra__valor fw-bold">
                {compra.id}
              </span>
            </div>
            <div className="seccion-compra__fila">
              <span className="seccion-compra__label">Fecha</span>
              <span className="seccion-compra__valor">{compra.fechaCompra}</span>
            </div>
            <div className="seccion-compra__fila">
              <span className="seccion-compra__label">Monto</span>
              <span className="seccion-compra__valor">
                ${Number(compra.montoTotal).toLocaleString('es-AR')}
              </span>
            </div>
            <div className="seccion-compra__fila">
              <span className="seccion-compra__label">Detalle</span>
              <span className="seccion-compra__valor text-end">
                {compra.detalleCompra}
              </span>
            </div>

            <button type="button" className="btn btn-outline-primary btn-sm w-100 mt-3" onClick={onEditar} >
              <FaPenToSquare className="me-1" />
              Editar compra
            </button>
          </div>
        ) : (
          /* sin compra */
          <div className="seccion-compra__vacia">
            <p className="text-muted small mb-3">
              No se registran compras
            </p>
            <button type="button" className="btn btn-primary w-100" onClick={onRegistrar} >
              <FaCirclePlus className="me-1" />
              Registrar compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeccionCompra;