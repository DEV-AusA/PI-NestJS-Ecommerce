import { Module } from '@nestjs/common';
import { ConsultsService } from './consults.service';
import { ConsultsController } from './consults.controller';
import { EmbeddingCosineService } from '../utils/Embedding.coseno';
import { Products } from '../products/entities/products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products]),
  ],
  controllers: [ConsultsController],
  providers: [ConsultsService, EmbeddingCosineService],
})
export class ConsultsModule {}
