import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';

@Injectable()
export class ProductsService {
  // injecto la dependencia ProductsRepository
  constructor(private readonly productsRepository: ProductsRepository) {}

  getProducts(paginationProductDto: PaginationProductDto) {
    const products = this.productsRepository.getProducts(paginationProductDto);

    return products;
  }

  getProductById(id: number) {
    const productById = this.productsRepository.getProductById(id);
    return productById;
  }

  createProduct(productDto: ProductDto) {
    const messageNewProduct = this.productsRepository.createProduct(productDto);
    return messageNewProduct;
  }

  updateProduct(id:number, updateProductDto: UpdateProductDto){
    const messageUpdateProduct = this.productsRepository.updateProduct(id, updateProductDto);
    return messageUpdateProduct;
  }

  deleteProduct(id: number) {
    const messageDeleteProduct = this.productsRepository.deleteProduct(id);
    return messageDeleteProduct;
  }
}
