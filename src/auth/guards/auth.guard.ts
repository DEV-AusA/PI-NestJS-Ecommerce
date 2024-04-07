import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateRequest } from 'src/helpers/validate-request.helper';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {

  // constructor(
  //   private readonly userRepository: UsersRepository
  // ) {
  //   // Aquí podrías cargar tus usuarios de alguna fuente de datos
  //   // Por ejemplo, una base de datos o algún otro servicio
  //   // Para simplificar, los usuarios están en un objeto en memoria
  //   const users =this.userRepository.getUsers()
  // }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // importo helper de validacion de request
    return validateRequest(request);
  }
}
