import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { ProductEmbeddingDto } from './dto/productEmbedding.dto';

@Controller('products')
export class ProductsController {
  
  constructor(
    private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(
    @Query() paginationProductDto: PaginationProductDto,
    @Query('name') name?: string
  ) {
    return name
    ? this.productsService.getProductByName(name)
    : this.productsService.getProducts(paginationProductDto);
  }

  @Get(':id')
  getProducById(@Param('id', ParseUUIDPipe) id: string){
    // const productById = this.productsService.findRelationsCategory(id);
    const productById = this.productsService.getProductById(id);
    return productById;
  }

  @Post()
  @UseGuards(AuthGuard)
  createProduct(@Body() productDto: ProductDto){
    const messageNewProduct = this.productsService.createProduct(productDto);
    return messageNewProduct;
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  createProductEmmbedding( productEmbeddingDto: ProductEmbeddingDto){
    const productEmbedding = this.productsService.createProductEmbedding(productEmbeddingDto)
  }
  
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard) //RolGuard
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProducDto: UpdateProductDto) {
      const messageUpdateProduct = this.productsService.updateProduct(id, updateProducDto);
    return messageUpdateProduct;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteProduct(@Param('id', ParseUUIDPipe) id:string){
    const messageDeleteProduct = this.productsService.deleteProduct(id);
    return messageDeleteProduct;
  }
}
