export const authConfig = {
  // user creation configuration
  passwordSalt: () => Number(process.env.USER_PASSWORD_SALT) || 10,

  // sessions configuration
  sessionSecret: () => process.env.SESSION_SECRET || 'password',
  sessionCleanupLimit: () => 10,
  sessionMaxAge: () => 2_500_000, // seconds

  // verification code configuration
  verificationTokenLength: () => 96, // len / 4 * 3
  verificationTokenMaxAge: () => 3_600_000, // ms (one hour)
  verificationCleanupLimit: () => 10,

  // not active users configuration
  notActiveUserMaxAge: () => 2_592_000_000, // ms (one month)
  notActiveUserCleanupLimit: () => 10,

  // mailer configuration
  mailerHost: () => process.env.MAILER_HOST || 'host',
  mailerPort: () => Number(process.env.MAILER_PORT) || 25,
  mailerUsername: () => process.env.MAILER_USERNAME || 'username',
  mailerPassword: () => process.env.MAILER_PASSWORD || 'password',

  // auth dto configuration
  nameMinLen: () => 3,
  nameMaxLen: () => 30,
  passwordMinLen: () => 8,
  passwordMaxLen: () => 100,
};
