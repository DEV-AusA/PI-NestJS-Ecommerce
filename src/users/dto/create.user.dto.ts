import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches( /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: `La contraseña  debe tener una Letra en mayuscula, una minuscula y un numero.`} )
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly address: string;

  @IsNotEmpty()
  @IsNumber()
  readonly phone: number;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  readonly country?: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  readonly city?: string;
  
  // @IsDate()
  readonly created_at: Date;
}
