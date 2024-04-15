import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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

    //propiedad para el handle de errores
    private readonly logger = new Logger('ProductsRepository');

    constructor(
        @InjectRepository(Orders)
        private readonly ordersRepository: Repository<Orders>,
        @InjectRepository(OrderDetails)
        private readonly ordersDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly dataSource: DataSource,
    ){}
  
  async getOrder(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id }
    });
    if(!order) throw new NotFoundException(`La order con id ${id} no existe.`);
        
    return order;
  }
  
  async addOrder(createOrderDto: CreateOrderDto) {
    // transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { products, userId } = createOrderDto;
    
    try {

      if ( isUUID(userId) ) {        
        // busco user x id
        const user = await this.userRepository.findOneBy({ id: userId });
        if(!user) throw new NotFoundException(`No existe un usuario con el id ${userId}`)
          // registro order en DB y save
        const order = await queryRunner.manager.create( Orders ,{
          user_id: user,
          date: new Date,
        });
        const savedOrder = await queryRunner.manager.save(order);
        // console.log(savedOrder);
        
        // products
        // FORMA 1 queryBuilder
        // const productsOrder = await queryRunner.manager
        // .createQueryBuilder(Products, 'product')
        // .where('product.id IN (:...ids)', { ids: productIds })
        // .getMany();
        // console.log(productsOrder);         
        
        // FORMA 2 async findOneBy
        const productsOrder = await Promise.all(products.map(async (product) => {      
          const newProduct = await queryRunner.manager.findOneBy(Products, { id: product.id });
          if(!newProduct) throw new NotFoundException(`Es producto con id ${product.id} no existe.`);
          return newProduct;
        }));
        // return productsOrder;
            
        // Filtrar los productos con stock mayor que 0
        const availableProducts = productsOrder.filter(product => product.stock > 0);

        // fuera de stock?
        const productIds = products.map((product) => product.id); // extraigo ids
        if(availableProducts.length !== productIds.length)
          throw new BadRequestException(`Algunos articulos estan fuera de stock.`)

        let totalPriceProducts = 0;
        for(const element of availableProducts) {
          element.stock--
          totalPriceProducts += +element.price;
          await queryRunner.manager.save(element);
        }
        // products sin stock
        const onlyProducts = availableProducts.map((product) => {
          const { stock, ...productsDetails } = product;
          return productsDetails;
        })

        // const newOrderDetails = queryRunner.manager.create( OrderDetails, {  
        const newOrderDetails = this.ordersDetailsRepository.create({  
          price: totalPriceProducts,
          order_id: savedOrder,
          products: onlyProducts,
        });
              
        const newOrderDetailsSaved = await queryRunner.manager.save(newOrderDetails);

        await queryRunner.commitTransaction()

        const lastOrderDetails = this.ordersDetailsRepository.findOneBy({ id: newOrderDetailsSaved.id});
        return lastOrderDetails

        // const lastOrder = this.ordersRepository.findOneBy({ id: savedOrder.id })
        // return lastOrder;
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
