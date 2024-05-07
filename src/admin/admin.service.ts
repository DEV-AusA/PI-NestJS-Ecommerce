import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminDto } from './dto/create-admin.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createAdminUser(createAdminDto: AdminDto) {
    const user = await this.userRepository.findOne({
      where: { email: createAdminDto.email },
    });

    if (!user)
      throw new NotFoundException(
        `El usuario con el email ${createAdminDto.email} no existe en la base de datos.`,
      );
    if (user.isAdmin)
      throw new BadRequestException(
        `El usuario con el email ${createAdminDto.email} ya tiene el rol de Admin.`,
      );

    await this.userRepository.update(user.id, { isAdmin: true });

    const message = {
      message: `Se asigno rol de Admin correctamente al usuario con email: ${createAdminDto.email}.`,
    };

    return message;
  }

  async deleteAdminUser(deleteAdminUser: AdminDto) {
    const user = await this.userRepository.findOne({
      where: { email: deleteAdminUser.email },
    });

    if (!user)
      throw new NotFoundException(
        `El usuario con el email ${deleteAdminUser.email} no existe en la base de datos.`,
      );
    if (!user.isAdmin)
      throw new BadRequestException(
        `El usuario con el email ${deleteAdminUser.email} no tiene el rol de Admin.`,
      );

    await this.userRepository.update(user.id, { isAdmin: false });

    const message = {
      message: `Se eliminó el rol de Admin correctamente al usuario con email: ${deleteAdminUser.email}.`,
    };
    return message;
  }
}
