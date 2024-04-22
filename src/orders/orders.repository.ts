import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from "uuid";
import { User } from '../users/entities/user.entity';
import { OrderDetails } from './entities/order-details.entity';
import { Products } from '../products/entities/products.entity';

@Injectable()
export class OrdersRepository {

    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(OrderDetails)
        private readonly ordersDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ){}
  
  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if(!order) throw new NotFoundException(`La order con id ${id} no existe.`);

    order.order_details.products.forEach(product => {
      delete product.stock;
    });
        
    return order;
  }
  
  async addOrder(createOrderDto: CreateOrderDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { products, userId } = createOrderDto;
    
    try {

      if ( isUUID(userId) ) {        

        const user = await this.userRepository.findOneBy({ id: userId });
        if(!user) throw new NotFoundException(`No existe un usuario con el id ${userId}`);

        // newOrderDetails #1
        const order = await queryRunner.manager.create( Orders ,{
          user_id: user,
          date: new Date,
        });
        const savedOrder = await queryRunner.manager.save(order);    
        
        const productsOrder = await Promise.all(products.map(async (product) => {     
          const newProduct = await queryRunner.manager
          .createQueryBuilder(Products, 'product')
          .where('product.id = :id', { id: product.id })
          .addSelect('product.descriptionEmbedding')
          .addSelect('product.nameEmbedding')
          .getOne();

          if(!newProduct) throw new NotFoundException(`Es producto con id ${product.id} no existe.`);
          return newProduct;
        })); 
            
        const availableProducts = productsOrder.filter(product => product.stock > 0); // filter stock > 0

        // stock?
        const productIds = products.map((product) => product.id); // extraigo ids
        if(availableProducts.length !== productIds.length) throw new BadRequestException(`Algunos articulos estan fuera de stock.`);
        // newOrderDetails #2
        let totalPriceProducts = 0;
        for(const element of availableProducts) {
          element.stock--
          totalPriceProducts += +element.price;
          await queryRunner.manager.save(element);
        }
        // newOrderDetails #3
        const onlyProducts = availableProducts.map((product) => {
          const { stock, ...productsDetails } = product;
          return productsDetails;
        });    

        const newOrderDetails = await this.ordersDetailsRepository.create({  
          price: totalPriceProducts,
          order_id: savedOrder,
          products: onlyProducts,
        });
              
        const newOrderDetailsSaved = await queryRunner.manager.save(newOrderDetails);

        await queryRunner.commitTransaction();

        const lastOrder = await this.ordersRepository.findOneBy({ id: savedOrder.id });
        const { id, price } = newOrderDetailsSaved

        const result = { id_order: lastOrder.id , order_details: {id, price: +price.toFixed(2)}};
        return result;

      }        
    }
    catch (error) {
        await queryRunner.rollbackTransaction();
        throw error
    }
    finally {
      await queryRunner.release()
    }
  }
}
