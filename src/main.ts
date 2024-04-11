import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DataLoaderService } from './helpers/preload.data.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // implemento el middleware de log de paths
  app.use(loggerGlobal);
  // GlobalPipe para validacion de datos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validar DTO
      forbidNonWhitelisted: true,
    })
  );

  // preload data
  const dataLoaderService = app.get(DataLoaderService);
  // await dataLoaderService.loadProductsFromJson();
  await dataLoaderService.loadUsersFromJson();

  await app.listen(3000);
}
bootstrap();
