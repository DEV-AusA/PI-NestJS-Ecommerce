import { Injectable } from '@nestjs/common';
import { LoginDataDto } from './dto/auth.login.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {

  constructor(
    private readonly authRepository: AuthRepository){}

  // get() {
  //   const auth = {
  //     message: `Get auth here.`,
  //   };    
  //   return auth;
  // }

  signIn(loginDataDto: LoginDataDto) {
    const messageLogin = this.authRepository.signIn(loginDataDto);
    return messageLogin;
  }
}
