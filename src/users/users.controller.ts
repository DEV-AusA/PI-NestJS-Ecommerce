import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { FilterPasswordInterceptor } from 'src/interceptors/filterPassword.interceptor';
import { DateAdderInterceptor } from 'src/interceptors/dateAdder.interceptor';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users') //     <= endPoint
export class UsersController {
  // injecto la dependencia UserServices
  constructor(
    private readonly userServices: UsersService ) {}

  @Get()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilterPasswordInterceptor) // interceptor filter password
  getUser(@Query('name') name?: string) {
    const users = this.userServices.getUsers();
    // si mandan el name, retorna ese user
    if (name) {
      return this.userServices.getUserByName(name);
    }
    // console.log(AuthGuard);
    
    return users;
  }

  // @Get('profile')
  // @UseInterceptors(FilterPasswordInterceptor) // interceptor filter password
  // getUserProfile(@Headers('token') token?: string){
  //   if (token !== "12345") {
  //     return { message: `Sin acceso` };
  //   }
  //   return { message: `Acceso al perfil de usuario` };
  // }

  // cafetera custom code error 418
  @HttpCode(418)
  @Get('coffee')
  getCoffee(){
    return { message: `No se hacer café, soy una tetera` }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilterPasswordInterceptor) // interceptor filter password
  getUserById(@Param('id', ParseUUIDPipe) id: string){
    const user = this.userServices.getUserById(id)
    return user;
  }

  @Post()
  @UseInterceptors(DateAdderInterceptor) // interceptor filter DateAdd
  createUser(@Body() createUserDto: CreateUserDto, @Req() request){    
    const newUser = this.userServices.createUser({...createUserDto, created_at: request.createdAt});
    return newUser;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto)
  {
    const messageUserUpdated = this.userServices.updateUser(id, updateUserDto)
    return messageUserUpdated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    const messageUserDeleted = this.userServices.deleteUser(id);
    return messageUserDeleted;
  }
}
