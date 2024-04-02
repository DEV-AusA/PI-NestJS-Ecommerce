import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
  // DB users local temporal
  private users = [
    {
      id: 1,
      email: 'cesarausa@gmail.com',
      name: 'Cesar Ausa',
      password: '12345',
      address: 'Siempre Viva 828',
      phone: 1138065126,
      country: 'Argentina',
      city: 'Buenos Aires',
    },
    {
      id: 2,
      email: 'nicolasausa@gmail.com',
      name: 'Nicolas Ausa',
      password: '12345',
      address: 'Siempre Viva 829',
      phone: 1122334455,
      country: 'Argentina',
      city: 'Buenos Aires',
    },
    {
      id: 3,
      email: 'leonardoausa@gmail.com',
      name: 'Leonardo Ausa',
      password: '12345',
      address: 'Ceviche 830',
      phone: 1122334455,
      country: 'Peru',
      city: 'Lima',
    },
    {
      id: 4,
      email: 'karolina@gmail.com',
      name: 'Karolina Villanueva',
      password: '12345',
      address: 'Chaufa 831',
      phone: 1122334455,
      country: 'Peru',
      city: 'Lima',
    },
    {
      id: 5,
      email: 'silver@gmail.com',
      name: 'Silverio Apaza',
      password: '12345',
      address: 'Ole 832',
      phone: 1122334455,
      country: 'España',
      city: 'Barcelona',
    },
  ];

  public async getUsers() {
    const users = await this.users;
    return users;
  }
}
