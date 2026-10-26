import * as repository from './estadisticas.repository.js';

const ESTADOS = [
  ['pendiente', 'Pendiente'],
  ['en-proceso', 'En proceso'],
  ['demorada', 'Demorada'],
  ['cancelada', 'Cancelada'],
  ['finalizada', 'Finalizada'],
  ['aprobada', 'Aprobada'],
  ['rechazada', 'Rechazada'],
];

const MESES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

function variacion(actual, anterior) {
  const a = Number(actual) || 0;
  const b = Number(anterior) || 0;

  if (b === 0) {
    return a === 0 ? 0 : 100;
  }

  return Math.round(((a - b) / b) * 100);
}

function rango(dias) {
  const hasta = new Date();
  const desde = new Date(hasta.getTime() - dias * 86400000);
  const desdeAnterior = new Date(desde.getTime() - dias * 86400000);

  return { desde, hasta, desdeAnterior };
}

function clavesDeMeses(desde, hasta) {
  const claves = [];
  const cursor = new Date(desde.getFullYear(), desde.getMonth(), 1);
  const fin = new Date(hasta.getFullYear(), hasta.getMonth(), 1);

  while (cursor <= fin) {
    claves.push({
      anio: cursor.getFullYear(),
      mes: cursor.getMonth() + 1,
      etiqueta: MESES[cursor.getMonth()],
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return claves;
}

export async function obtener(dias = 30) {
  const { desde, hasta, desdeAnterior } = rango(dias);

  const [
    resumen,
    sectores,
    gastosCategorias,
    gastoPersonal,
    evolucion,
    personal,
    tiempoResolucion,
    tiempoResolucionAnterior,
    estados,
  ] = await Promise.all([
    repository.obtenerResumen(desde, hasta, desdeAnterior),
    repository.obtenerSectores(desde, hasta),
    repository.obtenerGastosPorCategoria(desde, hasta),
    repository.obtenerGastoPersonal(desde, hasta),
    repository.obtenerEvolucionCompras(desde, hasta),
    repository.obtenerPersonal(desde, hasta),
    repository.obtenerTiempoResolucion(desde, hasta),
    repository.obtenerTiempoResolucion(desdeAnterior, desde),
    repository.obtenerEstados(desde, hasta),
  ]);

  const totalGastos =
    Number(resumen.gastos_compras) + Number(resumen.gastos_personal);
  const totalGastosAnterior =
    Number(resumen.gastos_compras_anterior) +
    Number(resumen.gastos_personal_anterior);

  const porCategoria = Object.fromEntries(
    gastosCategorias.map((fila) => [fila.categoria, Number(fila.valor)]),
  );

  const estadosMap = Object.fromEntries(
    estados.map((fila) => [fila.estado, Number(fila.valor)]),
  );

  const meses = clavesDeMeses(desde, hasta);
  const valoresMateriales = meses.map(({ anio, mes }) => {
    const fila = evolucion.find(
      (item) =>
        item.anio === anio &&
        item.mes === mes &&
        item.categoria === 'materiales',
    );
    return fila ? Number(fila.valor) : 0;
  });
  const valoresServicios = meses.map(({ anio, mes }) => {
    const fila = evolucion.find(
      (item) =>
        item.anio === anio &&
        item.mes === mes &&
        item.categoria === 'servicios',
    );
    return fila ? Number(fila.valor) : 0;
  });

  return {
    periodo: dias,
    kpis: [
      {
        clave: 'total-requerimientos',
        etiqueta: 'Total de requerimientos',
        valor: Number(resumen.total_requerimientos),
        variacion: variacion(
          resumen.total_requerimientos,
          resumen.total_requerimientos_anterior,
        ),
        subeEsBueno: true,
      },
      {
        clave: 'finalizadas',
        etiqueta: 'Tareas finalizadas',
        valor: Number(resumen.finalizadas),
        variacion: variacion(
          resumen.finalizadas,
          resumen.finalizadas_anterior,
        ),
        subeEsBueno: true,
      },
      {
        clave: 'en-proceso',
        etiqueta: 'Tareas en proceso',
        valor: Number(resumen.en_proceso),
        variacion: 0,
        subeEsBueno: false,
      },
      {
        clave: 'demoradas',
        etiqueta: 'Tareas demoradas',
        valor: Number(resumen.demoradas),
        variacion: 0,
        subeEsBueno: false,
      },
      {
        clave: 'rechazadas',
        etiqueta: 'Tareas rechazadas',
        valor: Number(resumen.rechazadas),
        variacion: variacion(
          resumen.rechazadas,
          resumen.rechazadas_anterior,
        ),
        subeEsBueno: false,
      },
      {
        clave: 'gastos',
        etiqueta: 'Gastos totales',
        valor: totalGastos,
        variacion: variacion(totalGastos, totalGastosAnterior),
        subeEsBueno: false,
        formato: 'moneda',
      },
    ],
    sectores,
    gastos: [
      {
        clave: 'materiales',
        nombre: 'Materiales',
        valor: porCategoria.materiales ?? 0,
      },
      {
        clave: 'personal-externo',
        nombre: 'Personal externo',
        valor: gastoPersonal,
      },
      {
        clave: 'servicios',
        nombre: 'Servicios',
        valor: porCategoria.servicios ?? 0,
      },
      {
        clave: 'otros',
        nombre: 'Otros',
        valor: porCategoria.otros ?? 0,
      },
    ],
    evolucionGastos: {
      meses: meses.map((m) => m.etiqueta),
      series: [
        {
          clave: 'materiales',
          nombre: 'Materiales',
          valores: valoresMateriales,
        },
        {
          clave: 'servicios',
          nombre: 'Servicios externos',
          valores: valoresServicios,
        },
      ],
    },
    personal: personal.map((fila) => ({
      nombre: fila.nombre,
      realizadas: Number(fila.realizadas),
      tasa:
        Number(fila.realizadas) === 0
          ? 0
          : Math.round((Number(fila.exitosas) / Number(fila.realizadas)) * 100),
    })),
    tiempoResolucion: {
      dias: tiempoResolucion,
      variacion: variacion(tiempoResolucion, tiempoResolucionAnterior),
    },
    estadoTareas: ESTADOS.map(([clave, etiqueta]) => ({
      clave,
      estado: etiqueta,
      valor: estadosMap[clave] ?? 0,
    })),
  };
}
