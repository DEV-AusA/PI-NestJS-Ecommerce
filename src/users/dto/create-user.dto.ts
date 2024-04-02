import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class createUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly address: string;

  @IsString()
  @IsNumber()
  readonly phone: number;

  @IsString()
  readonly country?: string | undefined;

  @IsString()
  readonly city?: string | undefined;
}
