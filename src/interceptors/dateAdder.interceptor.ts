import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class DateAdderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const created = new Date()

    const formatDate = created.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      // hour: 'numeric',
      // minute: '2-digit'
    })
    const request = context.switchToHttp().getRequest() //obtengo la request
    // agrego la prop a la request
    request.createdAt = formatDate;
    return next.handle();
  }
}
