import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { appConfig } from './config/configuration';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));
  app.useGlobalPipes(new I18nValidationPipe());
  app.use(
    session({
      secret: appConfig.auth.sessionSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: appConfig.isProduction(),
        maxAge: 2500000,
        sameSite: 'strict',
      },
    })
  );
  await app.listen(appConfig.port());
}
bootstrap();
