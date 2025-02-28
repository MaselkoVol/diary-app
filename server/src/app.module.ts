import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';
import { User } from './users/user.entity';
import { Note } from './notes/note.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    NotesModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${appConfig.nodeEnv()}`],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: appConfig.postgres.host(),
      port: appConfig.postgres.port(),
      username: appConfig.postgres.username(),
      password: appConfig.postgres.password(),
      database: appConfig.postgres.database(),
      synchronize: !appConfig.isProduction(),
      entities: [User, Note],
    }),
  ],
  providers: [],
})
export class AppModule {}
