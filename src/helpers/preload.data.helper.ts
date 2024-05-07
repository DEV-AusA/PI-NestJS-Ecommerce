import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as usersData from './preload-users.data.json'; // Importa el JSON
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DataLoaderService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async loadUsersFromJson() {
    try {
      const users = usersData as User[]; // Convierte el JSON a un array de categorías
      await Promise.all(
        users.map(async (user) => {
          const isUser = await this.usersRepository.findOneBy({
            email: user.email,
          });
          if (!isUser) {
            if (user.email === 'cesarausa@gmail.com') {
              const hashedPassword = await bcrypt.hash(user.password, 10); // 10 nivel de seguridad de hash
              user.created_at = new Date();
              user.password = hashedPassword;
              user.last_login = new Date();
              user.isAdmin = true;
            } else {
              const hashedPassword = await bcrypt.hash(user.password, 10); // 10 nivel de seguridad de hash
              user.created_at = new Date();
              user.password = hashedPassword;
              user.last_login = new Date();
            }
            return await this.usersRepository.save(user);
          }
        }),
      );
      Logger.log('Usuarios cargados desde el JSON correctamente', 'DataLoader');
    } catch (error) {
      Logger.error(
        'Error al cargar los usuarios desde el JSON',
        error.stack,
        'DataLoader',
      );
      throw error;
    }
  }
}
