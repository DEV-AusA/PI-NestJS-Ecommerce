import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CreateUserDto } from 'src/users/dto/create.user.dto';

@Injectable()
export class FilterPasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // obtengo la data de la response
    const response = next.handle().pipe(
      map(data => {
        
        return Array.isArray(data) // retorna un array  
        ? data.map(obj => this.filterPassword(obj))   // si es un array filtra el password del mismo y lo retorna
        : this.filterPassword(data); // si no es un array lo filtra del objeto y lo retorna

      }),
    );

    return response;
  }

  // metodo para filtrar el password
  private filterPassword(createUserDto: CreateUserDto): Omit<CreateUserDto, 'password'>{ // uso el Omit para utilizar el mismo DTO y omitir el password en el return
    // Destructuro y solo uso el resto del profile
    const { password, ...profile } = createUserDto;
    return profile;
  }
}
