import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsRepository {
  //DB products LOCAL temporal
  private products = [
    {
      id: 1,
      name: 'POCO X3 PRO',
      description:
        'El Xiaomi Poco X3 Pro cuenta con una pantalla Full HD+ de 6.67 pulgadas y tasa de refresco de 120Hz, el Poco X3 Pro está potenciado por un procesador Snapdragon 860 con variantes de 6GB de memoria RAM con 128GB de almacenamiento o bien 8GB de memoria RAM con 256GB de almacenamiento interno, expandible vía microSD. En cuanto a fotografía, el Poco X3 Pro cuenta con una cámara de cuatro lentes de 48MP, 8MP, 2MP y 2MP en su posterior, mientras que la cámara frontal es de 20 megapixels. Completando las características del Poco X3 Pro encontramos unos parlantes stereo, una batería de 5160 mAh de carga rápida, lector de huellas montado de lado, resistencia al polvo y agua, y corre Android 11.',
      price: 299,
      stock: 5,
      imgUrl: 'https://cdn.smart-gsm.com/img/picture/xiaomi-poco-x3-pro.jpg',
    },
    {
      id: 2,
      name: 'Samsung Galaxy A55 5G',
      description:
        'El Samsung Galaxy A55 debuta con una pantalla AMOLED de 6.6 pulgadas con tasa de refresco de 120Hz y potenciado por un procesador Exynos 1480 con hasta 12GB de RAM y 256GB de almacenamiento. La cámara trasera es triple y está liderada por un sensor de 50MP con OIS, y la cámara selfie es de 32MP. Una batería de 5000 mAh con soporte para carga rápida alimenta al Samsung Galaxy A55, que completa sus características con parlantes stereo, lector de huellas integrado en la pantalla, resistencia al polvo y agua, y corre Android 14.',
      price: 899,
      stock: 5,
      imgUrl: 'https://cdn.smart-gsm.com/img/picture/samsung-galaxy-m55-5g.jpg',
    },
    {
      id: 3,
      name: 'Xiaomi 14 Ultra',
      description:
        'El Xiaomi 14 Ultra se suma a la serie 14 justo antes de su anuncio internacional. El Xiaomi 14 Ultra cuenta con una pantalla AMOLED LTPO de 6.73 pulgadas a resolución QHD+ y tasa de refresco de 120Hz. Por dentro, encontramos un procesador Snapdragon 8 Gen 3 acompañado de hasta 16GB de RAM y hasta 1TB de almacenamiento y una batería de 5000 mAh con soporte para carga rápida por cable e inalámbrica. La cámara principal, desarrollada con Leica, cuenta con cuatro lentes de 50MP siendo el principal de apertura variable con OIS, seguido de una cámara ultrawide y un par de lentes telefoto, uno de ellos periscópico. El Xiaomi 14 Ultra también cuenta con parlantes stereo, lector de huellas bajo la pantalla, es resistente al polvo y agua y corre HyperOS basado en Android 14.',
      price: 699,
      stock: 5,
      imgUrl: 'https://cdn.smart-gsm.com/img/picture/xiaomi-14-ultra.jpg',
    },
    {
      id: 4,
      name: 'Huawei Mate 60 RS Ultimate Design',
      description:
        'El Huawei Mate 60 RS Ultimate Design es una edición especial de la serie Mate 60 con una pantalla OLED LTPO de 6.82 pulgadas y tasa de refresco de 120Hz. Potenciado por un procesador Kirin 9000S, el Mate 60 RS Ultimate cuenta con 16GB de RAM con 512GB o 1TB de almacenamiento interno, cámara triple con sensor principal de 48MP con OIS, sensor telefoto periscópico de 48MP, también con OIS y zoom óptico 3.5x, y una cámara ultrawide de 40MP, cámara selfie de 13MP, acompañada por un sensor ToF para reconocimiento de rostro, batería de 5000 mAh con soporte para carga rápida tanto por cable como en forma inalámbrica, lector de huellas bajo pantalla, parlantes stereo, conectividad satelital para emergencias y resistencia IP68 al polvo y agua.',
      price: 799,
      stock: 5,
      imgUrl:
        'https://cdn.smart-gsm.com/img/picture/huawei-mate-60-rs-ultimate.jpg',
    },
    {
      id: 5,
      name: 'iPhone 15',
      description:
        'El Apple iPhone 15 conserva el diseño de la generación anterior pero incorpora el Dynamic Island a su pantalla de 6.1 pulgadas. Potenciado por un procesador Apple A16 Bionic, el iPhone 15 cuenta con una cámara dual de 48MP + 12MP, y su cámara selfie es de 12 MP, sumando sensores para reconocimiento facial Face ID. El iPhone 15 admite carga inalámbrica para su batería que carga a la mitad en 30 minutos, cuenta con parlantes stereo, resistencia al agua, y corre iOS 17.',
      price: 949,
      stock: 5,
      imgUrl: 'https://cdn.smart-gsm.com/img/picture/apple-iphone-15.jpg',
    },
  ];

  public async getProducts() {
    const products = await this.products;
    return products;
  }
}
