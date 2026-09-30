import { FaList, FaClipboardList, FaWrench, FaCircleCheck, FaCircleXmark, FaChevronDown, } from 'react-icons/fa6';
import '../styles/TabsNotificaciones.css';
import { useState, useEffect, useRef } from 'react';


const TABS = [
  { valor: 'todas', texto: 'Todas', icono: FaList },
  { valor: 'requerimiento', texto: 'Requerimientos', icono: FaClipboardList },
  { valor: 'tarea', texto: 'Tareas', icono: FaWrench },
  { valor: 'aprobacion', texto: 'Aprobaciones', icono: FaCircleCheck },
  { valor: 'rechazo', texto: 'Rechazos', icono: FaCircleXmark },
];

function TabsNotificaciones({ activo, contadores, onCambiar }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  const tabActivo = TABS.find((t) => t.valor === activo) ?? TABS[0];

  // cerrar
  useEffect(() => {
    if (!abierto) return;
    function handleClickFuera(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFuera);
    return () => document.removeEventListener('mousedown', handleClickFuera);
  }, [abierto]);

  return (
    <div className="tabs-notificaciones">
      {/*para compu */}
      <div className="tabs-notificaciones__desktop d-none d-md-flex">
        {TABS.map((tab) => {
          const Icono = tab.icono;
          const contador = contadores[tab.valor] ?? 0;
          const esActivo = activo === tab.valor;

          return (
            <button
              key={tab.valor}
              type="button"
              className={`tabs-notificaciones__tab ${
                esActivo ? 'tabs-notificaciones__tab--activa' : ''
              }`}
              onClick={() => onCambiar(tab.valor)}
            >
              <Icono size={14} />
              <span>{tab.texto}</span>
              {contador > 0 && (
                <span className="tabs-notificaciones__contador">
                  {contador}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* para celu */}
      <div className="tabs-notificaciones__movil d-md-none" ref={ref}>
        {/* boton del menu */}
        <button
          type="button"
          className={`tabs-notificaciones__select ${
            activo !== 'todas' ? 'tabs-notificaciones__select--activo' : ''
          }`}
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
        >
          <span className="tabs-notificaciones__select-contenido">
            <tabActivo.icono size={16} />
            <span>{tabActivo.texto}</span>
            <span className="tabs-notificaciones__select-contador">
              ({contadores[tabActivo.valor] ?? 0})
            </span>
          </span>

          <FaChevronDown
            size={12}
            className={`tabs-notificaciones__chevron ${
              abierto ? 'tabs-notificaciones__chevron--abierto' : ''
            }`}
          />
        </button>

        {/* menu desplegable */}
        {abierto && (
          <ul className="tabs-notificaciones__menu">
            {TABS.map((tab) => {
              const Icono = tab.icono;
              const contador = contadores[tab.valor] ?? 0;
              const esActivo = activo === tab.valor;

              return (
                <li key={tab.valor}>
                  <button type="button" className={`tabs-notificaciones__opcion ${ esActivo ? 'tabs-notificaciones__opcion--activa' : '' }`}
                    onClick={() => {
                      onCambiar(tab.valor);
                      setAbierto(false);
                    }}
                  >
                    <Icono size={14} />
                    <span>{tab.texto}</span>
                    <span className="tabs-notificaciones__opcion-contador">
                      {contador}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TabsNotificaciones;