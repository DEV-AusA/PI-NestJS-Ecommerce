import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDataDto } from "./dto/auth.login.dto";
import { UsersRepository } from "src/users/users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/users/dto/create.user.dto";

@Injectable()
export class AuthRepository {

    constructor(
        private readonly userRepository: UsersRepository,
        @InjectRepository(User)
        private readonly userRespository: Repository<User>
    ){}

    async signUp(createUserDto: CreateUserDto) {
        // bcrypt en action
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 nivel de seguridad
        // cargo user completo
        const registerOk = await this.userRepository.createUser({ ...createUserDto, password: hashedPassword, last_login: new Date});

        // const registerOk = { message: `Usuario creado correctamente`, registerOk};        
        return registerOk;
    }
}