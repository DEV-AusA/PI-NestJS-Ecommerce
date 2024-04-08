import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from '../categories/entities/category.entity';
import * as categoriesData from './preload-categories.data.json'; // Importa el JSON
import * as usersData from './preload-users.data.json'; // Importa el JSON
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DataLoaderService {
  constructor(
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async loadCategoriesFromJson(): Promise<void> {
    try {
      const categories = categoriesData as Categories[]; // Convierte el JSON a un array de categorías
      await this.categoryRepository.save(categories); // Guarda las categorías en la base de datos
      Logger.log('Categorías cargadas desde el JSON correctamente', 'DataLoader');
    } catch (error) {
      Logger.error('Error al cargar las categorías desde el JSON', error.stack, 'DataLoader');
      throw error;
    }
  }

  async loadUsersFromJson(): Promise<void> {
    try {
      const users = usersData as User[]; // Convierte el JSON a un array de categorías
      await Promise.all(users.map(async (user) => {
        user.created_at = new Date();
        return await this.usersRepository.save(user);
      }));
      Logger.log('Usuarios cargados desde el JSON correctamente', 'DataLoader');
    } catch (error) {
      Logger.error('Error al cargar los usuarios desde el JSON', error.stack, 'DataLoader');
      throw error;
    }
  }
}
