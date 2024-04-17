import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { FilterPasswordInterceptor } from '../interceptors/filterPassword.interceptor';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../helpers/roles.enum';
import { RolesGuard } from '../guards/roles.guard';

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
