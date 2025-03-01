export const authConfig = {
  passwordSalt: () => Number(process.env.USER_PASSWORD_SALT) || 10,

  sessionSecret: () => process.env.SESSION_SECRET || 'password',
  sessionCleanupLimit: () => 10,
  sessionMaxAge: () => 2500000,

  nameMinLen: () => 3,
  nameMaxLen: () => 30,
  passwordMinLen: () => 8,
  passwordMaxLen: () => 100,
};
