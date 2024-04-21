import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPassword } from "../../decorators/match.password.decorator";

export class LoginDataDto {

    /**
     * Propiedad email.
     * @description Debe ser un email valido.
     * @example 'usuario@example.com'
     */
    @IsString()
    @IsEmail()
    email: string;

    /**
     * Contraseña del usuario.
     * @description Debe tener entre 8 y 15 caracteres.
     * @example 'Password123!'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    password: string;

    /**
     * Confirmación de contraseña del usuario.
     * @description Debe coincidir con la contraseña ingresada anteriormente.
     * @example 'Password123!'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Validate(MatchPassword, ['password'])
    confirmPassword: string;
}