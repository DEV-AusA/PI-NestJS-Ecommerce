import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDataDto } from './dto/auth.login.dto';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create.user.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService, 
  ){}

  async signUp(createUserDto: CreateUserDto) {

    const emailUser = await this.userRepository.findOneBy( { email: createUserDto.email} );
    if(emailUser) throw new BadRequestException(`Ya existe un usuario registrado con ese email.`);

    const registerOk = await this.authRepository.signUp(createUserDto);
    return registerOk;
  }

  async signIn(loginDataDto: LoginDataDto) {

    const user = await this.userRepository.findOneBy({ email: loginDataDto.email });

    if(!user) throw new UnauthorizedException(`Email o password incorrectos, verifique los datos e intentelo nuevamente.`);
    // valido el password
    const passwordValid = await bcrypt.compare(loginDataDto.password, user.password);
    if(!passwordValid) throw new UnauthorizedException(`Email o password incorrectos, verifique los datos e intentelo nuevamente.`);
    // preparo datos para la firma
    const userPayload= {
      // cargo datos para el cuerpo del payload
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin, // rol to role.Guard verify
    };
    const token = this.jwtService.sign(userPayload); //sign
    await this.userRepository.update({ id: user.id }, { last_login: new Date }); // update login user
    const loginOk = { message: `Bienvenido nuevamente ${user.name}.`, token }
    return loginOk;
  }
}
