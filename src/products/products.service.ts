import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';

@Injectable()
export class ProductsService {
  // injecto la dependencia ProductsRepository
  constructor(private readonly productsRepository: ProductsRepository) {}

  createProductEmbedding(produc: any) {
    throw new Error('Method not implemented.');
  }

  getProducts(paginationProductDto: PaginationProductDto) {
    const products = this.productsRepository.getProducts(paginationProductDto);
    return products;
  }

  getProductByName(name: string) {
    return this.productsRepository.getProductByName(name);
  }

  getProductById(id: string) {
    const productById = this.productsRepository.getProductById(id);
    return productById;
  }

  findRelationsCategory(id: string) {
    const findRelationsProduct = this.productsRepository.findRelationsCategory(id);
    return findRelationsProduct;
  }

  createProduct(productDto: ProductDto | ProductDto[]) {
    const messageNewProduct = this.productsRepository.createProduct(productDto);
    return messageNewProduct;
  }

  updateProduct(id:string, updateProductDto: UpdateProductDto){
    const messageUpdateProduct = this.productsRepository.updateProduct(id, updateProductDto);
    return messageUpdateProduct;
  }

  deleteProduct(id: string) {
    const messageDeleteProduct = this.productsRepository.deleteProduct(id);
    return messageDeleteProduct;
  }
}
