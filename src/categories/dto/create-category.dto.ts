import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
    
    /**
     * Nombre de la categoría.
     * @description Debe ser una cadena no vacía y tener como máximo 50 caracteres.
     * @example 'Electrónica'
     */
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    name: string;
}
