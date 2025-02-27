import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session({
      secret: process.env.SESSION_SECRET_KEY || 'db11276e7e027cb7fc8ff0e0d25f09682c99bc77cb1d25b053cfe4103efe33b7',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2500000,
        sameSite: 'strict',
      },
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
