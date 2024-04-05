import { Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/auth.login.dto';
import { IHeadersData } from './interfaces/headers.data.interface';
import { decodeBasicAuth } from 'src/helpers/decode-basic-auth.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get()
  // getAuth() {
  //   const auth = this.authService.get();
  //   return auth;
  // }

  @Post('sigin')
  signIn(@Headers() headersData: IHeadersData) {
 
    const loginDataDto: LoginDataDto = decodeBasicAuth(headersData);  // function decodeBasic de helper

    const messageLogin = this.authService.signIn(loginDataDto);
    
    return messageLogin;
    
  }
}
