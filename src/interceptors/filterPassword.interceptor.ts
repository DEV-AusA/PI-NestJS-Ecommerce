import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CreateUserDto } from 'src/users/dto/create.user.dto';

@Injectable()
export class FilterPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // obtengo la data de la response
    const response = next.handle().pipe(
      map(data => {
        
        return Array.isArray(data)
        ? data.map(response => this.filterPassword(response))
        : this.filterPassword(data);

      }),
    );

    return response;
  }

  private filterPassword(createUserDto: CreateUserDto): Omit<CreateUserDto, 'password'>{
    const { password, ...profile } = createUserDto;
    return profile;
  }
}
