
// Campos visibles por rol
export const CAMPOS_POR_ROL = {
  jefeMantenimiento: ['usuario', 'nombre', 'apellido', 'dni', 'email'],
  directivo:         ['usuario', 'nombre', 'apellido', 'dni', 'email', 'cargo'],
  ordenanza:         ['usuario', 'nombre', 'apellido', 'dni', 'email', 'telefono'],
};

// Campos editables por rol
export const CAMPOS_EDITABLES_POR_ROL = {
  jefeMantenimiento: ['nombre', 'apellido'],
  directivo:         ['nombre', 'apellido'],
  ordenanza:         ['nombre', 'apellido', 'telefono'],
};

// Etiquetas legibles
export const ETIQUETA_CAMPO = {
  usuario:  'Nombre de usuario',
  nombre:   'Nombre',
  apellido: 'Apellido',
  dni:      'DNI',
  email:    'E-mail',
  telefono: 'Teléfono',
  cargo:    'Cargo',
};

export function camposDeRol(rol) {
  return CAMPOS_POR_ROL[rol] ?? CAMPOS_POR_ROL.jefeMantenimiento;
}

export function esEditable(rol, campo) {
  return (CAMPOS_EDITABLES_POR_ROL[rol] ?? []).includes(campo);
}