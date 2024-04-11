import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create.user.dto";
import { IUser } from "./interfaces/user.interface";
import { UpdateUserDto } from "./dto/update.user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { validate as isUUID } from "uuid";

@Injectable()
export class UsersRepository {

  //propiedad para el handle de errores
  private readonly logger = new Logger('UsersRepository')

  constructor(
    @InjectRepository(User) // inyecto la entity
    private readonly userRepository: Repository<User>, // el reporitory de typeorm manejara la entity User
    private readonly dataSource: DataSource, // transactions
  ) {}

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: string) {

    let user: User;
    // check UUID
    if (isUUID(id)) {
      user = await this.userRepository.findOneBy({ id });
    }    
    if (!user) throw new NotFoundException(`El usuario con id ${id} no existe.`) //Exception Filter de Nest      
    return user;
  }

  async getUserByName(name: string) {
    const userByName = await this.userRepository.findOneBy({ name });
    if (!userByName) throw new NotFoundException(`El usuario con el nombre ${name} no existe.`); //Exception Filter de Nest      
    return userByName;
  }

  async getUserByEmail(email: string) {
    const userByEmail = await this.userRepository.findOneBy( {email} );
    // if(!userByEmail) return { email: "null", password: "null"}
    return userByEmail;
  }

  async createUser( createUserDto: CreateUserDto) {

    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return { message: `Usuario con el id ${user.id} creado correctamente.`};

    } catch (error) {    
      this.handleDBExceptions(error);
    }

    // // query para transactions
    // const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    // //conecto con la db
    // await queryRunner.connect();
    // // star transactions
    // await queryRunner.startTransaction();
    
    // // creo new user completo        
    // const newUser = queryRunner.manager.create(User, createUserDto);

    // try {
    //   //verifico si existe el usuario
    //   // await queryRunner.manager.findOne(User, { where: { email: createUserDto.email } });
    //   await queryRunner.manager.save(newUser);

    //   await queryRunner.commitTransaction();
    // } catch (error) {

    //   await queryRunner.rollbackTransaction();

    // }
    // finally{
    //   await queryRunner.release()
    // }
    
    // // // save newUser
    // const messageNewUser = { message: `Usuario con el id ${newUser.id} creado correctamente.`};
    // return messageNewUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    //verifico si existe en la DB
    await this.getUserById(id);
    
    try {
      // creo un preload de los datos de updateUserDto para la DB
      const user = await this.userRepository.preload({
        id,
        ...updateUserDto
      })
      //save del user updated
      await this.userRepository.save(user)
      const messageUserUpdated = { message: `Datos del usuario con Id ${id} actualizados correctamente.` };
      return messageUserUpdated;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteUser(id: string) {
    const userFinded = await this.getUserById(id);
    await this.userRepository.delete(userFinded.id)
    return { message: `Usuario con id ${id} eliminado correctamente.`};
  }

  // handle de errores Users friendly
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
