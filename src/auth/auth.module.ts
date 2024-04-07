import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from 'src/users/users.repository';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([User]) ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, UsersRepository],
})
export class AuthModule {}
