import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DataLoaderService } from './helpers/preload.data.helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription(
      `
  ¡Bienvenido a la API de ecommerce! Esta API está diseñada para proporcionar acceso a una variedad de recursos relacionados con la gestión de productos, usuarios y ordenes en nuestra plataforma de ecommerce.
  Esta desarrollada con NestJS y se utiliza como demostración para el Modulo 4 del programa de especialización en Backend de la carrera de Desarrollo Fullstack en Henry.
  La API de este ecommerce requiere autenticación para ciertas operaciones.
  Utilizamos JSON Web Tokens (JWT) para autenticar a los usuarios.
  Para obtener un token JWT, inicia sesión utilizando el endpoint /auth/signin.
  `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use(loggerGlobal); // midd-loginLog global
  // app.use(auth(configAuth0)); // auth0
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validar DTO
      forbidNonWhitelisted: true,
    }),
  );

  // preload data
  const dataLoaderService = app.get(DataLoaderService);
  await dataLoaderService.loadUsersFromJson();

  await app.listen(3000);
}
bootstrap();
