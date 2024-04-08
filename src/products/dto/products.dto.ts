import { IsArray, IsBoolean, IsNumber, IsPositive, IsString, IsUrl, Length } from 'class-validator';

export class ProductDto {
  @IsString()
  @Length(3)
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsNumber()
  readonly stock: number;

  @IsString()
  @IsUrl()
  readonly imgUrl: string;

  @IsString({ each: true })
  // @IsArray()
  readonly category: string[] | string
}
