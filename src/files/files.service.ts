import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/products/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {

  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>
  ){}

  async uploadImage(productId: string, file: Express.Multer.File) {

    try {
      
      const product = await this.productsRepository.findOneBy({ id: productId });      
  
      if(!product) throw new NotFoundException(`El producto con id ${productId} no existe.`);
      
      // envio la img al repository
      const uploadedImage = await this.fileUploadRepository.uploadImage(file);
            
      // update recibe 2 argumentos
      await this.productsRepository.update(product.id, {
          img_url: uploadedImage.secure_url,
      });
      // obtengo el producto con la img actualizada
      const updatedProduct = await this.productsRepository.findOneBy({id: productId});
        
      return updatedProduct;
      
    } catch (error) {
      throw error;      
    }
  }

}
