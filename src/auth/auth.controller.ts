import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/auth.login.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { DateAdderInterceptor } from '../interceptors/dateAdder.interceptor';
import { FilterPasswordInterceptor } from '../interceptors/filterPassword.interceptor';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleOAuthGuard } from '../guards/GoogleOAuth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  @UseInterceptors(FilterPasswordInterceptor)
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Ya existe un usuario registrado con ese email.',
  })
  signUn(@Body() createUserDto: CreateUserDto, @Req() request) {
    const registerOk = this.authService.signUp({
      ...createUserDto,
      created_at: request.createdAt,
    });
    return registerOk;
  }

  @HttpCode(200)
  @Post('signin')
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({
    status: 401,
    description:
      'Email o password incorrectos, verifique los datos e intentelo nuevamente.`',
  })
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
    return { message: 'Regitro mediante Auth0 exitoso.' };
  }

  @Get('google')
  signInRedirect() {
    return `<a href="/auth/google/signin"> Autenticar con google </a>`;
  }

  // redirection to OAuth
  @Get('google/signin')
  @UseGuards(GoogleOAuthGuard)
  signInGoogle(@Req() request: any) {
    console.log(request);
  }

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  signInGoogleRedirect(@Req() request: any) {
    console.log(request);

    // return this.authService.signIn(request);
  }
}
