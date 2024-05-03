import { ApiHideProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Matches, MinLength } from 'class-validator';

export class ProductItemDto {

  /**
   * Nombre del producto.
   * @description Debe ser una cadena no vacía con al menos 3 caracteres.
   * @example 'Dell Ultrasharp U2312HM'
   */  
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Matches(
    /^[a-zA-Z0-9]+$/,
    { message: `El nombre no debe contener caracteres especiales.` }
  )
  readonly name: string;

  @ApiHideProperty()
  @IsNumber()
  @IsArray()
  @IsOptional()
  readonly nameEmbedding?: number[];

  /**
   * Descripción del producto.
   * @description Debe ser una cadena no vacía.
   * @example 'El monitor Dell Ultrasharp U2312HM es un modelo de 23 pulgadas con una pantalla IPS de alta resolución y ángulos de visión amplios. Ofrece una experiencia visual nítida y precisa para trabajos gráficos y multimedia. Con su diseño elegante y ergonómico, ajustable en altura y ángulo de inclinación, proporciona comodidad y versatilidad. Además, cuenta con múltiples puertos de conectividad para una fácil integración con tus dispositivos.'
   */
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiHideProperty()
  @IsNumber()
  @IsArray()
  @IsOptional()
  readonly descriptionEmbedding?: number[];

  /**
   * Precio del producto.
   * @description Debe ser un número positivo no vacío.
   * @example 249.99
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  /**
   * Stock del producto.
   * @description Debe ser un número positivo no vacío.
   * @example 50
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly stock: number;

  /**
   * URL de la imagen del producto opcional.
   * @description Debe ser una cadena URL válida.
   * @example 'https://example.com/product.jpg'
   */
  @IsOptional()
  @IsString()
  @IsUrl()
  readonly imgUrl?: string;

  /**
   * Categoría o categorías del producto.
   * @description Debe ser una cadena o un array de cadenas no vacías.
   * @example '[Television, Monitor]'
   */
  @IsNotEmpty()
  @IsString({ each: true })
  readonly category: string[] | string
}
