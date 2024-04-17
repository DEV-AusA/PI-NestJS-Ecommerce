import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Categories } from '../categories/entities/category.entity';
import { validate as isUUID } from "uuid";
import { GoogleGenerativeAI } from '@google/generative-ai';
import {config as dotenvConfig} from 'dotenv'
dotenvConfig({ path: '.development.env' });

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

    // calculo el indice de inicio y fin
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const products = await this.productsRepository.find();
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
    if (isUUID(id)) {
      
      return this.productsRepository
      .createQueryBuilder('product')
      .select(['product.nameEmbedding'])
      .where('product.id = :id', { id })
      .getMany();
      // product = await this.productsRepository.findOneBy({ id });     
    }
    if (!product) throw new NotFoundException(`El producto con id ${id} no existe.`); // exception filter de NestJS
    return product;
  }

  async createProduct(productDto: ProductDto | ProductDto[]) {

    let newProduct: Products;
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
        
        // mapeo las nuevas categories
        product.category = category.map((category) => this.categoriesRepository.create({ name: category}))        
      }
      else {

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

  async createProductEmbedding(productEmbedding: ProductDto | ProductDto[]) {

    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelEmbedding = genAI.getGenerativeModel({ model: "embedding-001"});
    
    try {
      
      if (Array.isArray(productEmbedding)) {        
        const arrayNuevo = [];
          
        for(const product of productEmbedding) {
  
          const { name, description } = product;
          const productFinded = await this.productsRepository.findOne({ where: {name}});
          
          if(!productFinded) throw new NotFoundException(`El producto "${name}" no existe en la base de datos.`);
          // product embedding
          const resultProductEmbedding = await modelEmbedding.embedContent(name);
          const productEmbedding = await resultProductEmbedding.embedding.values;    
          // suggestionUse embedding
          const resultSuggestionsUseEmbedding = await modelEmbedding.embedContent(description);
          const descriptionEmbedding = await resultSuggestionsUseEmbedding.embedding.values;
    
          productFinded.nameEmbedding = productEmbedding;
          productFinded.descriptionEmbedding = descriptionEmbedding;
    
          const newProduct = await this.productsRepository.save(productFinded);

          const {id, ...resto} = newProduct;
          arrayNuevo.push(resto);
        }
        
        return arrayNuevo;
        // const message = { message: "Embeddings creados con exito"};
        // return message;      
      }
      else {
        const { name, description } = productEmbedding;
    
        const product = await this.productsRepository.findOne({ where: {name}});
    
        if(!product) throw new NotFoundException(`El producto "${name}" no existe en la base de datos.`);
        // model embedding-001
        // product embedding
        const resultProductEmbedding = await modelEmbedding.embedContent(name);
        const newProductEmbedding = await resultProductEmbedding.embedding.values;
    
        // suggestionUse embedding
        const resultSuggestionsUseEmbedding = await modelEmbedding.embedContent(description);
        const descriptionEmbedding = await resultSuggestionsUseEmbedding.embedding.values;
    
        product.nameEmbedding = newProductEmbedding;
        product.descriptionEmbedding = descriptionEmbedding;
    
        const productsSaved = await this.productsRepository.save(product);

        // arrayNuevo.push(product);
  
        return productsSaved;
        // const message = { message: "Embeddings creados con exito"};  
        // return message;
      }
    } catch (error) {

      throw new BadRequestException(`Error al crear los Embeddings, ${error}`);      
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
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(`Error inesperado verifique los losgs del Server`)
  }

}
