import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDataDto } from './dto/auth.login.dto';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository,
    @InjectRepository(User)
    // private readonly userRespository: UsersRepository,
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService, 
  ){}

  async signUp(createUserDto: CreateUserDto) {

    const emailUser = await this.userRepository.findOneBy( { email: createUserDto.email} );
    // const emailUser = await this.userRespository.findOneBy({ email: createUserDto.password });
    if(emailUser) throw new BadRequestException(`Ya existe un usuario registrado con ese email.`);

    const registerOk = await this.authRepository.signUp(createUserDto);
    return registerOk;
  }

  async signIn(loginDataDto: LoginDataDto) {
    // valido el user
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
      isAdmin: user.isAdmin, // cargo el rol para verificarlo con el role.Guard
    };
    // firmo el newToken
    const token = this.jwtService.sign(userPayload);
    await this.userRepository.update({ id: user.id }, { last_login: new Date }); // update login user
    const loginOk = { message: `Bienvenido nuevamente ${user.name}.`, token }
    return loginOk;
  }
}
