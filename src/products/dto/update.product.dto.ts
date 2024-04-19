import { PartialType } from "@nestjs/mapped-types";
import { ProductDto } from "./products.dto";

export class UpdateProductDto extends PartialType(ProductDto){}