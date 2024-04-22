import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from '../categories/entities/category.entity';
import { Products } from '../products/entities/products.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([Categories, Products])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
