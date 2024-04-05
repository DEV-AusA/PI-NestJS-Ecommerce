import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Response } from 'express';
import { CreateProductDto } from './dto/create.product.dto';
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

  // // response custom
  // @Get('message')
  // getMessage(@Res() res: Response){
  //   res.status(200).json({
  //     message: `Este es un message custom`
  //   })
  // }

  @Get(':id')
  getProducById(@Param('id') id: string){
    const productById = this.productsService.getProductById(+id);
    return productById;
  }

  @Post()
  @UseGuards(AuthGuard)
  createProduct(@Body() createProductDto: CreateProductDto){
    const messageNewProduct = this.productsService.createProduct(createProductDto);
    return messageNewProduct;
  }
  
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
