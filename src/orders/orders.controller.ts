import { Controller, Get, Post, Body, ParseUUIDPipe, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FilterPasswordInterceptor } from 'src/interceptors/filterPassword.interceptor';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrder(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  addOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.addOrder(createOrderDto);
  }

}
