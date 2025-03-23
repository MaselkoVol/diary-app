import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/configuration';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new I18nValidationExceptionFilter({ detailedErrors: false }));
  app.useGlobalPipes(new I18nValidationPipe());

  await app.listen(appConfig.common.port());
}
bootstrap();
