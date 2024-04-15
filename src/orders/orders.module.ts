import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { User } from '../users/entities/user.entity';
import { Products } from '../products/entities/products.entity';
import { OrderDetails } from './entities/order-details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, User, Products, OrderDetails])],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
