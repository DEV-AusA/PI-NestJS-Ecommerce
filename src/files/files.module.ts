import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileUploadRepository } from './files.repository';
import { CloudinaryConfig } from '../../config/cloudinary.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../products/entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Products])],
  controllers: [FilesController],
  providers: [FilesService, FileUploadRepository, CloudinaryConfig],
})
export class FilesModule {}
