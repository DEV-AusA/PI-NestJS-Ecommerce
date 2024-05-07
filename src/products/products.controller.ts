import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductItemDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { MultipleProductsDto } from './dto/products.multiple.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  @ApiResponse({ status: 500, description: 'Error al realizar la busqueda' })
  getAllProducts(
    @Query() paginationProductDto: PaginationProductDto,
    @Query('name') name?: string,
  ) {
    return name
      ? this.productsService.getProductByName(name)
      : this.productsService.getProducts(paginationProductDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Producto encontrado por id' })
  @ApiResponse({
    status: 400,
    description: 'El id del producto no contiene el formato correcto de UUID.',
  })
  @ApiResponse({
    status: 404,
    description: 'El producto con ese id no existe.',
  })
  getProducById(@Param('id', ParseUUIDPipe) id: string) {
    const productById = this.productsService.getProductById(id);
    return productById;
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'El producto ya existe en la base de datos.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  createProduct(@Body() productDto: ProductItemDto) {
    const messageNewProduct = this.productsService.createProduct(productDto);
    return messageNewProduct;
  }

  @ApiBearerAuth()
  @Post('multiple')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'Productos creados correctamente' })
  @ApiResponse({
    status: 400,
    description: 'El producto ya existe en la base de datos.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  createMultipleProducts(@Body() multipleProductsDto: MultipleProductsDto) {
    const messageNewProduct =
      this.productsService.createMultipleProducts(multipleProductsDto);
    return messageNewProduct;
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El id del producto no contiene el formato correcto de UUID',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'El producto con ese id no existe.',
  })
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProducDto: UpdateProductDto,
  ) {
    const messageUpdateProduct = this.productsService.updateProduct(
      id,
      updateProducDto,
    );
    return messageUpdateProduct;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'El producto con el id fue borrado con exito.',
  })
  @ApiResponse({
    status: 400,
    description:
      'El id del producto no contiene el formato correcto de UUID o el producto ya existe en la base de datos.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({ status: 404, description: 'El producto con el id no existe.' })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    const messageDeleteProduct = this.productsService.deleteProduct(id);
    return messageDeleteProduct;
  }
}
