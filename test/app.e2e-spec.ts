import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ClassSerializerInterceptor, HttpStatus, INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {config as dotenvConfig} from 'dotenv';
import { AuthModule } from '../src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { configJwt } from '../config/jwt.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeormConfigTest from '../config/typeormTest.config';
import { UsersModule } from '../src/users/users.module';
import { Reflector } from '@nestjs/core';
import { LoginDataDto } from '../src/auth/dto/auth.login.dto';
import { DataLoaderService } from '../src/helpers/preload.data.helper';


dotenvConfig({ path: '.development.env' });

describe('APP-ECCOMERCE Test (E2E)', () => {

    let app: INestApplication;

    let mockUser: Partial<User>;
    let mockLoginUser: LoginDataDto;
    let mockLoginAdmin: LoginDataDto;
  
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [typeormConfigTest]
                }),
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => configService.get('typeormTest'),
                }),
                AppModule,
                // AuthModule,
                // UsersModule,
                // JwtModule.register( configJwt ), // jwt.config
            ],
        })
        .compile();

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

        // preload data
        const dataLoaderService = app.get(DataLoaderService);
        await dataLoaderService.loadUsersFromJson();

        await app.init();
    });

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
    };

    mockLoginUser = {
        email: 'usuario@gmail.com',
        password: 'Hol@1234',
        confirmPassword: 'Hol@1234'
    }

    mockLoginAdmin = {
        email: 'cesarausa@gmail.com',
        password: 'Hol@1234',
        confirmPassword: 'Hol@1234'
    }

    describe('Auth (e2e)', () => {        
        
        describe('Auth : Rol User', () => {

            it('POST /auth/signup : the new user should not be a created if the email is incorrect format', async () => {
                
                const req = await request(app.getHttpServer())
                .post(`/auth/signup`)
                .send({...mockUser, email: 'correo.mail.com'})            
                
                expect(req.status).toBe(HttpStatus.BAD_REQUEST);
                expect(req.body.message).toEqual(['email must be an email']);
            });

    
            it('POST /auth/signup : a new user not be a created if the passwors is incorrect format', async () => {
    
                const req = await request(app.getHttpServer())
                .post('/auth/signup')
                .send({...mockUser, password: 1234})                
                
                expect(req.status).toBe(HttpStatus.BAD_REQUEST);
            });

            it('POST /auth/signup : A new user must be a created', async () => {
                
                const req = await request(app.getHttpServer())
                .post(`/auth/signup`)
                .send(mockUser)        
                
                expect(req.status).toBe(HttpStatus.CREATED);
            });

            it('POST /auth/signup : throw error if the email alredy exists', async () => {
                let req: any;
                
                try {
                    req = await request(app.getHttpServer())
                    .post(`/auth/signup`)
                    .send(mockUser)                               
                    
                } catch (error) {
                    expect(req.status).toBe(HttpStatus.BAD_REQUEST);
                    expect(error).toBeInstanceOf(BadRequestException);
                    expect(error.message).toEqual('Ya existe un usuario registrado con ese email.');                  
                }
            });

            it('POST /auth/signin User: throw error if the user not exist', async () => {
                let response: any;

                try {
                    response = await request(app.getHttpServer())
                    .post('/auth/signin')
                    .send({...mockLoginUser, email: 'pepe@gmail.com'})       
                    
                } catch (error) {
                    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
                    expect(error).toBeInstanceOf(UnauthorizedException);
                    expect(error.message).toEqual('Email o password incorrectos, verifique los datos e intentelo nuevamente.');
                }
 
            });

            it('POST /auth/signin User: throw error if the password not match', async () => {
                let response: any;

                response = await request(app.getHttpServer())
                .post('/auth/signin')
                .send({...mockLoginUser, confirmPassword: 'Hol@12345'}) 

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body.message).toEqual(['Las contraseñas no coinciden.']);
   
            });

            it('POST /auth/signin User: the user must have a successful login', async () => {
    
                const response = await request(app.getHttpServer())
                .post('/auth/signin')
                .send(mockLoginUser)
            
                expect(response.status).toBe(HttpStatus.OK); // login ok
                expect(response.body.token).toBeDefined(); // token ok   
                // expect(response.body).toEqual({ message: `Bienvenido nuevamente ${mockUser.name}.`, token })
            });
        });

        describe('Auth : Rol Admin', () => {
            
            it('POST /auth/signin Admin: the user admin must have a successful login', async () => {
        
                const response = await request(app.getHttpServer())
                .post('/auth/signin')
                .send(mockLoginAdmin)
        
                const token = response.body.token; // get token
        
                const protectedRoute = await request(app.getHttpServer())
                .get(`/users`)
                .set('Authorization', `Bearer ${token}`);
                        
                expect(protectedRoute.status).toBe(HttpStatus.OK);
            });
        });
    })  
  
    describe('Users (e2e)', () => {

        let tokenAdmin: string;
        let tokenUser: string;
        let userId: string;

        describe('Users : Rol User', () => {

            it('GET /users a user cannot enter a route /users without authorization', async ()=> {
                const response = await request(app.getHttpServer())
                .get('/users')
                .send(mockLoginUser)             

                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
            });

            it('PUT /users/:id a user can modify your information', async ()=> {

                const loginAdmin = await request(app.getHttpServer())
                .post('/auth/signin')
                .send(mockLoginAdmin)        
                tokenAdmin = loginAdmin.body.token;
        
                const getUsers = await request(app.getHttpServer())
                .get(`/users`)
                .set('Authorization', `Bearer ${tokenAdmin}`);

                const user = getUsers.body.find((user) => user.email === 'usuario@gmail.com');
                userId = user.id;
                
                const loginUser = await request(app.getHttpServer())
                .post('/auth/signin')
                .send(mockLoginUser)
                tokenUser = loginUser.body.token;

                const response = await request(app.getHttpServer())
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${tokenUser}`)
                .send({name: "Nombre Actualizado"})                           
                        
                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body.message).toEqual(`Datos del usuario con Id ${userId} actualizados correctamente.`);
            })

            it('PUT /users/:id should not access to path if not have a valid format of id', async ()=> {
                const response = await request(app.getHttpServer())
                .put(`/users/abcd-1234-abcd`)
                .set('Authorization', `Bearer ${tokenUser}`)     

                expect(response.status).toBe(HttpStatus.BAD_REQUEST);
                expect(response.body.message).toEqual(`Validation failed (uuid is expected)`)
            });

            it('GET /users/:id should not access to path if not have a valid token', async ()=> {
                const response = await request(app.getHttpServer())
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer 12345`)      

                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
                expect(response.body.message).toEqual(`Token invalido`)
            });

            it('GET /users/:id should not return a user if not logged', async ()=> {
                const response = await request(app.getHttpServer())
                .get(`/users/${userId}`)                 

                expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
                expect(response.body.message).toEqual(`Necesitas loguearte para acceder a esta seccion.`)
            });

            it('GET /users/:id should return a user', async ()=> {
                const response = await request(app.getHttpServer())
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${tokenUser}`)   

                expect(response.status).toBe(HttpStatus.OK);
            });


            it('DELETE /users/:id the user can delete your account', async() => {

                const loginUser = await request(app.getHttpServer())
                .post('/auth/signin')
                .send(mockLoginUser)
        
                tokenUser = loginUser.body.token;

                const response = await request(app.getHttpServer())
                .del(`/users/${userId}`)
                .set('Authorization', `Bearer ${tokenUser}`)

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body.message).toEqual(`Usuario con id ${userId} eliminado correctamente.`)
            })
            
        })

        describe('Users : Rol Admin', ()=> {

            it('GET /users find all users', async()=> {
                const response = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${tokenAdmin}`)                

                expect(response.status).toBe(HttpStatus.OK);
                expect(response.body).toBeInstanceOf(Array);
            })

            it('GET /users/:id find a user by name', async ()=> {
                const response = await request(app.getHttpServer())
                .get('/users')
                .query({ name: 'Cesar Ausa' })
                .set('Authorization', `Bearer ${tokenAdmin}`)

                expect(response.status).toBe(HttpStatus.OK);
            })            
        })
    })
  afterAll(async () => {
    await app.close(); // cierra la conectio al terminar los tests
  });
});
