try {
  process.loadEnvFile();
} catch {
  // Si no existe .env, se usan las variables del entorno
}

export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  PGHOST: process.env.PGHOST ?? 'localhost',
  PGPORT: Number(process.env.PGPORT ?? 5432),
  PGUSER: process.env.PGUSER ?? 'postgres',
  PGPASSWORD: process.env.PGPASSWORD ?? '',
  PGDATABASE: process.env.PGDATABASE ?? 'donbosco_mantenimiento',

  //lee process.env.JWT_SECRET
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
};

//validan que exista
if (!env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}
