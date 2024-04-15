import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { Reflector } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {config as dotenvConfig} from 'dotenv';
import { AuthModule } from '../src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { configJwt } from '../config/jwt.config';
import { UsersModule } from '../src/users/users.module';
import { UsersRepository } from '../src/users/users.repository';
import { AuthService } from '../src/auth/auth.service';
import { AuthRepository } from '../src/auth/auth.repository';
import { AuthController } from '../src/auth/auth.controller';


dotenvConfig({ path: '.development.env' });

describe('Auth (e2e)', () => {

  let app: INestApplication;

  let mockUser: Partial<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // AppModule,
        AuthModule,
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            // dropSchema: true,
            synchronize: true,
            // logging: true, // ["error"], <= solo muestre errores de la DB
            subscribers: [],
            entities: ['dist/**/*.entity{.ts,.js}'],
            migrations: ['dist/migrations/*{.ts,.js}'],
            // timestamp: "timestamp-z",
        }),
        TypeOrmModule.forFeature([User]),
        UsersModule,
        JwtModule.register( configJwt ), // jwt.config
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthRepository, 
        UsersRepository,
        // {
        //   provide: getRepositoryToken(Products),
        //   useClass: Repository, 
        // },
      ]
    })
    // .overrideProvider(ProductsRepository)
    // .useValue(productsRepository)
    .compile();

    mockUser = {
        // id: '492ad95a-33a0-43a2-9049-7ed38e6a18e0',
        email: "usuario@gmail.com",
        name: "Usuario Nuevo",
        password: "Hol@1234",
        address: "9 de Julio",
        phone: 1122334455,
        country: "Peru",
        city: "Lima",
        // created_at: new Date,
        // last_login: new Date,    
        // isAdmin: false,
      }

    app = moduleFixture.createNestApplication();

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );  

    await app.init();
  });
  
  
  it('POST /auth/signup a new user must be a created', async () => {

    const req = await request(app.getHttpServer())
    .post(`/auth/signup`)
    .send(mockUser)
    // .expect(201)    
    // .set('authorization', `Bearer ${token}`);
    // .query({ key: 'value' }); // Aquí agregas los datos de consulta    

    console.log(req.body);    
    
    expect(req.status).toBe(HttpStatus.OK); // Verifica que la solicitud tenga un código de estado 200
    // expect(req.status).toBe(200);
    // expect(req.body).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    await app.close(); // cierra la conectio al terminar los tests
  });
});
