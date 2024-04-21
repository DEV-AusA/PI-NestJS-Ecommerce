import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class FindNameUserDto {

  /**
   * Nombre del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 3 y 50 caracteres.
   * @example 'Juan Pérez'
   */
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name?: string;

}
