import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { ProductItemDto } from "./products.dto";
import { Type } from "class-transformer";

export class MultipleProductsDto {

    /**
     * Lista de productos.
     * @description Debe ser un array no vacío con al menos un producto.
     * @example: [{ name: 'Sony Bravia A90J', description: 'El Sony Bravia A90J es un televisor OLED de alta gama con resolución 4K, tecnología XR OLED, Dolby Vision, Dolby Atmos, y un procesador avanzado para imágenes y sonido de calidad cinematográfica.', price: 799.99, stock: 50, category: '[Television, Monitor]' }]
     */
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => ProductItemDto)
    readonly products: ProductItemDto[];
  }