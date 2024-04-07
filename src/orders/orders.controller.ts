import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrder() {

    // {
    //   "userId":"UUID del usuario",    
    //   "products":[    
    //     {
    //       "id":"UUID producto 1"
    //     },
    //     {    
    //       "id":"UUID producto 2"
    //     }
    //   ]    
    // }
    return this.ordersService.getOrder();
  }

  @Post()
  addOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.addOrder(createOrderDto);
  }

}
