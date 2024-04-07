import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from "uuid";

@Injectable()
export class OrdersRepository {

    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>
    ){}
  
  async getOrder() {
    return `This action returns all orders`;
  }
  
  async addOrder(createOrderDto: CreateOrderDto) {

    console.log(createOrderDto);
    
    const userId = createOrderDto.userId;
    //de tipo let con data type DTO
    let orderUser: Orders;

    try {
      if ( isUUID(userId) ) {
        orderUser = await this.ordersRepository.findOneBy({ id: userId });
      }
      console.log(orderUser);
      
      return orderUser;
        
    } catch (error) {
        
    }
  }
}
