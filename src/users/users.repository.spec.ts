import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersRepository', () => {
    let usersRepository: UsersRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersRepository,
                {
                    provide: getRepositoryToken(User), //genera un token unico para el repositorio de TypeORM asociado a la entidad User
                    useClass: Repository, // cuando necesite inyectar el repositorio asociado a la entidad User, debe proporcionar un MOCKde la instancia de la clase Repository
                },
            ],
        }).compile();

        usersRepository = module.get<UsersRepository>(UsersRepository);
    });

    it('UsersRepository should be defined', () => {
        expect(usersRepository).toBeDefined();
    });
});