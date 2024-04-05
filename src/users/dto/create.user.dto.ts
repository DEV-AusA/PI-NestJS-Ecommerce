import { IsDate, IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(10)
  // @Matches( /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: `La contraseña  debe tener una Letra en mayuscula, una minuscula y un numero.`} )
  readonly password: string;

  @IsString()
  readonly address: string;

  @IsString()
  @IsNumber()
  readonly phone: number;
  
  @IsString()
  readonly country?: string;
  
  @IsString()
  readonly city?: string;
  
  @IsString()
  @IsDate()
  readonly createdAt: string;
}
