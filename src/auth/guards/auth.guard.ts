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

    const request = context.switchToHttp().getRequest();
    const isToken = request.headers['authorization'];
    if(!isToken) throw new UnauthorizedException('Necesitas autorizacion para esta seccion.');
    
    // tomo el valor del Bearer
    const token = request.headers['authorization'].split(' ')[1] ?? '';

    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret }); //verificacion de la clase secret
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);
      // payload.roles = [ 'admin' ];
      request.user = payload;
      // console.log(payload);      
      return true;

    }
    catch (error) {
      throw new UnauthorizedException(`Token invalido`)
    }
    // importo helper de validacion de request
    // return validateRequest(request);
  }
}
