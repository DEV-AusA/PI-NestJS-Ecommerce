import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDataDto } from "./dto/auth.login.dto";
import { UsersRepository } from "../users/users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { DataSource, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dto/create.user.dto";

@Injectable()
export class AuthRepository {

    constructor(
        private readonly userRepository: UsersRepository,
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // private readonly dataSource: DataSource,
    ){}

    async signUp(createUserDto: CreateUserDto) {

        // // transaction
        // const queryRunner = this.dataSource.createQueryRunner();
        // await queryRunner.connect()
        // await queryRunner.startTransaction()

        // try {
        //     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        //     const newUser = await this.userRepository.create({
        //         ...createUserDto,
        //         password: hashedPassword,
        //         last_login: new Date,
        //     });
        //     console.log(newUser);
            
        //     const userSaved = await queryRunner.manager.save(newUser);
        //     await queryRunner.commitTransaction();

        //     return userSaved;
        
        // }
        // catch (error) {
        //     await queryRunner.rollbackTransaction()
        //     throw new BadRequestException(` Error al crear la cuenta`)
        // }
        // finally{
        //     await queryRunner.release();
        // }
        
        // bcrypt en action
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 nivel de seguridad
        // cargo user completo
        const registerOk = await this.userRepository.createUser({ ...createUserDto, password: hashedPassword, last_login: new Date});

        // const registerOk = { message: `Usuario creado correctamente`, registerOk};        
        return registerOk;
    }
}