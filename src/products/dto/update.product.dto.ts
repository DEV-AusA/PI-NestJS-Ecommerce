import { PartialType } from "@nestjs/mapped-types";
import { ProductDto } from "./products.dto";
// import { IsBoolean, IsNumber, IsPositive, IsString, IsUrl, Length } from "class-validator";

// con PartialType extiendo la clase ProductDto pero todos sus parametros son opcionales
export class UpdateProductDto extends PartialType(ProductDto){

    // @IsNumber()
    // readonly id?: number;

    // @IsString()
    // @Length(3)
    // readonly name?: string;
  
    // @IsString()
    // readonly description?: string;
  
    // @IsNumber()
    // @IsPositive()
    // readonly price?: number;
  
    // @IsNumber()
    // readonly stock?: number;
  
    // @IsString()
    // @IsUrl()
    // readonly img_url?: string;
}