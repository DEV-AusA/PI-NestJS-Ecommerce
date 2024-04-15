import { Body, Controller, Get, Headers, HttpCode, Post, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/auth.login.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { DateAdderInterceptor } from '../interceptors/dateAdder.interceptor';
import { FilterPasswordInterceptor } from '../interceptors/filterPassword.interceptor';

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

  @HttpCode(200)
  @Post('signin')
  signIn(@Body() loginDataDto: LoginDataDto) {

    const messageLogin = this.authService.signIn(loginDataDto);    
    return messageLogin;    
  }
}
