import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dto/create.user.dto";

@Injectable()
export class AuthRepository {

    constructor(
        private readonly userRepository: UsersRepository,
    ){}

    async signUp(createUserDto: CreateUserDto) {        
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 nivel hash
        const registerOk = await this.userRepository.createUser({ ...createUserDto, password: hashedPassword, last_login: new Date});

        // const registerOk = { message: `Usuario creado correctamente`, registerOk};        
        return registerOk;
    }
}