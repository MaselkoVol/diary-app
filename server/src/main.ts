import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { appConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
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
