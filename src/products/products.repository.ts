import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductItemDto } from './dto/products.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { DataSource, Repository } from 'typeorm';
import { Categories } from '../categories/entities/category.entity';
import { validate as isUUID } from 'uuid';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config as dotenvConfig } from 'dotenv';
import { MultipleProductsDto } from './dto/products.multiple.dto';
dotenvConfig({ path: '.development.env' });

@Injectable()
export class ProductsRepository {
  private readonly logger = new Logger('ProductsRepository');

  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    private readonly dataSource: DataSource,
  ) {}

  async getProducts(paginationProductDto: PaginationProductDto) {
    const { page = 1, limit = 5 } = paginationProductDto; // valores por defecto
    const startIndex = (page - 1) * limit;

    const [products, totalNumProducts] =
      await this.productsRepository.findAndCount({
        take: limit,
        skip: startIndex,
      });

    return {
      page,
      totalNumProducts,
      pagination: products,
    };
  }

  async getProductByName(name: string) {
    const productByName = await this.productsRepository.findOneBy({ name });
    if (!productByName)
      throw new NotFoundException(
        `No se encontro el producto con el nombre '${name}' intentelo nuevamente.`,
      );
    return productByName;
  }

  async getProductById(id: string) {
    if (!isUUID(id))
      throw new BadRequestException(
        `El id del producto no contiene el formato correcto de UUID`,
      );

    const product = await this.productsRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`El producto con id ${id} no existe.`);

    return product;
  }

  async createMultipleProducts(multipleProductsDto: MultipleProductsDto) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelEmbedding = genAI.getGenerativeModel({ model: 'embedding-001' });

    let newProduct: Products;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const result = [];

    try {
      for (const product of multipleProductsDto.products) {
        const { category, ...productDetails } = product;

        const productFounded = await this.productsRepository.findOneBy({
          name: productDetails.name,
        });
        if (productFounded)
          throw new BadRequestException(
            `El producto ${productDetails.name} ya existe en la base de datos.`,
          );

        //ARRAY  category
        if (typeof category !== 'string') {
          // creo y guardo las categorias para el product
          const categories = await Promise.all(
            category.map(async (categoryName) => {
              const newCategory = await queryRunner.manager.create(Categories, {
                name: categoryName,
              });
              return await queryRunner.manager.save(newCategory);
            }),
          );
          //embeddings
          const resultNameEmbedding = await modelEmbedding.embedContent(
            productDetails.name,
          );
          const nameEmbedding = await resultNameEmbedding.embedding.values;
          const resultDescriptionEmbedding = await modelEmbedding.embedContent(
            productDetails.description,
          );
          const descriptionEmbedding =
            await resultDescriptionEmbedding.embedding.values;
          //creo el product con su category
          newProduct = await queryRunner.manager.create(Products, {
            ...productDetails,
            nameEmbedding,
            descriptionEmbedding,
            img_url: product.imgUrl,
            category: categories,
          });
        }
        //NO ARRAY  category
        else {
          const newCategory = await queryRunner.manager.create(Categories, {
            name: category,
          });
          const savedCategory = await queryRunner.manager.save(newCategory);
          //embeddings
          const resultNameEmbedding = await modelEmbedding.embedContent(
            productDetails.name,
          );
          const nameEmbedding = await resultNameEmbedding.embedding.values;
          const resultDescriptionEmbedding = await modelEmbedding.embedContent(
            productDetails.description,
          );
          const descriptionEmbedding =
            await resultDescriptionEmbedding.embedding.values;
          //creo el product con su category
          newProduct = await queryRunner.manager.create(Products, {
            ...productDetails,
            nameEmbedding,
            descriptionEmbedding,
            img_url: product.imgUrl,
            category: [savedCategory],
          });
        }
        // save product
        result.push(newProduct);
        await queryRunner.manager.save(newProduct);
      }

      await queryRunner.commitTransaction();

      const productsListSaved = result.map((product) => product.name);
      const messageNewProducts = {
        message: `Productos creados correctamente: ${productsListSaved}`,
      };
      return messageNewProducts;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createProduct(productDto: ProductItemDto) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelEmbedding = genAI.getGenerativeModel({ model: 'embedding-001' });

    let newProduct: Products;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const result = [];

    try {
      const { category, ...productDetails } = productDto;

      const product = await this.productsRepository.findOneBy({
        name: productDetails.name,
      });
      if (product)
        throw new BadRequestException(
          `El producto ${productDetails.name} ya existe en la base de datos.`,
        );
      //NO ARRAY  category
      if (typeof category === 'string') {
        const newCategory = await queryRunner.manager.create(Categories, {
          name: category,
        });
        const savedCategory = await queryRunner.manager.save(newCategory);
        //embeddings
        const resultNameEmbedding = await modelEmbedding.embedContent(
          productDetails.name,
        );
        const nameEmbedding = await resultNameEmbedding.embedding.values;
        const resultDescriptionEmbedding = await modelEmbedding.embedContent(
          productDetails.description,
        );
        const descriptionEmbedding =
          await resultDescriptionEmbedding.embedding.values;
        //creo el product con su category
        newProduct = await queryRunner.manager.create(Products, {
          ...productDetails,
          nameEmbedding,
          descriptionEmbedding,
          img_url: productDto.imgUrl,
          category: [savedCategory],
        });
      }
      // ARRAY category
      else {
        // creo y guardo las categorias para el product
        const categories = await Promise.all(
          category.map(async (categoryName) => {
            const newCategory = await queryRunner.manager.create(Categories, {
              name: categoryName,
            });
            return await queryRunner.manager.save(newCategory);
          }),
        );
        //embeddings
        const resultNameEmbedding = await modelEmbedding.embedContent(
          productDetails.name,
        );
        const nameEmbedding = await resultNameEmbedding.embedding.values;
        const resultDescriptionEmbedding = await modelEmbedding.embedContent(
          productDetails.description,
        );
        const descriptionEmbedding =
          await resultDescriptionEmbedding.embedding.values;
        //creo el product con su category
        newProduct = await queryRunner.manager.create(Products, {
          ...productDetails,
          nameEmbedding,
          descriptionEmbedding,
          img_url: productDto.imgUrl,
          category: categories,
        });
      }
      // save product
      await queryRunner.manager.save(newProduct);
      result.push(newProduct);

      await queryRunner.commitTransaction();

      const productsListSaved = result.map((product) => product.name);
      const messageNewProducts = {
        message: `Productos creados correctamente: ${productsListSaved}`,
      };
      return messageNewProducts;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    await this.getProductById(id);

    const { category, ...restToUpdate } = updateProductDto;

    const product = await this.productsRepository.preload({
      id,
      ...restToUpdate,
    });

    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (category) {
        if (Array.isArray(category)) {
          //borra las que existen en la DB
          await queryRunner.manager.delete(Categories, { products: { id } });

          const newCategories = await Promise.all(
            category.map(async (category) => {
              const newCategory = this.categoriesRepository.create({
                name: category,
              });
              const newCategorySaved =
                await this.categoriesRepository.save(newCategory);
              return newCategorySaved;
            }),
          );

          product.category = newCategories;
        } else {
          await queryRunner.manager.delete(Categories, { products: { id } });
          const newCategory = await this.categoriesRepository.create({
            name: category,
          });
          const newCategorySaved =
            await this.categoriesRepository.save(newCategory);
          product.category = [newCategorySaved];
        }
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      const messageUpdateProduct = {
        message: `El producto ${product.name} con id ${product.id} fue actualizado con exito.`,
      };
      return messageUpdateProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);

    try {
      await this.productsRepository.delete(id);
      const messageDeleteProduct = {
        message: `El producto con id ${id} fue borrado con exito.`,
      };
      return messageDeleteProduct;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  // handle de errores Products friendly
  private handleDBExceptions(error: any) {
    // any errors
    //errores de la DB
    if (error.code === '23505') {
      // duplicated
      this.logger.error(error);
      throw new BadRequestException(
        `Ya existe un producto con ese nombre en la tabla '${error.table}' en la base de datos.`,
      );
    } else if (error.code === '23503') {
      // relations FK
      this.logger.error(error);
      throw new BadRequestException(
        `No se puede eliminar porque todavia mantiene una relacion con la tabla '${error.table}' en la base de datos.`,
      );
    }

    this.logger.error(error);
    throw error;
    // throw new InternalServerErrorException(`Error inesperado verifique los logs del Server.`);
  }
}
