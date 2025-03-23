export const commonConfig = {
  port: () => Number(process.env.PORT) || 3000,
  serverURL: () => process.env.SERVER_URL || 'http://localhost:3000',
  clientURL: () => process.env.CLIENT_URL || 'http://localhost:5000',
  isProduction: () => process.env.NODE_ENV === 'production',
  nodeEnv: () => process.env.NODE_ENV,
};
