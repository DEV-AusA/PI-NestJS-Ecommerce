import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginDataDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(15)
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: `La contraseña  debe tener una Letra en mayuscula, una minuscula y un numero.`}
    // )
    password: string;
}