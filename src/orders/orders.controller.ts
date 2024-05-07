import {
  Controller,
  Get,
  Post,
  Body,
  ParseUUIDPipe,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Orden de compra detallada' })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({ status: 404, description: 'La order con id no existe.' })
  getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrder(id);
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 201,
    description: 'Orden de compra creada con exito.',
  })
  @ApiResponse({
    status: 400,
    description: 'UUID incorrecto o Algunos articulos estan fuera de stock.',
  })
  @ApiResponse({ status: 401, description: 'Token invalido, no autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'No existe un usuario con el id o no existe el producto.',
  })
  addOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.addOrder(createOrderDto);
  }
}
