import { IsBoolean, IsNumber, IsPositive, IsString, IsUrl, Length } from "class-validator";

export class UpdateProductDto {

    @IsNumber()
    readonly id?: number;

    @IsString()
    @Length(3)
    readonly name?: string;
  
    @IsString()
    readonly description?: string;
  
    @IsNumber()
    @IsPositive()
    readonly price?: number;
  
    @IsNumber()
    readonly stock?: number;
  
    @IsString()
    @IsUrl()
    readonly img_url?: string;
}