import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  // injecto la dependencia ProductsRepository
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts() {
    const products = this.productsRepository.getProducts();

    return products;
  }
}
