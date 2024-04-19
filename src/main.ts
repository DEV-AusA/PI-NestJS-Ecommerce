import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DataLoaderService } from './helpers/preload.data.helper';
import { auth } from 'express-openid-connect';
import { config as configAuth0 } from '../config/auth0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal); // midd-loginLog global
  app.use(auth(configAuth0)); // auth0
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validar DTO
      forbidNonWhitelisted: true,
    })
  );

  // preload data
  const dataLoaderService = app.get(DataLoaderService);
  await dataLoaderService.loadUsersFromJson();

  await app.listen(3000);
}
bootstrap();
