import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/products.dto';
import { IProduct } from './interfaces/product.interface';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Categories } from 'src/categories/entities/category.entity';

import { validate as isUUID } from "uuid";

@Injectable()
export class ProductsRepository {

  //propiedad para el handle de errores
  private readonly logger = new Logger('ProductsRepository');

  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>, // Repository de typeorm para que maneje la entity Products
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    private readonly dataSource: DataSource, // transactions
  ){}

   async getProducts(paginationProductDto: PaginationProductDto) {
    // valores por defecto
    const { page = 1, limit = 5 } = paginationProductDto;
    // console.log(typeof page, typeof limit);    

    // calculo el indice de inicio y fin
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Obtener los productos para la pagina actual
    const products = await this.productsRepository.find()
    const productosPaginados = products.slice(startIndex, endIndex);
    return {page , productosPaginados};    
    }
  
    async getProductByName(name: string) {
      const productByName = await this.productsRepository.findOneBy({name})
      if(!productByName) throw new NotFoundException(`No se encontro el producto con el nombre "${name}" intentelo nuevamente.`)
      return productByName;
    }

   async getProductById(id: string) {

    let product: Products;
    //check is UUID
    if (isUUID(id)) {
      product = await this.productsRepository.findOneBy({ id });      
    }
    if (!product) throw new NotFoundException(`El producto con id ${id} no existe.`); // exception filter de NestJS
    return product;
  }

  async createProduct(productDto: ProductDto | ProductDto[]) {

    let newProduct: Products
    // query para transactions
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    //conecto con la db
    await queryRunner.connect();
    // star transactions
    await queryRunner.startTransaction();

    try {

      let result = [];
      // NO ARRAY product
      if (!Array.isArray(productDto)) {
        const { category, ...productDetails } = productDto;
        //NO ARRAY  category
        if (typeof category === 'string') {
          const newCategory = await queryRunner.manager.create(Categories, { name: category});
          const savedCategory = await queryRunner.manager.save(newCategory);
          //creo el product con su category
          newProduct = await queryRunner.manager.create(Products, {
            ...productDetails,
            img_url: productDto.imgUrl,
            category: [savedCategory]
          });     
        }
        // ARRAY category
        else {
          // creo y guardo las categorias para el product
          const categories = await Promise.all(category.map(async (categoryName) => {
          const newCategory = await queryRunner.manager.create(Categories, { name: categoryName });
          return await queryRunner.manager.save(newCategory);
          }));
          //creo el product con su category
          newProduct = await queryRunner.manager.create(Products, {
            ...productDetails,
            img_url: productDto.imgUrl,
            category: categories
          });     
        }
        // save del product
        await queryRunner.manager.save(newProduct);
        result.push(newProduct);
      }
      // ARRAY product
      else {
        for( const product of productDto ) {
          const { category, ...productDetails } = product;
          //ARRAY  category
          if (typeof category !== 'string') {
            // creo y guardo las categorias para el product
            const categories = await Promise.all(category.map(async (categoryName) => {
              const newCategory = await queryRunner.manager.create(Categories, { name: categoryName });
              return await queryRunner.manager.save(newCategory);
            }));
            //creo el product con su category
            newProduct = await queryRunner.manager.create(Products, {
              ...productDetails,
              img_url: product.imgUrl,
              category: categories
            });     
          }
          //NO ARRAY  category
          else {     
            const newCategory = await queryRunner.manager.create(Categories, { name: category})
            const savedCategory = await queryRunner.manager.save(newCategory)          
            //creo el product con su category
            newProduct = await queryRunner.manager.create(Products, {
              ...productDetails,
              img_url: product.imgUrl,
              category: [savedCategory]
            });     
          }
          // save del product
          result.push(newProduct);
          await queryRunner.manager.save(newProduct);
        }
      }

      await queryRunner.commitTransaction();

    // const messageNewProduct = { message: `Producto con id ${newProduct.id} creado correctamente` };
    // return messageNewProduct;
      return result;
      
    } catch (error) {

      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error)
    }

    finally{
      await queryRunner.release()
    }
  }

  async updateProduct(id:string, updateProductDto: UpdateProductDto) {
    //separo las que tienen relaciones
    const { category, ...restToUpdate} = updateProductDto;
    // busco el product
    await this.getProductById(id);

    // preload de productUpdated
    const product = await this.productsRepository.preload({
      id,
      ...restToUpdate
    });

    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // si manda nueva categoria borro todas las que estan relacionadas en la DB
      if (Array.isArray(category)) { //CORREGIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIR
        //borra las que existen en la DB
        await queryRunner.manager.delete(Categories, { products: { id } }) // uso id del preload

        console.log(category);
        
        // mapeo las nuevas categories
        product.category = category.map((category) => this.categoriesRepository.create({ name: category}))        
      }
      else {
        console.log(category);

        await queryRunner.manager.delete( Categories, { products: { id } });
        product.category = [ this.categoriesRepository.create({ name: category }) ] 
      }
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()

      const messageUpdateProduct = { message: `El producto con id ${product.id} fue actualizado con exito.` }
      return messageUpdateProduct;

    }
    catch (error) {

      await queryRunner.rollbackTransaction()
      this.handleDBExceptions(error)
      
    }
    finally {
      await queryRunner.release();
    }

    // let productDB = await this.getProductById(id);

    // this.products = this.products.map((product) => {
    //   if (product.id === productDB.id) {
    //     productDB = {
    //       ...productDB,
    //       ...updateProductDto,
    //       id,
    //     }
    //     return productDB;
    //   }
    //   return product;
    // })
    // const messageUpdateProduct = { message: `El producto con id ${productDB.id} fue actualizado con exito.` }
    // return messageUpdateProduct;
  }

  async deleteProduct(id: string) {
    
    await this.getProductById(id);

    try {
      await this.productsRepository.delete(id)
      const messageDeleteProduct = { message: `El producto con id ${id} fue borrado con exito.` }
      return messageDeleteProduct;
      
    } catch (error) {
      this.handleDBExceptions(error)
      
    }
  }

  //connect relations con QueryBuilder - testear
  async findRelationsCategory(name: string) {
    const product = await this.getProductByName(name)
    const { category = [], ...productDetails } = product;
    const productsRelations = {
      ...productDetails,
      category: category.map((category) => category.name)
    }
    return productsRelations;
  }

  // handle de errores Products friendly
  private handleDBExceptions(error: any) { // any para recibir cualquier tipo de error
    //errores de la DB
    if (error.code === '23505' ) {
      // console.log(error.code);
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException(`Error inesperado verifique los losgs del Server`)
  }

}
