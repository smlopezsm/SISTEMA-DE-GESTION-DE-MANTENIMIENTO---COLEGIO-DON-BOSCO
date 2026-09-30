import '../styles/SelectorUrgencia.css';

const OPCIONES = [ { valor: 'alta', texto: 'Alta', color: 'danger' }, { valor: 'media', texto: 'Media', color: 'warning' }, { valor: 'baja', texto: 'Baja', color: 'success' }, ];

function SelectorUrgencia({ valor, onChange }) {
  return (
    <div className="selector-urgencia d-flex gap-2">
      {OPCIONES.map((op) => {
        const activo = valor === op.valor;
        return (
          <button key={op.valor} type="button" className={`btn btn-sm flex-grow-1 ${ activo ? `btn-${op.color}` : `btn-outline-${op.color}` }`} onClick={() => onChange(op.valor)} >
            {op.texto}
          </button>
        );
      })}
    </div>
  );
}

export default SelectorUrgencia;