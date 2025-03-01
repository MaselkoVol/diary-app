import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as session from 'express-session';
import { appConfig } from 'src/config/configuration';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { Session } from './session.entity';

@Module({})
export class SessionModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: appConfig.auth.sessionSecret(),
          resave: false,
          saveUninitialized: false,
          store: new TypeormStore({
            cleanupLimit: appConfig.auth.sessionCleanupLimit(),
          }).connect(this.dataSource.getRepository(Session)),
          cookie: {
            secure: appConfig.isProduction(),
            maxAge: appConfig.auth.sessionMaxAge(),
            sameSite: 'strict',
          },
        })
      )
      .forRoutes('*');
  }
}
