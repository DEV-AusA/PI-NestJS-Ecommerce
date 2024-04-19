import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { ProductItemDto } from "./products.dto";
import { Type } from "class-transformer";

export class MultipleProductsDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductItemDto)
    readonly products: ProductItemDto[];
  }