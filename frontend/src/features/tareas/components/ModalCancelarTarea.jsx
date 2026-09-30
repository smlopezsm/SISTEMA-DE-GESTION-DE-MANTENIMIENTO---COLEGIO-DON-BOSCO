import { useState, useEffect } from 'react';
import { FaXmark, FaTrashCan } from 'react-icons/fa6';
import '../styles/ModalCancelarTarea.css';

function ModalCancelarTarea({ abierto, onCerrar, onConfirmar }) {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (abierto) {
      setMotivo('');
      setError('');
    }
  }, [abierto]);

  if (!abierto) return null;

  function manejarSubmit(e) {
    e.preventDefault();
    if (!motivo.trim()) {
      setError('El motivo es obligatorio');
      return;
    }
    onConfirmar(motivo.trim());
  }

  return (
    <div className="modal-cancelar-overlay" onClick={onCerrar}>
      <div className="modal-cancelar" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cancelar__header">
          <div className="d-flex align-items-center gap-3">
            <div className="modal-cancelar__icono">
              <FaTrashCan size={22} />
            </div>
            <div>
              <h5 className="mb-0">Cancelar tarea</h5>
              <small className="text-muted">
                Indica el motivo por el cual quiere cancela la tarea
              </small>
            </div>
          </div>
          <button type="button" className="btn btn-link text-muted p-1" onClick={onCerrar} aria-label="Cerrar" >
            <FaXmark size={20} />
          </button>
        </div>

        <form onSubmit={manejarSubmit}>
          <div className="modal-cancelar__body">
            <label className="form-label">
              Motivo de cancelacion <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${error ? 'is-invalid' : ''}`}
              rows={4}
              maxLength={500}
              placeholder="Ej: El gasista no pudo venir. Se generará una nueva tarea equivalente."
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                if (error) setError('');
              }}
            />
            {error && <div className="invalid-feedback">{error}</div>}
            <small className="text-muted d-block text-end">
              {motivo.length}/500
            </small>
          </div>

          <div className="modal-cancelar__footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-danger">
              <FaTrashCan className="me-2" />
              Cancelar tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCancelarTarea;