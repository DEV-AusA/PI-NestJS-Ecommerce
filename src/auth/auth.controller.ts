import { Body, Controller, Get, Headers, Post, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/auth.login.dto';
import { IHeadersData } from './interfaces/headers.data.interface';
import { decodeBasicAuth } from 'src/helpers/decode-basic-auth.helper';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { DateAdderInterceptor } from 'src/interceptors/dateAdder.interceptor';
import { FilterPasswordInterceptor } from 'src/interceptors/filterPassword.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor) // interceptor filter DateAdd
  @UseInterceptors(FilterPasswordInterceptor) // interceptor filter password
  signUn(@Body() createUserDto: CreateUserDto, @Req() request) {
 
    const registerOk = this.authService.signUp({...createUserDto, created_at: request.createdAt});    
    return registerOk;    
  }

  @Post('signin')
  signIn(@Body() loginDataDto: LoginDataDto) {
  // signIn(@Headers() headersData: IHeadersData) {
    // const loginDataDto: LoginDataDto = decodeBasicAuth(headersData);  // function decodeBasic de helper 

    const messageLogin = this.authService.signIn(loginDataDto);    
    return messageLogin;    
  }
}
