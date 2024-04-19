import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from '../../src/users/users.repository';
import { AuthRepository } from './auth.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginDataDto } from './dto/auth.login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcrypt";

describe('AuthService', () => {

  let authService: AuthService;  
  let mockUserRepository: Partial<UsersRepository>;
  let mockUserRepositoryTypeOrm: Repository<User>;
  let mockJwtService: JwtService;

  beforeEach(async () => {

    mockUserRepository = {
        createUser: (user: Partial<User>): Promise<User> => {
          return Promise.resolve({
            ...user,
            isAdmin: false,
            id: '492ad95a-33a0-43a2-9049-7ed38e6a18e0'
          } as User)
        },      
      }

    const module: TestingModule = await Test.createTestingModule({
        providers: [
            AuthService,
            JwtService,
            AuthRepository,
            {
              provide: UsersRepository,
              useValue: mockUserRepository,
            },
            {
              provide: getRepositoryToken(User),
              useClass: Repository,
            },
        ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockUserRepositoryTypeOrm = module.get<Repository<User>>(getRepositoryToken(User));
    mockJwtService = module.get<JwtService>(JwtService);
    mockUserRepositoryTypeOrm.update = jest.fn(); // metod update OMIT
  });

  const mockUser: Partial<User> = {
    id: '492ad95a-33a0-43a2-9049-7ed38e6a18e0',
    email: "usuario@gmail.com",
    name: "Usuario Nuevo",
    password: "Hol@1234",
    address: "9 de Julio",
    phone: 1122334455,
    country: "Peru",
    city: "Lima",
    created_at: new Date,
    last_login: new Date,    
    isAdmin: false,
  }
  
  const mockLoginData: LoginDataDto = {
    email: 'usuario@gmail.com',
    password: 'Hol@1234',
    confirmPassword: 'Hol@1234'
  }

  it('AuthService to be defined', () => {
    expect(authService).toBeDefined();
  });

  it('SignUp: throw error if the email alredy exists', async () => {
    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce(mockUser as User); 

    try {
      await authService.signUp(mockUser as User);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('Ya existe un usuario registrado con ese email.');
    }
  });

  it('SignUp: new user to be created', async () => {
    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce(undefined);
    const newUser = await authService.signUp(mockUser as User);
    expect(newUser).toBeDefined();
  });

  it('SignIn: throw error if the user not exist', async () => {
    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce(undefined);

    try {
      await authService.signIn(mockLoginData);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Email o password incorrectos, verifique los datos e intentelo nuevamente.');
    }
  });

  it('SignIn: throw error if the password not match', async () => {
    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce({
      ...mockUser,
      password: await bcrypt.hash(mockUser.password, 10) // hashear pass mockUser
    } as User);
    
    try {
      await authService.signIn({...mockLoginData, password: 'Hol@12345'}); // replace password
      
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toEqual('Email o password incorrectos, verifique los datos e intentelo nuevamente.');
    }
  });

  it('SignIn: must be a generate JWT token with user payload', async () => {
    
    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce(mockUser as User); //mock user finded
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true); //mock match password
    
    const mockToken = 'mockedToken'; // mock de la firma secreta
    jest.spyOn(mockJwtService, 'sign').mockReturnValue(mockToken); // firma mock
    
    const mockUserPayload = {
      id: mockUser.id,
      email: mockUser.email,
      isAdmin: mockUser.isAdmin,
    };
    // const mockUserPayload = 12345;
    
    await authService.signIn(mockLoginData); // run login
    
    expect(mockJwtService.sign).toHaveBeenCalledWith(mockUserPayload); // verificacion del payload correcto para la generacion del token
  });
  
  it('SignIn: the user must have a successful login', async () => {

    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce(mockUser as User);
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    jest.spyOn(mockJwtService, 'sign').mockReturnValue('mockedToken'); // firma mock

    const loginOk = await authService.signIn(mockLoginData);

    expect(loginOk.message).toEqual(`Bienvenido nuevamente ${mockUser.name}.`);
    expect(loginOk.token).toEqual('mockedToken'); // verify token
  });

});
