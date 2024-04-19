import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPassword } from "../../decorators/match.password.decorator";

export class LoginDataDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Validate(MatchPassword, ['password'])
    confirmPassword: string;
}