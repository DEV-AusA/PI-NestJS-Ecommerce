import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDataDto } from "./dto/auth.login.dto";
import { UsersRepository } from "src/users/users.repository";

@Injectable()
export class AuthRepository {

    constructor(private readonly userRepository: UsersRepository){}

    async signIn(loginDataDto: LoginDataDto) {
        const userDB = await this.userRepository.getUserByEmail(loginDataDto.email);

        if(!userDB || userDB.password !== loginDataDto.password)
        throw new UnauthorizedException(`Email o password incorrectos, verifique los datos e intentelo nuevamente.`);

        const message = { message: `Bienvenido nuevamente ${userDB.name}.` }
        // return 'token';
        return message;
    }
}