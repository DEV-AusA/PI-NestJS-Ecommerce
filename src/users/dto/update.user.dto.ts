import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";


export class UpdateUserDto {

    @IsNumber()
    readonly id?: number;

    @IsString()
    @IsEmail()
    readonly email?: string;
  
    @IsString()
    @MinLength(3)
    readonly name?: string;
  
    @IsString()
    readonly password?: string;
  
    @IsString()
    readonly address?: string;
  
    @IsString()
    @IsNumber()
    readonly phone?: number;
  
    @IsString()
    readonly country?: string;
  
    @IsString()
    readonly city?: string;
}