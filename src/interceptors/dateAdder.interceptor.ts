import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DateAdderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const created = new Date();
    const request = context.switchToHttp().getRequest();
      request.createdAt = created; // Asignar la instancia de Date en lugar de la cadena formateada
    return next.handle();
  }
}
