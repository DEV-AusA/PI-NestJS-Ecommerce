import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateOrderDto {

    /**
     * ID del usuario que realiza la orden.
     * @description Debe ser una cadena UUID no vacía.
     * @example '7a62d05a-f896-4f48-a2ed-253fbc87de36'
     */
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    /**
     * Lista de productos en la orden.
     * @description Debe ser un array no vacío con al menos un producto.
     * @example [{ id: 7a62d05a-f896-4f48-a2ed-253fbc87de36 }, { id: 1a62d05a-f896-4f48-a2ed-253fbc87de50 }]
     */
    @IsArray()
    @ArrayMinSize(1)
    products: { id: string }[];
}
