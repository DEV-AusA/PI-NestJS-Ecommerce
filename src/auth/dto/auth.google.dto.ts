import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthGoogle {
  /**
   * Nombre del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 3 y 50 caracteres.
   * @example 'Juan'
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
   * Nombre del usuario.
   * @description Debe ser una cadena no vacía con longitud entre 3 y 50 caracteres.
   * @example 'Pérez'
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: `El apellido no debe contener caracteres especiales.`,
  })
  readonly lastName: string;

  /**
   * Correo electrónico del usuario.
   * @description Debe ser una cadena no vacía con formato de email válido.
   * @example 'usuario@example.com'
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly emails: string;

  /**
   * Link de la foto del usuario.
   * @description Si el usuario desea agregar una imagen, debe ser una cadena no vacia.
   * @example 'usuario@example.com'
   */
  @IsOptional()
  @IsString()
  readonly photos: string;

  /**
   * Proveedor del SignUp/SignIn.
   * @description Aca se ingresara el proveedor de donde se loguee el usuario.
   * @example 'Google'
   */
  @IsString()
  readonly provider: string;
}
