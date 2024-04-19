import { PartialType } from "@nestjs/mapped-types";
import { ProductItemDto } from "./products.dto";

export class UpdateProductDto extends PartialType(ProductItemDto){}