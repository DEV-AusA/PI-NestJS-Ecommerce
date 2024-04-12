import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DataLoaderService } from './helpers/preload.data.helper';
import { auth } from 'express-openid-connect';
import { config as configAuth0 } from 'config/auth0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // implemento el middleware de log de paths
  app.use(loggerGlobal);
  // login 3° de Auth0
  app.use(auth(configAuth0));
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
