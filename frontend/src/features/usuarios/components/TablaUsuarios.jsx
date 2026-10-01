import { FaPen, FaTrashCan } from 'react-icons/fa6';
import Etiqueta from '../../../shared/components/Etiqueta';
import { ETIQUETA_ROL } from '../../../shared/config/MenuPorRol';

// rol -> clave de estado de Etiqueta (solo para reutilizar sus colores)
export const TONO_ROL = {
  directivo: 'en-proceso',
  jefeMantenimiento: 'con-tarea',
  ordenanza: 'pendiente',
};

const iniciales = (u) => `${u.nombre[0]}${u.apellido[0]}`.toUpperCase();

// Directivo -> cargo, ordenanza -> teléfono, jefe de mantenimiento -> sin dato
const telefonoOCargo = (u) => u.cargo ?? u.telefono ?? '—';

function TablaUsuarios({ usuarios, onEditar, onBaja }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>DNI</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
            <th>Teléfono / Cargo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center text-secondary py-4">
                No hay usuarios que coincidan con los filtros.
              </td>
            </tr>
          )}
          {usuarios.map((u) => (
            <tr key={u.clave}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="avatar-usuario"
                    style={{ background: `var(--estado-${TONO_ROL[u.rol] === 'en-proceso' ? 'proceso' : TONO_ROL[u.rol]}-solid)` }}
                    aria-hidden="true"
                  >
                    {iniciales(u)}
                  </span>
                  {u.nombre}
                </div>
              </td>
              <td>{u.apellido}</td>
              <td>{u.usuario}</td>
              <td>{Number(u.dni).toLocaleString('es-AR')}</td>
              <td>{u.email}</td>
              <td><Etiqueta estado={TONO_ROL[u.rol]}>{ETIQUETA_ROL[u.rol]}</Etiqueta></td>
              <td>{telefonoOCargo(u)}</td>
              <td>
                <Etiqueta estado={u.activo ? 'finalizada' : 'rechazada'}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </Etiqueta>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2" onClick={() => onEditar(u)}>
                    <FaPen /> Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-2 text-nowrap"
                    disabled={!u.activo}
                    onClick={() => onBaja(u)}
                  >
                    <FaTrashCan /> Dar de baja
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaUsuarios;
