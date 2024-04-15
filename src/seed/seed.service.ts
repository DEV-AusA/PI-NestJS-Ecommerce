import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import * as productsData from "../helpers/preload-products.data.json";
import { ProductDto } from '../products/dto/products.dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly productRepository: ProductsRepository,
  ) {}

  async executeSeed() {

    const products = productsData as ProductDto[]; // Convierte el JSON a un array    
    await this.productRepository.createProduct(products);
    const seedLoaded = { message: 'Seed de productos cargado Correctamente' };
    return seedLoaded;
  }

}
