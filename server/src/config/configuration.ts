import { authConfig } from './auth.config';
import { commonConfig } from './common.config';
import { PostgresConfig } from './postgres.config';

export const appConfig = {
  common: commonConfig,
  auth: authConfig,
  postgres: PostgresConfig,
};
