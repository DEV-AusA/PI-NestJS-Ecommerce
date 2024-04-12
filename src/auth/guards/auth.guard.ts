import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateRequest } from 'src/helpers/validate-request.helper';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // obtengo request del context
    const request = context.switchToHttp().getRequest();
    // valido si hay token
    const isToken = request.headers['authorization'];
    if(!isToken) throw new UnauthorizedException('Necesitas loguearte para acceder a esta seccion.');
    
    // tomo el valor despues de 'Bearer'
    const token = request.headers['authorization'].split(' ')[1] ?? '';

    try {
      const secret = process.env.JWT_SECRET; // palabra secreta de VarEnt
      const payload = this.jwtService.verify(token, { secret }); //JWT en accion, verifica la palabra secreta del token
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      payload.isAdmin
      ? payload.roles = [ 'admin' ]
      : payload.roles = [ 'user' ];
      request.user = payload; // cargo el payload como prop user de la request
            
      return true;

    }
    catch (error) {
      throw new UnauthorizedException(`Token invalido`)
    }
    // importo helper de validacion de request
    // return validateRequest(request);
  }
}
