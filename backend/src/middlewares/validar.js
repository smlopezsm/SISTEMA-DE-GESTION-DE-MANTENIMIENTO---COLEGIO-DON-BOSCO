const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function vacio(valor) {
  return (
    valor === undefined ||
    valor === null ||
    (typeof valor === 'string' && valor.trim() === '')
  );
}

/**
 * Middleware de validacion
 *
 * Reglas
 * - requerido: boolean
 * - tipo: 'string' | 'email' | 'numero' | 'boolean' | 'array'
 * - min / max: longitud mínima/máxima para strings
 * - minNumero / maxNumero
 * - entero: boolean
 * - enum: array de valores permitidos
 * - regex: RegExp
 * - mensaje: mensaje personalizado
 */
export function validar(reglas) {
  return (req, res, next) => {
    const body = req.body ?? {};
    const errores = [];

    for (const [campo, regla] of Object.entries(reglas)) {
      let valor = body[campo];

      if (typeof valor === 'string' && campo !== 'password') {
        valor = valor.trim();
        body[campo] = valor;
      }

      if (vacio(valor)) {
        if (regla.requerido) {
          errores.push(regla.mensaje ?? `El campo "${campo}" es obligatorio`);
        }
        continue;
      }

      if (regla.tipo === 'string' && typeof valor !== 'string') {
        errores.push(`El campo "${campo}" debe ser texto`);
        continue;
      }

      if (regla.tipo === 'email' && !EMAIL_REGEX.test(String(valor))) {
        errores.push(`El campo "${campo}" debe ser un correo válido`);
        continue;
      }

      if (regla.tipo === 'numero' && !Number.isFinite(Number(valor))) {
        errores.push(`El campo "${campo}" debe ser numérico`);
        continue;
      }

      if (regla.tipo === 'boolean' && typeof valor !== 'boolean') {
        errores.push(`El campo "${campo}" debe ser booleano`);
        continue;
      }

      if (regla.tipo === 'array' && !Array.isArray(valor)) {
        errores.push(`El campo "${campo}" debe ser una lista`);
        continue;
      }

      if (regla.entero && !Number.isInteger(Number(valor))) {
        errores.push(`El campo "${campo}" debe ser un número entero`);
        continue;
      }

      if (regla.min !== undefined && String(valor).length < regla.min) {
        errores.push(
          `El campo "${campo}" debe tener al menos ${regla.min} caracteres`,
        );
        continue;
      }

      if (regla.max !== undefined && String(valor).length > regla.max) {
        errores.push(
          `El campo "${campo}" no puede superar los ${regla.max} caracteres`,
        );
        continue;
      }

      if (regla.minNumero !== undefined && Number(valor) < regla.minNumero) {
        errores.push(`El campo "${campo}" debe ser mayor o igual a ${regla.minNumero}`);
        continue;
      }

      if (regla.maxNumero !== undefined && Number(valor) > regla.maxNumero) {
        errores.push(`El campo "${campo}" debe ser menor o igual a ${regla.maxNumero}`);
        continue;
      }

      if (regla.enum && !regla.enum.includes(valor)) {
        errores.push(
          `El campo "${campo}" debe ser uno de: ${regla.enum.join(', ')}`,
        );
        continue;
      }

      if (regla.regex && !regla.regex.test(String(valor))) {
        errores.push(regla.mensaje ?? `El campo "${campo}" tiene un formato inválido`);
      }
    }

    if (errores.length > 0) {
      return res.status(400).json({ error: errores[0], detalles: errores });
    }

    req.body = body;
    next();
  };
}
