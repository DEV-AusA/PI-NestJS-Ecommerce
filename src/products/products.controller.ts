import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Response } from 'express';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('products')
export class ProductsController {
  // injecto la dependencia ProductsService
  constructor(
    private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(@Query() paginationProductDto: PaginationProductDto) {
    const products = this.productsService.getProducts(paginationProductDto);
    return products;
  }

  @Get(':id')
  getProducById(@Param('id') id: string){
    const productById = this.productsService.getProductById(+id);
    return productById;
  }

  @Post()
  @UseGuards(AuthGuard)
  createProduct(@Body() productDto: ProductDto){
    const messageNewProduct = this.productsService.createProduct(productDto);
    return messageNewProduct;
  }

  // @Post('seeder')
  // @UseGuards(AuthGuard)
  // addProduct(@Body() createProductDto: CreateProductDto){
  //   return;
  // }
  
  @Put(':id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id') id: string,
    @Body() updateProducDto: UpdateProductDto) {
      const messageUpdateProduct = this.productsService.updateProduct(+id, updateProducDto);
    return messageUpdateProduct;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id') id:string){
    const messageDeleteProduct = this.productsService.deleteProduct(+id);
    return messageDeleteProduct;
  }
}
