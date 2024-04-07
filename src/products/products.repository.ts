import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { IProduct } from './interfaces/product.interface';
import { UpdateProductDto } from './dto/update.product.dto';
import { PaginationProductDto } from './dto/pagination.product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {

  //propiedad para el handle de errores
  private readonly logger = new Logger('ProductsRepository');

  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products> // Repository de typeorm para que maneje la entity Products
  ){}

  //DB products LOCAL temporal
  private products: IProduct[] = [
    {
      id: 1,
      name: 'POCO X3 PRO',
      description:
        'El Xiaomi Poco X3 Pro cuenta con una pantalla Full HD+ de 6.67 pulgadas y tasa de refresco de 120Hz, el Poco X3 Pro está potenciado por un procesador Snapdragon 860 con variantes de 6GB de memoria RAM con 128GB de almacenamiento o bien 8GB de memoria RAM con 256GB de almacenamiento interno, expandible vía microSD. En cuanto a fotografía, el Poco X3 Pro cuenta con una cámara de cuatro lentes de 48MP, 8MP, 2MP y 2MP en su posterior, mientras que la cámara frontal es de 20 megapixels. Completando las características del Poco X3 Pro encontramos unos parlantes stereo, una batería de 5160 mAh de carga rápida, lector de huellas montado de lado, resistencia al polvo y agua, y corre Android 11.',
      price: 299,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/xiaomi-poco-x3-pro.jpg',
    },
    {
      id: 2,
      name: 'Samsung Galaxy A55 5G',
      description:
        'El Samsung Galaxy A55 debuta con una pantalla AMOLED de 6.6 pulgadas con tasa de refresco de 120Hz y potenciado por un procesador Exynos 1480 con hasta 12GB de RAM y 256GB de almacenamiento. La cámara trasera es triple y está liderada por un sensor de 50MP con OIS, y la cámara selfie es de 32MP. Una batería de 5000 mAh con soporte para carga rápida alimenta al Samsung Galaxy A55, que completa sus características con parlantes stereo, lector de huellas integrado en la pantalla, resistencia al polvo y agua, y corre Android 14.',
      price: 899,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/samsung-galaxy-m55-5g.jpg',
    },
    {
      id: 3,
      name: 'Xiaomi 14 Ultra',
      description:
        'El Xiaomi 14 Ultra se suma a la serie 14 justo antes de su anuncio internacional. El Xiaomi 14 Ultra cuenta con una pantalla AMOLED LTPO de 6.73 pulgadas a resolución QHD+ y tasa de refresco de 120Hz. Por dentro, encontramos un procesador Snapdragon 8 Gen 3 acompañado de hasta 16GB de RAM y hasta 1TB de almacenamiento y una batería de 5000 mAh con soporte para carga rápida por cable e inalámbrica. La cámara principal, desarrollada con Leica, cuenta con cuatro lentes de 50MP siendo el principal de apertura variable con OIS, seguido de una cámara ultrawide y un par de lentes telefoto, uno de ellos periscópico. El Xiaomi 14 Ultra también cuenta con parlantes stereo, lector de huellas bajo la pantalla, es resistente al polvo y agua y corre HyperOS basado en Android 14.',
      price: 699,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/xiaomi-14-ultra.jpg',
    },
    {
      id: 4,
      name: 'Huawei Mate 60 RS Ultimate Design',
      description:
        'El Huawei Mate 60 RS Ultimate Design es una edición especial de la serie Mate 60 con una pantalla OLED LTPO de 6.82 pulgadas y tasa de refresco de 120Hz. Potenciado por un procesador Kirin 9000S, el Mate 60 RS Ultimate cuenta con 16GB de RAM con 512GB o 1TB de almacenamiento interno, cámara triple con sensor principal de 48MP con OIS, sensor telefoto periscópico de 48MP, también con OIS y zoom óptico 3.5x, y una cámara ultrawide de 40MP, cámara selfie de 13MP, acompañada por un sensor ToF para reconocimiento de rostro, batería de 5000 mAh con soporte para carga rápida tanto por cable como en forma inalámbrica, lector de huellas bajo pantalla, parlantes stereo, conectividad satelital para emergencias y resistencia IP68 al polvo y agua.',
      price: 799,
      stock: 0,
      img_url:
        'https://cdn.smart-gsm.com/img/picture/huawei-mate-60-rs-ultimate.jpg',
    },
    {
      id: 5,
      name: 'iPhone 15',
      description:
        'El Apple iPhone 15 conserva el diseño de la generación anterior pero incorpora el Dynamic Island a su pantalla de 6.1 pulgadas. Potenciado por un procesador Apple A16 Bionic, el iPhone 15 cuenta con una cámara dual de 48MP + 12MP, y su cámara selfie es de 12 MP, sumando sensores para reconocimiento facial Face ID. El iPhone 15 admite carga inalámbrica para su batería que carga a la mitad en 30 minutos, cuenta con parlantes stereo, resistencia al agua, y corre iOS 17.',
      price: 949,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/apple-iphone-15.jpg',
    },
    {
      id: 6,
      name: 'Oppo Realme C65',
      description:
        'El Realme C65 es un smartphone Android con una pantalla HD+ de 6.67 pulgadas y tasa de refresco de 90Hz y potenciado por un procesador Helio G85 con hasta 8GB de RAM y 256GB de almacenamiento. En su posterior, el Realme C65 cuenta con una cámara dual de 50MP y se alimenta de una batería de 5000 mAh con soporte para carga rápida, completando sus características con lector de huellas lateral, resistencia a salpicaduras, y corre Android 14.',
      price: 649,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/realme-c65.jpg',
    },
    {
      id: 7,
      name: 'OnePlus Nord CE 4',
      description:
        'El OnePlus Nord CE 4 debuta con una pantalla AMOLED de 6.7 pulgadas con tasa de refresco de 120Hz y potenciado por un procesador Snapdragon 7 Gen 3 con 8GB de RAM y variantes de 128GB o 256GB de almacenamiento interno. Su cámara trasera tiene un sensor de 50MP con OIS y un lente ultrawide de 8MP y al frente cuenta con una cámara selfie de 16MP. El Nord CE 4 se alimenta de una batería de 5500 mAh con soporte para carga rápida de 100W, completando sus características con parlantes stereo, lector de huellas bajo pantalla, resistencia a salpicaduras, y Android 14.',
      price: 849,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/oneplus-nord-ce-4.jpg',
    },
    {
      id: 8,
      name: 'Motorola Razr (2023)',
      description:
        'El Motorola Razr (2023) es el Razr 40 que llega con este nombre a Norteamérica conservando sus características técnicas que incluyen una pantalla AMOLED interna de 6.9 pulgadas con tasa de refresco de 144Hz, pantalla cover AMOLED de 1.5 pulgadas, procesador Snapdragon 7 Gen 1 con hasta 12GB de RAM y 256GB de almacenamiento, cámara dual de 64MP + 13MP, cámara frontal de 32MP, batería de 4200 mAh con soporte para carga rápida e inalámbrica, y Android 13.',
      price: 999,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/motorola-razr-2023.jpg',
    },
    {
      id: 9,
      name: 'Samsung Galaxy Z Fold5',
      description:
        'El Samsung Galaxy Z Fold 5 es la quinta generación del smartphone plegable tipo tablet de Samsung, refinando sobre anteriores generaciones con un nuevo mecanismo de pliegue. El Galaxy Z Fold 5 cuenta con una pantalla interna AMOLED de 7.6 pulgadas con tasa de refresco variable de 120Hz, y una pantalla cover AMOLED de 6.2 pulgadas protegida por vidrio Gorilla Glass Victus 2. El sistema de cámaras del Galaxy Z Fold 5 se mantiene prácticamente intacto, con una cámara triple con un sensor principal de 50MP, uno ultrawide de 12MP y un telefoto de 10MP, y una cámara selfie de 10MP para la pantalla externa y una de 4MP para la pantalla interna. La batería tiene una capacidad de 4400 mAh y soporta carga rápida tanto por cable como inalámbrica y completa sus características con resistencia al agua IPX8, parlantes stereo, lector de huellas lateral, soporte para stylus y corre OneUI 5.1.1 basado en Android 13.',
      price: 1199,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/apple-iphone-15.jpg',
    },
    {
      id: 10,
      name: 'Xiaomi Poco M6 5G',
      description:
        'El Xiaomi Poco M6 5G se suma a la versión Pro de la serie M6 con una pantalla HD+ de 6.74 pulgadas con tasa de refresco de 90Hz y potenciado por un procesador MediaTek Dimensity 6100+ con hasta 8GB de RAM y hasta 256GB de almacenamiento. La cámara trasera es dual, con un sensor principal de 50MP, se alimenta de una batería de 5000 mAh de carga rápida, tiene lector de huellas lateral, y corre MIUI 14 basado en Android 13.',
      price: 899,
      stock: 0,
      img_url: 'https://cdn.smart-gsm.com/img/picture/xiaomi-poco-m6-5g.jpg',
    },
  ];

   async getProducts(paginationProductDto: PaginationProductDto) {
    // valores por defecto
    const { page = 1, limit = 5 } = paginationProductDto;
    // console.log(typeof page, typeof limit);    

    // calculo el indice de inicio y fin
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Obtener los productos para la pagina actual
    const productosPaginados = this.products.slice(startIndex, endIndex);
    return {page , productosPaginados};    
  }

   async getProductById(id: number) {
    const productById = await this.products.find((product) => product.id === id);
    if (!productById) throw new NotFoundException(`El producto con id ${id} no existe.`); // exception filter de NestJS
    return productById;
  }

  async createProduct(productDto: ProductDto) {
    const newProduct: IProduct = {
      id: this.products.length + 1,
      ...productDto
    }
    this.products.push(newProduct);
    const messageNewProduct = { message: `Producto con id ${newProduct.id} creado correctamente` };
    return messageNewProduct;
  }

  async updateProduct(id:number, updateProductDto: UpdateProductDto) {
    let productDB = await this.getProductById(id);

    this.products = this.products.map((product) => {
      if (product.id === productDB.id) {
        productDB = {
          ...productDB,
          ...updateProductDto,
          id,
        }
        return productDB;
      }
      return product;
    })
    const messageUpdateProduct = { message: `El producto con id ${productDB.id} fue actualizado con exito.` }
    return messageUpdateProduct;
  }

  async deleteProduct(id: number) {
    const productDB = await this.getProductById(id);
    this.products = this.products.filter((product) => product.id !== productDB.id)
    const messageDeleteProduct = { message: `El producto con id ${id} fue borrado con exito.` }
    return messageDeleteProduct;
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
