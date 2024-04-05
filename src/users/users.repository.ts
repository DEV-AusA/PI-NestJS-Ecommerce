import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { IUser } from "./interfaces/user.interface";
import { UpdateUserDto } from "./dto/update.user.dto";

@Injectable()
export class UsersRepository {
  // DB users local temporal
  private users: IUser[] = [
    {
      id: 1,
      email: 'cesarausa@gmail.com',
      name: 'Cesar Ausa',
      password: '12345',
      address: 'Siempre Viva 828',
      phone: 1138065126,
      country: 'Argentina',
      city: 'Buenos Aires',
      createdAt: '01/04/2024',
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
      createdAt: '02/04/2024',
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
      createdAt: '03/04/2024',
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
      createdAt: '04/04/2024',
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
      createdAt: '05/04/2024',
    },
  ];

  async getUsers() {
    const users = this.users;
    return users;
  }

  async getUserById(id: number) {
    const user = await this.users.find((user) => user.id === id );
    if (!user) throw new NotFoundException(`El usuario con id ${id} no existe.`) //Exception Filter de Nest
    return user;
  }

  async getUserByName(name: string) {
    const userByName = await this.users.find((user) => user.name === name);
    if (!userByName) throw new NotFoundException(`El usuario con el nombre ${name} no existe.`);
    return userByName;
  }

  async getUserByEmail(email: string) {
    const userByEmail = await this.users.find((user) => user.email === email);
    if(!userByEmail) return { email: "null", password: "null"}
    return userByEmail;
  }

  async createUser( createUserDto: CreateUserDto) {
    const newUser: IUser = {
      id: this.users.length + 1,
      ...createUserDto,
    }
    // save newUser
    this.users.push(newUser);
    const messageNewUser = { message: `Usuario con el id ${newUser.id} creado correctamente.`};
    return messageNewUser;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // de tipo let porque modificaré su valor
    let userDB = await this.users.find((user) => user.id === id );
    if (!userDB) throw new NotFoundException(`El usuario con id ${id} no existe.`) //Exception Filter de Nest
    // actualizando el array de users
    this.users = this.users.map((user) => {
      // si concide el que ingresa con el que encuentra actualizo al user
      if (id === user.id) {
        userDB = {
          ...userDB,
          ...updateUserDto,
          id,
        };
        //return el user con la data modificada
        return userDB;
      }
      return user;

    })
    const messageUserUpdated = { message: `Datos actualizados del usuario con Id ${id} correctamente.` };

    return messageUserUpdated;
  }

  async deleteUser(id: number) {
    const userFinded = await this.getUserById(id);
    this.users = this.users.filter((user) => user.id !== userFinded.id);
    const messageUserDeleted = { message: `Usuario con id ${id} eliminado correctamente.`};
    return messageUserDeleted;
  }

}
