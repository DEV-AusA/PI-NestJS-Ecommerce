import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ConsultDto {
  /**
   * Consulta de búsqueda sobre elementos electrónicos en un ecommerce.
   * @description Debe ser una cadena no vacía y tener al menos 3 caracteres.
   * @example 'televisores 4K'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly consult: string;
}
