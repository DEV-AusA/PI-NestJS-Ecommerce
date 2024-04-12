import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { FilterPasswordInterceptor } from 'src/interceptors/filterPassword.interceptor';
import { DateAdderInterceptor } from 'src/interceptors/dateAdder.interceptor';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('users') //     <= endPoint
export class UsersController {
  // injecto la dependencia UserServices
  constructor(
    private readonly userServices: UsersService ) {}

  @Get()
  @Roles(Role.Admin) // Roles
  @UseGuards(AuthGuard, RolesGuard) // RolesGuard
  @UseInterceptors(FilterPasswordInterceptor) // interceptor filter password
  getUser(@Query('name') name?: string) {

    // si mandan el name, retorna ese user
    if (name) {
      return this.userServices.getUserByName(name);
    }

    const users = this.userServices.getUsers();    
    return users;
  }

  @Get('admin')
  @Roles(Role.Admin) // Rol Guard TEST
  @UseGuards(AuthGuard, RolesGuard) // 1° valido el login y token 2° valido el rol
  getAdmin() {
    return 'Ruta ADMIN X ACA';
  }

  @Get('auth0/protected')
  getAuth0(@Req() request: any) {
    //recibo la data de registro de Auth0
    console.log(request.oidc.user);
    // function que retorna true del login de Auth0
    console.log(request.oidc.isAuthenticated());    
  }

  // Custom code error 418
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

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto)
  {
    const messageUserUpdated = this.userServices.updateUser(id, updateUserDto);
    return messageUserUpdated;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    const messageUserDeleted = this.userServices.deleteUser(id);
    return messageUserDeleted;
  }
}
