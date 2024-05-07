import { ApiHideProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /**
   * Correo electrónico del usuario.
   * @description Debe ser una cadena no vacía con formato de email válido.
   * @example 'usuario@example.com'
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  /**
   * Nombre del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 3 y 50 caracteres.
   * @example 'Juan Pérez'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: `El nombre no debe contener caracteres especiales.`,
  })
  readonly name: string;

  /**
   * Contraseña del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 8 y 15 caracteres, que incluya al menos una mayúscula, una minúscula, un número y un carácter especial.
   * @example 'Password123!'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*\s).{8,15}$/, {
    message: `La contraseña debe tener minimo 8 digitos, una letra en mayuscula, una minuscula , un numero y un caracter especial.`,
  })
  readonly password: string;

  /**
   * Dirección del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 3 y 50 caracteres.
   * @example 'Calle Principal 123'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly address: string;

  /**
   * Número de teléfono del usuario.
   * @description Debe ser un número no vacío.
   * @example 1234567890
   */
  @IsNotEmpty()
  @IsNumber()
  readonly phone: number;

  /**
   * País del usuario (opcional).
   * @description Debe ser una cadena opcional con longitud entre 3 y 20 caracteres.
   * @example 'España'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  readonly country?: string;

  /**
   * Ciudad del usuario (opcional).
   * @description Debe ser una cadena opcional con longitud entre 3 y 20 caracteres.
   * @example 'Madrid'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  readonly city?: string;

  @ApiHideProperty()
  readonly last_login?: Date;
  @ApiHideProperty()
  readonly created_at: Date;
}
