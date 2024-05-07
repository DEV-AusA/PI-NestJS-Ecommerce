import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as productsData from '../helpers/preload-products.data.json';
import { ProductItemDto } from '../products/dto/products.dto';
import { EntityManager, Repository } from 'typeorm';
import { Products } from '../products/entities/products.entity';
import { Categories } from '../categories/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    private readonly entityManager: EntityManager,
  ) {}

  async onModuleInit() {
    //preload on start
    await this.preloadData();
  }

  private async executeSeedProducts() {
    let newProduct: Products;

    const products = productsData as ProductItemDto[];

    try {
      for await (const product of products) {
        const { category, ...restProduct } = product;

        const productFinded = await this.productsRepository.findOneBy({
          name: restProduct.name,
        });

        if (!productFinded) {
          const newCategory = await this.categoriesRepository.create({
            name: category as string,
          });
          const newCategorySaved =
            await this.categoriesRepository.save(newCategory);

          newProduct = this.productsRepository.create({
            ...restProduct,
            category: [newCategorySaved],
          });

          await this.productsRepository.save(newProduct);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async preloadData() {
    const products = productsData as ProductItemDto[];
    const busyProducts: string[] = [];

    try {
      await this.executeSeedProducts();

      for await (const product of products) {
        const productFinded = await this.productsRepository.findOneBy({
          name: product.name,
        });

        if (productFinded) {
          const productWithOrder = await this.entityManager
            .createQueryBuilder()
            .select('order_details_products.productsId', 'productsId')
            .from('order_details_products', 'order_details_products')
            .where('order_details_products.productsId = :id', {
              id: productFinded.id,
            })
            .getRawOne();

          !productWithOrder
            ? await this.productsRepository.update(productFinded.id, {
                stock: product.stock,
              })
            : busyProducts.push(productFinded.name);
        }
      }

      if (busyProducts.length > 0) {
        Logger.log(
          `Seed de productos cargado correctamente, estos articulos no se pueden reinicializar porque estan relacionados a una orden: ${busyProducts}`,
          'PreloadData-Ecommerce',
        );
        const message = {
          message:
            'Seed de productos cargado correctamente, estos articulos no se pueden reinicializar porque estan relacionados a una orden:',
          busyProducts,
        };
        return message;
      } else {
        Logger.log(
          'Seed de productos cargado correctamente',
          'PreloadData-Ecommerce',
        );
        const message = { message: 'Seed de productos cargado correctamente' };
        return message;
      }
    } catch (error) {
      throw error;
    }
  }
}
