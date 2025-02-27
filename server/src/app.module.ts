import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'],
    }),
  ],
  providers: [],
})
export class AppModule {}
