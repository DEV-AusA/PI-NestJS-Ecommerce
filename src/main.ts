import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DataLoaderService } from './helpers/preloa-data';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // implemento el middleware de log de paths
  app.use(loggerGlobal);
  // GlobalPipe para validacion de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // preload data
  const dataLoaderService = app.get(DataLoaderService);
  await dataLoaderService.loadCategoriesFromJson();
  await dataLoaderService.loadUsersFromJson();

  await app.listen(3000);
}
bootstrap();
