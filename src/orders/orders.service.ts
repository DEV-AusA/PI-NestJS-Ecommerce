import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  getOrder(id: string) {
    return this.ordersRepository.getOrder(id);
  }

  addOrder(createOrderDto: CreateOrderDto) {
    return this.ordersRepository.addOrder(createOrderDto);
  }
}
