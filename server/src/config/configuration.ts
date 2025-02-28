import { authConfig } from './auth.config';
import { PostgresConfig } from './postgres.config';

export const appConfig = {
  port: () => Number(process.env.PORT) || 3000,
  isProduction: () => process.env.NODE_ENV === 'production',
  nodeEnv: () => process.env.NODE_ENV,
  auth: authConfig,
  postgres: PostgresConfig,
};
