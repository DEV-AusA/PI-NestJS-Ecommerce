import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductItemDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { MultipleProductsDto } from './dto/products.multiple.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

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

  createProduct(productDto: ProductItemDto) {
    const messageNewProduct = this.productsRepository.createProduct(productDto);
    return messageNewProduct;
  }

  createMultipleProducts(multipleProductsDto: MultipleProductsDto) {
    const messageNewProduct =
      this.productsRepository.createMultipleProducts(multipleProductsDto);
    return messageNewProduct;
  }

  updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const messageUpdateProduct = this.productsRepository.updateProduct(
      id,
      updateProductDto,
    );
    return messageUpdateProduct;
  }

  deleteProduct(id: string) {
    const messageDeleteProduct = this.productsRepository.deleteProduct(id);
    return messageDeleteProduct;
  }
}
