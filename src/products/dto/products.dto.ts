import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl, Length } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly imgUrl: string;

  @IsNotEmpty()
  @IsString({ each: true })
  // @IsArray()
  readonly category: string[] | string
}
