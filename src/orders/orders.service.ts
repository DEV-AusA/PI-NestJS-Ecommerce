import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {

  constructor(private readonly ordersRepository: OrdersRepository) {}
  
  getOrder() {
    return this.ordersRepository.getOrder();
  }
  
  addOrder(createOrderDto: CreateOrderDto) {
    return this.ordersRepository.addOrder(createOrderDto);
  }
}
