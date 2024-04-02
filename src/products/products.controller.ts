import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  // injecto la dependencia ProductsService
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    const products = this.productsService.getProducts();
    return products;
  }
}
