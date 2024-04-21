import { PartialType } from "@nestjs/swagger";
import { ProductItemDto } from "./products.dto";

export class UpdateProductDto extends PartialType(ProductItemDto){}