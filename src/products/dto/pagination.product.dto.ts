import { IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from "class-validator";

export class PaginationProductDto {
    
    /**
     * Página de resultados.
     * @description Debe ser un número positivo (opcional).
     * @example 1
     */
    @ValidateIf((page) => typeof page.parameter === 'string')
    @IsNumber()
    @IsOptional()
    @IsPositive()
    page?: number;
    
    /**
     * Límite de productos por página.
     * @description Debe ser un número positivo (opcional).
     * @example 10
     */
    @ValidateIf((limit) => typeof limit.parameter === 'string')
    @IsNumber()
    @IsOptional()
    @IsPositive()
    limit?: number;

    
    /**
     * Nombre del producto para filtrar.
     * @description Debe ser una cadena (opcional).
     * @example 'Samsung Odyssey G7'
     */
    @IsString()
    @IsOptional()
    name?: string;
}