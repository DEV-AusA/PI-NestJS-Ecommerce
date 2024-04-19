import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { UsersRepository } from '../../src/users/users.repository';
import { User } from '../../src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthRepository', () => {

  let authRepository: AuthRepository;  
  let mockUserRepositoryTypeOrm: Repository<User>;
  let mockUserRepository: Partial<UsersRepository>;

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
        AuthRepository,
        JwtService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(User), //genera un token unico para el repositorio de TypeORM asociado a la entidad User
          useClass: Repository,
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    mockUserRepositoryTypeOrm = module.get<Repository<User>>(getRepositoryToken(User));
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

  // TODO *** REFACTORIZAR EL CODIGO PARA LOS TEST ***

  it('AuthRepository to be defined', () => {
    expect(authRepository).toBeDefined();
  });

  it('SignUp: create new user with hashed password', async () => {
    jest.spyOn(mockUserRepositoryTypeOrm, 'findOneBy').mockResolvedValueOnce(undefined);
    const newUser = await authRepository.signUp(mockUser as User); // as User para evitar los otros campos

    expect(newUser).toBeDefined();
    expect(newUser.password).not.toEqual(mockUser.password);
  });  

});
