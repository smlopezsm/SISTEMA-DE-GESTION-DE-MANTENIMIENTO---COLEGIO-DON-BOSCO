import {
  FaHouse,
  FaCirclePlus,
  FaClipboardCheck,
  FaClipboardList,
  FaScrewdriverWrench,
  FaUserGroup,
  FaBell,
  FaUser,
  FaChartBar,
  FaUserGear,
  FaGraduationCap, 
} from "react-icons/fa6";


export const MENU_POR_ROL = {
  ordenanza: [
    { id: 1, destino: "/gestor/requerimientos/nuevo", texto: "Emitir requerimiento", icono: FaCirclePlus },
    { id: 2, destino: "/gestor/requerimientos/mios", texto: "Mis requerimientos", icono: FaClipboardCheck },
  ],
  jefeMantenimiento: [
    { id: 1, destino: "/gestor", texto: "Inicio", icono: FaHouse, exacta: true },
    { id: 2, destino: "/gestor/requerimientos", texto: "Requerimientos", icono: FaClipboardList },
    { id: 3, destino: "/gestor/tareas", texto: "Mis tareas", icono: FaScrewdriverWrench },
    { id: 4, destino: "/gestor/personal-externo", texto: "Personal externo", icono: FaUserGroup },
    { id: 5, destino: "/gestor/notificaciones", texto: "Notificaciones", icono: FaBell },
  ],
  directivo: [
    { id: 1, destino: "/gestor", texto: "Inicio", icono: FaHouse, exacta: true },
    { id: 2, destino: "/gestor/requerimientos/nuevo", texto: "Emitir requerimiento", icono: FaCirclePlus },
    { id: 3, destino: "/gestor/dashboard", texto: "Estadísticas", icono: FaChartBar },
    { id: 4, destino: "/gestor/usuarios", texto: "Gestionar cuentas", icono: FaUserGear },
  ],
};

//etiquetas de los roles
export const ETIQUETA_ROL = {
  ordenanza: "Ordenanza",
  jefeMantenimiento: "Jefe de Mantenimiento",
  directivo: "Directivo",
};

// icono representativo por rol
export const ICONO_ROL = {
  ordenanza: FaUser,
  jefeMantenimiento: FaScrewdriverWrench,
  directivo: FaGraduationCap,
};