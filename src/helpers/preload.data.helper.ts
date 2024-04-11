import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as usersData from './preload-users.data.json'; // Importa el JSON
import * as productsData from './preload-products.data.json'; // Importa el JSON
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from "bcrypt";
import { Products } from 'src/products/entities/products.entity';
import { ProductsRepository } from 'src/products/products.repository';
import { ProductDto } from 'src/products/dto/products.dto';

@Injectable()
export class DataLoaderService {
  constructor(
    @InjectRepository(Products)
    private productRepository: Repository<Products>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // async loadProductsFromJson() {
  //   try {
  //     const products = productsData as ProductDto[]; // Convierte el JSON a un array de categorías
  //     await Promise.all(products.map(async (product) => {
  //       const isProduct = await this.productRepository.findOneBy({ name: product.name });
  //       if(!isProduct) {
  //         return await this.productRepository.save(product)
  //       }
  //     }))
  //     // const productsSaved = await .createProduct(products); // Guarda las categorías en la base de datos
  //     Logger.log('Productos cargadas desde el JSON correctamente', 'DataLoader');
  //   } catch (error) {
  //     Logger.error('Error al cargar los productos desde el JSON', error.stack, 'DataLoader');
  //     throw error;
  //   }
  // }

  async loadUsersFromJson() {
    try {
      const users = usersData as User[]; // Convierte el JSON a un array de categorías
      await Promise.all(users.map(async (user) => {
        const isUser = await this.usersRepository.findOneBy({ email: user.email});
        if(!isUser) {
          const hashedPassword = await bcrypt.hash(user.password, 10) // 10 nivel de seguridad de hash
          user.created_at = new Date();
          user.password = hashedPassword;
          user.last_login = new Date;
          return await this.usersRepository.save(user);
        }
      }));
      Logger.log('Usuarios cargados desde el JSON correctamente', 'DataLoader');
    } catch (error) {
      Logger.error('Error al cargar los usuarios desde el JSON', error.stack, 'DataLoader');
      throw error;
    }
  }
}
