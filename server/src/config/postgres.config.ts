export const PostgresConfig = {
  host: () => process.env.POSTGRES_HOST || 'localhost',
  port: () => Number(process.env.POSTGRES_PORT) || 5432,
  username: () => process.env.POSTGRES_USER || 'admin',
  password: () => process.env.POSTGRES_PASSWORD || 'admin',
  database: () => process.env.POSTGRES_DB || 'diary-app',
};
