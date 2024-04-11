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
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*\s).{8,15}$/,
    { message: `La contraseña debe tener minimo 8 digitos, una letra en mayuscula, una minuscula , un numero y un caracter especial.`}
  )
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
  @MinLength(3)
  @MaxLength(20)
  readonly country?: string;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  readonly city?: string;

  readonly last_login?: Date;
  
  // @IsDate()
  readonly created_at: Date;
}
