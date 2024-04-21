import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { validate as isUUID } from "uuid";
import { FindNameUserDto } from "./dto/find.name.user.dto";

@Injectable()
export class UsersRepository {

  //propiedad para el handle de errores
  private readonly logger = new Logger('UsersRepository')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: string) {

    let user: User;
    if (isUUID(id)) {
      user = await this.userRepository.findOneBy({ id });
    }    
    if (!user) throw new NotFoundException(`El usuario con id ${id} no existe.`)
    const { isAdmin, ...profileUser } = user;
    return profileUser;
  }

  async getUserByName(name: FindNameUserDto) {
    const userByName = await this.userRepository.findOneBy({ name: name.name });
    if (!userByName) throw new NotFoundException(`El usuario con el nombre ${name} no existe.`);
    return userByName;
  }

  async getUserByEmail(email: string) {
    const userByEmail = await this.userRepository.findOneBy( {email} );
    return userByEmail;
  }

  async createUser( createUserDto: CreateUserDto) {

    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return this.userRepository.findOneBy({ name: user.name }); //TEST DE NEW USER
      // return { message: `Usuario con el id ${user.id} creado correctamente.`}; //TEST DE NEW USER

    } catch (error) {    
      this.handleDBExceptions(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {

    await this.getUserById(id);

    try {    
      const user = await this.userRepository.preload({
        id,
        ...updateUserDto
      });
      await this.userRepository.save(user);
      const messageUserUpdated = { message: `Datos del usuario con Id ${id} actualizados correctamente.` };
      return messageUserUpdated;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteUser(id: string) {

    const userFinded = await this.getUserById(id);
    if(!userFinded) throw new NotFoundException(`El usuario con id (${id}) no existe.`);

    try {
      await this.userRepository.delete(userFinded.id);
      return { message: `Usuario con id ${id} eliminado correctamente.`};
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  // handle de errores Users friendly
  private handleDBExceptions(error: any) {
    //errores de la DB
    if (error.code === '23505' ) {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(`Error inesperado verifique los logs del Server`)
  }

}
