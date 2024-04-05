import { IsBoolean, IsNumber, IsString, IsUrl, Length } from "class-validator";

export class UpdateProductDto {

    @IsNumber()
    readonly id?: number;

    @IsString()
    @Length(3)
    readonly name?: string;
  
    @IsString()
    readonly description?: string;
  
    @IsNumber()
    readonly price?: number;
  
    @IsBoolean()
    readonly stock?: boolean;
  
    @IsString()
    @IsUrl()
    readonly imgUrl?: string;
}