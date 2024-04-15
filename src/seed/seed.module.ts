import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports:[ProductsModule], // importo el modulo Products
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
