import { Body, Controller, Get, HttpCode, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/auth.login.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { DateAdderInterceptor } from '../interceptors/dateAdder.interceptor';
import { FilterPasswordInterceptor } from '../interceptors/filterPassword.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  @UseInterceptors(FilterPasswordInterceptor)
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

  @Get('auth0')
  signInAuth0(@Req() request: any) {
    //recibo la data de registro de Auth0
    console.log(request.oidc.user);
    // function que retorna true del login de Auth0
    console.log(request.oidc.isAuthenticated());    
    return {message: "Regitro mediante Auth0 exitoso."}
  }

}
