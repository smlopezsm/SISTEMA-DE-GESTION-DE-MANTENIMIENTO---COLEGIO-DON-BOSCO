// Minúsculas y sin tildes, para búsquedas que no distinguen acentos
export const normalizar = (texto = '') =>
  String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
