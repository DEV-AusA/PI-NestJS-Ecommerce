import { Injectable } from '@nestjs/common';
import * as productsData from "../helpers/preload-products.data.json";
import { ProductItemDto } from '../products/dto/products.dto';
import { DataSource } from 'typeorm';
import { Products } from '../products/entities/products.entity';
import { Categories } from '../categories/entities/category.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async executeSeed() {
    
    const products = productsData as ProductItemDto[];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      for await (const product of products){

        const { category, ...restProduct } = product;
        const existProduct = await queryRunner.manager.findOneBy(Products, { name: restProduct.name });
        if(!existProduct) {
          const newCategory = await queryRunner.manager.create(Categories, { name: category as string});
          const newCategorySaved = await queryRunner.manager.save(newCategory);
  
          const newProduct = await queryRunner.manager.create(Products, {
            ...restProduct,
            category: [newCategorySaved],
          });
          await queryRunner.manager.save(newProduct);
        }

      }

      await queryRunner.commitTransaction();

      const seedLoaded = { message: 'Seed de productos cargado Correctamente' };
      return seedLoaded;
      
    }
    catch (error) {
      await queryRunner.rollbackTransaction()
    }
    finally{
      await queryRunner.release()
    }
  }

}
